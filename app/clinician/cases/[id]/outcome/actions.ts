"use server";

import { prisma } from "@/lib/prisma";
import { getClinician } from "@/lib/clinician-auth";
import { scrubText } from "@/keen";

const STATUSES = ["improved", "unchanged", "worsened", "unknown"] as const;
type Status = (typeof STATUSES)[number];

function isStatus(v: string): v is Status {
  return (STATUSES as readonly string[]).includes(v);
}

export async function logOutcomeAction(
  caseId: string,
  fd: FormData,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const clinician = await getClinician();
  if (!clinician) return { ok: false, error: "session expired" };

  const c = await prisma.keenClinicalCase.findUnique({
    where: { id: caseId },
    select: { teacherId: true, withdrawnAt: true },
  });
  if (!c) return { ok: false, error: "case not found" };
  if (c.teacherId !== clinician.teacherId) {
    return { ok: false, error: "not your case" };
  }
  if (c.withdrawnAt) {
    return { ok: false, error: "case is withdrawn — cannot add outcomes" };
  }

  const checkpointRaw = String(fd.get("checkpointAt") ?? "");
  const status = String(fd.get("status") ?? "");
  const notes = scrubText(String(fd.get("notes") ?? "").trim());

  if (!checkpointRaw) return { ok: false, error: "checkpoint date required" };
  if (!isStatus(status)) return { ok: false, error: "invalid status" };

  const checkpointAt = new Date(checkpointRaw);
  if (Number.isNaN(checkpointAt.getTime())) {
    return { ok: false, error: "invalid checkpoint date" };
  }

  const created = await prisma.keenOutcome.create({
    data: {
      caseId,
      checkpointAt,
      status,
      notes: notes || null,
    },
  });

  return { ok: true, id: created.id };
}
