"use server";

import { getClinician } from "@/lib/clinician-auth";
import { scrubPayload, scrubText } from "@/keen";
import { ingestCase } from "@/keen";

function parseList(input: string | null): string[] {
  if (!input) return [];
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);
}

export async function createClinicianCaseAction(
  fd: FormData,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const clinician = await getClinician();
  if (!clinician) return { ok: false, error: "session expired" };

  const occurredAtRaw = String(fd.get("occurredAt") ?? "");
  const decisionType = String(fd.get("decisionType") ?? "other");
  const decisionDetails = scrubText(String(fd.get("decisionDetails") ?? "").trim());
  const reasoning = scrubText(String(fd.get("reasoning") ?? "").trim());
  const history = scrubText(String(fd.get("history") ?? "").trim());
  const labsRaw = String(fd.get("labsJson") ?? "").trim();

  if (!occurredAtRaw || !decisionDetails) {
    return { ok: false, error: "date and decision are required" };
  }

  const occurredAt = new Date(occurredAtRaw);
  if (Number.isNaN(occurredAt.getTime())) {
    return { ok: false, error: "invalid date" };
  }

  // Labs are optional. If parseable JSON, store as structured object; otherwise
  // keep the raw text under a `notes` key so the clinician's intent isn't lost.
  let labs: Record<string, number | string> | undefined;
  if (labsRaw) {
    try {
      const parsed = JSON.parse(labsRaw) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        labs = parsed as Record<string, number | string>;
      } else {
        labs = { notes: labsRaw };
      }
    } catch {
      labs = { notes: labsRaw };
    }
  }

  const created = await ingestCase({
    teacherId: clinician.teacherId,
    teacherSpecialty: clinician.specialty,
    occurredAt,
    inputs: scrubPayload({
      ageBand: (fd.get("ageBand") as string) || undefined,
      lifeStage: (fd.get("lifeStage") as string) || undefined,
      symptoms: parseList(fd.get("symptoms") as string | null),
      labs,
      history: history || undefined,
    }),
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
