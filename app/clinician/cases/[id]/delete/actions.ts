"use server";

import { prisma } from "@/lib/prisma";
import { getClinician } from "@/lib/clinician-auth";
import { scrubText } from "@/keen";

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * Within 24h of creation = hard delete (cascade outcomes). Treated as "still
 * drafting", removed entirely.
 *
 * After 24h = withdraw. Case row preserved with withdrawnAt + reason for audit
 * trail. Read sites filter it out so Keen reasoning never sees it again.
 */
export async function deleteOrWithdrawCaseAction(
  caseId: string,
  reason: string,
): Promise<
  | { ok: true; mode: "deleted" | "withdrawn" }
  | { ok: false; error: string }
> {
  const clinician = await getClinician();
  if (!clinician) return { ok: false, error: "session expired" };

  const existing = await prisma.keenClinicalCase.findUnique({
    where: { id: caseId },
    select: {
      teacherId: true,
      createdAt: true,
      withdrawnAt: true,
    },
  });
  if (!existing) return { ok: false, error: "case not found" };
  if (existing.teacherId !== clinician.teacherId) {
    return { ok: false, error: "not your case" };
  }
  if (existing.withdrawnAt) {
    return { ok: false, error: "case is already withdrawn" };
  }

  const elapsed = Date.now() - existing.createdAt.getTime();
  const inEditWindow = elapsed <= EDIT_WINDOW_MS;
  const trimmedReason = scrubText(reason.trim());

  if (inEditWindow) {
    // Still in draft mode — hard delete with cascade to outcomes.
    await prisma.keenClinicalCase.delete({ where: { id: caseId } });
    return { ok: true, mode: "deleted" };
  }

  // After the window — require a reason so the audit log captures intent.
  if (!trimmedReason || trimmedReason.length < 5) {
    return {
      ok: false,
      error: "withdrawal reason required (at least 5 characters)",
    };
  }

  await prisma.keenClinicalCase.update({
    where: { id: caseId },
    data: {
      withdrawnAt: new Date(),
      withdrawnReason: trimmedReason,
      withdrawnBy: "clinician",
    },
  });
  return { ok: true, mode: "withdrawn" };
}
