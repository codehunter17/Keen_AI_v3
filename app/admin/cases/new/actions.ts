"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ingestCase } from "@/keen";

async function assertOperator(): Promise<boolean> {
  const operatorEmail = process.env.KEEN_OPERATOR_EMAIL;
  if (!operatorEmail) return false;
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;
  return Boolean(email && email.toLowerCase() === operatorEmail.toLowerCase());
}

function parseList(input: string | null): string[] {
  if (!input) return [];
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);
}

export async function createCaseAction(
  fd: FormData,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!(await assertOperator())) return { ok: false, error: "not authorized" };

  const teacherId = String(fd.get("teacherId") ?? "");
  const occurredAtRaw = String(fd.get("occurredAt") ?? "");
  const decisionType = String(fd.get("decisionType") ?? "other");
  const decisionDetails = String(fd.get("decisionDetails") ?? "").trim();
  const reasoning = String(fd.get("reasoning") ?? "").trim();
  const labsRaw = String(fd.get("labsJson") ?? "").trim();

  if (!teacherId || !occurredAtRaw || !decisionDetails) {
    return { ok: false, error: "teacher, date and decision are required" };
  }

  const occurredAt = new Date(occurredAtRaw);
  if (Number.isNaN(occurredAt.getTime())) {
    return { ok: false, error: "invalid date" };
  }

  let labs: Record<string, number | string> | undefined;
  if (labsRaw) {
    try {
      const parsed = JSON.parse(labsRaw) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        labs = parsed as Record<string, number | string>;
      }
    } catch {
      return { ok: false, error: "labs JSON is malformed" };
    }
  }

  const created = await ingestCase({
    teacherId,
    teacherSpecialty: "", // not used by the writer — kept in type for the reader side
    occurredAt,
    inputs: {
      ageBand: (fd.get("ageBand") as string) || undefined,
      lifeStage: (fd.get("lifeStage") as string) || undefined,
      symptoms: parseList(fd.get("symptoms") as string | null),
      labs,
      history: (fd.get("history") as string) || undefined,
    },
    differential: parseList(fd.get("differential") as string | null),
    decision: {
      type: decisionType as
        | "test"
        | "drug"
        | "lifestyle"
        | "referral"
        | "watch"
        | "other",
      details: decisionDetails,
    },
    reasoning: reasoning || undefined,
  });

  return { ok: true, id: created.id };
}
