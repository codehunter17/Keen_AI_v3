"use server";

import { prisma } from "@/lib/prisma";
import { getClinician } from "@/lib/clinician-auth";
import { scrubText, scrubPayload } from "@/keen";

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

function parseList(input: string | null): string[] {
  if (!input) return [];
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);
}

export async function updateClinicianCaseAction(
  caseId: string,
  fd: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const clinician = await getClinician();
  if (!clinician) return { ok: false, error: "session expired" };

  const existing = await prisma.keenClinicalCase.findUnique({
    where: { id: caseId },
    select: { teacherId: true, createdAt: true, withdrawnAt: true },
  });
  if (!existing) return { ok: false, error: "case not found" };
  if (existing.teacherId !== clinician.teacherId) {
    return { ok: false, error: "not your case" };
  }
  if (existing.withdrawnAt) {
    return { ok: false, error: "case is withdrawn and cannot be edited" };
  }
  const elapsed = Date.now() - existing.createdAt.getTime();
  if (elapsed > EDIT_WINDOW_MS) {
    return {
      ok: false,
      error: "Edit window closed (24h). Log a new case instead.",
    };
  }

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

  const inputs = scrubPayload({
    ageBand: (fd.get("ageBand") as string) || undefined,
    lifeStage: (fd.get("lifeStage") as string) || undefined,
    symptoms: parseList(fd.get("symptoms") as string | null),
    labs,
    history: history || undefined,
  });
  const differential = parseList(fd.get("differential") as string | null);

  await prisma.keenClinicalCase.update({
    where: { id: caseId },
    data: {
      occurredAt,
      inputs: inputs as object,
      // Always set — passing undefined would keep stale values when the
      // clinician clears the field, which is not what they intended.
      differential: differential as unknown[] as object,
      decision: {
        type: decisionType,
        details: decisionDetails,
      } as object,
      reasoning: reasoning || null,
    },
  });

  return { ok: true };
}
