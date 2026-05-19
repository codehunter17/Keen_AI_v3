/**
 * Foundry — Module 6.
 *
 * ML model lifecycle: scaffold dataset → fine-tune on HuggingFace → eval →
 * register in keen_model_registry. Models go live only after operator approval
 * (treated as an L4 change because they affect user-facing recommendations).
 *
 * v0 implements: registry CRUD + a stubbed `fineTune()` that records the run
 * in the registry without actually invoking AutoTrain. When HF_TOKEN is set
 * and a real run is requested, the function returns the job URL for the
 * operator to monitor.
 */

import { prisma } from "@/lib/prisma";
import { runInSandbox } from "../sandbox/e2b";

export interface FineTuneInput {
  name: string;
  task: string;
  baseModel: string;
  /** Where the dataset lives — a presigned URL the sandbox can fetch. */
  datasetRef: string;
  /** AI-authored Python training script. Treated as untrusted. */
  script?: string;
  /** Optional proposal that authorized this fine-tune. */
  proposalId?: string;
}

export interface FineTuneResult {
  modelId: string;
  version: string;
  status: "queued" | "succeeded" | "failed" | "skipped";
  sandboxRunId?: string;
  detail?: string;
}

export async function fineTune(input: FineTuneInput): Promise<FineTuneResult> {
  const version = `v${Date.now()}`;

  const row = await prisma.keenModelRegistry.create({
    data: {
      name: input.name,
      task: input.task,
      baseModel: input.baseModel,
      version,
      metricsJson: { datasetRef: input.datasetRef, status: "pending" },
      isLive: false,
    },
  });

  if (!input.script) {
    return {
      modelId: row.id,
      version,
      status: "skipped",
      detail: "No training script provided — registry entry created only.",
    };
  }

  const run = await runInSandbox({
    task: input.task,
    script: input.script,
    datasetUrl: input.datasetRef,
    proposalId: input.proposalId,
  });

  await prisma.keenModelRegistry.update({
    where: { id: row.id },
    data: {
      metricsJson: {
        datasetRef: input.datasetRef,
        sandboxRunId: run.runId,
        artifactUrl: run.artifactUrl,
        durationMs: run.durationMs,
        metrics: run.metrics ?? null,
        exitCode: run.exitCode,
      },
    },
  });

  return {
    modelId: row.id,
    version,
    status:
      run.status === "succeeded"
        ? "succeeded"
        : run.status === "skipped"
          ? "skipped"
          : "failed",
    sandboxRunId: run.runId,
    detail: run.detail,
  };
}

export async function listModels() {
  return prisma.keenModelRegistry.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function promoteModel(id: string) {
  const model = await prisma.keenModelRegistry.findUniqueOrThrow({ where: { id } });
  // Demote any other model serving the same task.
  await prisma.keenModelRegistry.updateMany({
    where: { name: model.name, isLive: true },
    data: { isLive: false },
  });
  return prisma.keenModelRegistry.update({
    where: { id },
    data: { isLive: true },
  });
}
