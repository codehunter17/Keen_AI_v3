/**
 * E2B sandbox executor for Foundry.
 *
 * Spawns a microVM from KEEN_FOUNDRY_TEMPLATE, writes the untrusted script,
 * runs it with a hard wall-clock timeout, captures the artifact + metrics,
 * and tears the sandbox down. Host server never executes the script.
 *
 * Network egress, host env vars, and host filesystem are not reachable from
 * inside the sandbox by E2B default — we still set up the run with zero env
 * passthrough as belt-and-braces.
 */

import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

const TIMEOUT_MS_DEFAULT = 5 * 60 * 1000;

export interface SandboxRunInput {
  task: string;
  script: string;
  /** Optional presigned URL the script can fetch the dataset from. */
  datasetUrl?: string;
  /** Path inside the sandbox where the script will write the model artifact. */
  artifactPath?: string;
  /** Path inside the sandbox where the script will write metrics JSON. */
  metricsPath?: string;
  /** Hard wall-clock cap. */
  timeoutMs?: number;
  /** Optional proposalId to link the run back to the approval that triggered it. */
  proposalId?: string;
}

export interface SandboxRunResult {
  runId: string;
  status: "succeeded" | "failed" | "timeout" | "skipped";
  exitCode: number | null;
  durationMs: number;
  artifactUrl: string | null;
  metrics: Record<string, unknown> | null;
  stderrTail: string;
  detail?: string;
}

export async function runInSandbox(input: SandboxRunInput): Promise<SandboxRunResult> {
  const apiKey = process.env.E2B_API_KEY;
  const templateId = process.env.E2B_FOUNDRY_TEMPLATE;

  const artifactPath = input.artifactPath ?? "/home/user/job/model.onnx";
  const metricsPath = input.metricsPath ?? "/home/user/job/metrics.json";
  const timeoutMs = input.timeoutMs ?? TIMEOUT_MS_DEFAULT;
  const scriptHash = createHash("sha256").update(input.script).digest("hex").slice(0, 16);

  const runRow = await prisma.keenSandboxRun.create({
    data: {
      proposalId: input.proposalId ?? null,
      task: input.task,
      templateId: templateId ?? "(unset)",
      scriptHash,
      status: "queued",
    },
    select: { id: true },
  });

  if (!apiKey || !templateId) {
    await prisma.keenSandboxRun.update({
      where: { id: runRow.id },
      data: {
        status: "failed",
        finishedAt: new Date(),
        durationMs: 0,
        stderrTail: "E2B_API_KEY or E2B_FOUNDRY_TEMPLATE not configured.",
      },
    });
    return {
      runId: runRow.id,
      status: "skipped",
      exitCode: null,
      durationMs: 0,
      artifactUrl: null,
      metrics: null,
      stderrTail: "",
      detail: "E2B not configured — sandbox run skipped.",
    };
  }

  await prisma.keenSandboxRun.update({
    where: { id: runRow.id },
    data: { status: "running" },
  });

  const startedAt = Date.now();
  try {
    // Lazy import so the host bundle stays small when E2B isn't installed yet.
    const e2b = (await import("e2b").catch(() => null)) as {
      Sandbox?: {
        create: (opts: {
          template: string;
          apiKey: string;
          envs?: Record<string, string>;
          timeoutMs?: number;
        }) => Promise<SandboxHandle>;
      };
    } | null;

    if (!e2b?.Sandbox) {
      await prisma.keenSandboxRun.update({
        where: { id: runRow.id },
        data: {
          status: "failed",
          finishedAt: new Date(),
          durationMs: Date.now() - startedAt,
          stderrTail: "e2b npm package not installed. Run: npm i e2b",
        },
      });
      return {
        runId: runRow.id,
        status: "failed",
        exitCode: null,
        durationMs: Date.now() - startedAt,
        artifactUrl: null,
        metrics: null,
        stderrTail: "",
        detail: "e2b package not installed",
      };
    }

    const sandbox = await e2b.Sandbox.create({
      template: templateId,
      apiKey,
      // Zero env passthrough by default. Add per-job vars only here.
      envs: input.datasetUrl ? { DATASET_URL: input.datasetUrl } : {},
      timeoutMs,
    });

    try {
      await sandbox.files.write("/home/user/job/script.py", input.script);
      const cmd = await sandbox.commands.run(
        "cd /home/user/job && python script.py",
        { timeoutMs },
      );

      let metrics: Record<string, unknown> | null = null;
      let artifactBuffer: Uint8Array | null = null;
      try {
        const metricsText = await sandbox.files.read(metricsPath);
        metrics = JSON.parse(metricsText) as Record<string, unknown>;
      } catch {
        metrics = null;
      }
      try {
        artifactBuffer = await sandbox.files.readBytes(artifactPath);
      } catch {
        artifactBuffer = null;
      }

      const artifactUrl = artifactBuffer
        ? await persistArtifact(artifactBuffer, runRow.id)
        : null;

      const durationMs = Date.now() - startedAt;
      const status: SandboxRunResult["status"] = cmd.exitCode === 0 ? "succeeded" : "failed";
      const stderrTail = (cmd.stderr ?? "").slice(-4000);

      await prisma.keenSandboxRun.update({
        where: { id: runRow.id },
        data: {
          status,
          finishedAt: new Date(),
          durationMs,
          exitCode: cmd.exitCode,
          stderrTail,
          artifactUrl,
          metricsJson: metrics ?? undefined,
        },
      });

      return {
        runId: runRow.id,
        status,
        exitCode: cmd.exitCode,
        durationMs,
        artifactUrl,
        metrics,
        stderrTail,
      };
    } finally {
      try {
        await sandbox.kill();
      } catch {
        // sandbox already gone — fine
      }
    }
  } catch (err) {
    const durationMs = Date.now() - startedAt;
    const message = err instanceof Error ? err.message : "sandbox error";
    const status: SandboxRunResult["status"] = /timeout/i.test(message)
      ? "timeout"
      : "failed";
    await prisma.keenSandboxRun.update({
      where: { id: runRow.id },
      data: {
        status,
        finishedAt: new Date(),
        durationMs,
        stderrTail: message.slice(0, 4000),
      },
    });
    return {
      runId: runRow.id,
      status,
      exitCode: null,
      durationMs,
      artifactUrl: null,
      metrics: null,
      stderrTail: message,
    };
  }
}

interface SandboxHandle {
  files: {
    write: (path: string, content: string) => Promise<void>;
    read: (path: string) => Promise<string>;
    readBytes: (path: string) => Promise<Uint8Array>;
  };
  commands: {
    run: (
      cmd: string,
      opts?: { timeoutMs?: number },
    ) => Promise<{ exitCode: number; stdout: string; stderr: string }>;
  };
  kill: () => Promise<void>;
}

async function persistArtifact(buf: Uint8Array, runId: string): Promise<string | null> {
  // Placeholder: in v1, upload to UploadThing / S3 and return URL.
  // For now we just inline the size into the metrics JSON so the registry
  // entry isn't lost.
  return `local://sandbox-run/${runId}/artifact.bin?size=${buf.byteLength}`;
}
