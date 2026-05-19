"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addTeacher } from "@/keen";
import { mintToken } from "@/lib/clinician-auth";

async function assertOperator(): Promise<boolean> {
  const operatorEmail = process.env.KEEN_OPERATOR_EMAIL;
  if (!operatorEmail) return false;
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;
  return Boolean(email && email.toLowerCase() === operatorEmail.toLowerCase());
}

function parseTrust(raw: unknown): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 1.0;
  return Math.max(0, Math.min(3, n));
}

export async function addTeacherAction(
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await assertOperator())) {
    return { ok: false, error: "not authorized" };
  }

  const displayName = String(formData.get("displayName") ?? "").trim();
  const specialty = String(formData.get("specialty") ?? "").trim();
  const trustWeight = parseTrust(formData.get("trustWeight"));

  if (!displayName || !specialty) {
    return { ok: false, error: "Name and specialty are required." };
  }

  await addTeacher({ displayName, specialty, trustWeight });
  return { ok: true };
}

export async function updateTeacherAction(input: {
  id: string;
  displayName: string;
  specialty: string;
  trustWeight: number;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await assertOperator())) {
    return { ok: false, error: "not authorized" };
  }

  const displayName = input.displayName.trim();
  const specialty = input.specialty.trim();
  if (!displayName || !specialty) {
    return { ok: false, error: "Name and specialty are required." };
  }

  await prisma.keenTeacher.update({
    where: { id: input.id },
    data: {
      displayName,
      specialty,
      trustWeight: parseTrust(input.trustWeight),
    },
  });
  return { ok: true };
}

/**
 * Hard-delete a teacher AND all their cases + outcomes (Prisma cascade).
 * Use `archiveTeacherAction` instead when in doubt — it preserves the cases
 * as historical evidence while making the teacher's trust irrelevant.
 */
export async function deleteTeacherAction(
  id: string,
): Promise<{ ok: true; cascadedCases: number } | { ok: false; error: string }> {
  if (!(await assertOperator())) {
    return { ok: false, error: "not authorized" };
  }

  const cascadedCases = await prisma.keenClinicalCase.count({
    where: { teacherId: id },
  });

  await prisma.keenTeacher.delete({ where: { id } });
  return { ok: true, cascadedCases };
}

/**
 * Soft retirement — zero out the trust weight so the retrieval ranker
 * effectively ignores this teacher's cases without losing them.
 */
export async function archiveTeacherAction(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await assertOperator())) {
    return { ok: false, error: "not authorized" };
  }
  await prisma.keenTeacher.update({
    where: { id },
    data: { trustWeight: 0 },
  });
  return { ok: true };
}

/**
 * Mint a one-click invite URL for a clinician. The URL embeds a signed token
 * that exchanges for an HttpOnly cookie on first click. Safe to share via
 * WhatsApp — without the KEEN_CLINICIAN_SECRET nothing about the token can be
 * forged or replayed against a different teacher.
 */
export async function generateInviteAction(
  teacherId: string,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (!(await assertOperator())) {
    return { ok: false, error: "not authorized" };
  }
  if (!process.env.KEEN_CLINICIAN_SECRET) {
    return {
      ok: false,
      error: "KEEN_CLINICIAN_SECRET env var is not set on this deployment",
    };
  }

  const teacher = await prisma.keenTeacher.findUnique({
    where: { id: teacherId },
    select: { id: true, revoked: true },
  });
  if (!teacher) return { ok: false, error: "teacher not found" };

  // Auto-un-revoke when a fresh invite is generated.
  if (teacher.revoked) {
    await prisma.keenTeacher.update({
      where: { id: teacherId },
      data: { revoked: false },
    });
  }

  const token = mintToken(teacherId);
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://nutrimama-v3.vercel.app";
  const url = `${origin}/api/clinician/auth?token=${token}`;
  return { ok: true, url };
}

export async function setRevokedAction(
  teacherId: string,
  revoked: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await assertOperator())) {
    return { ok: false, error: "not authorized" };
  }
  await prisma.keenTeacher.update({
    where: { id: teacherId },
    data: { revoked },
  });
  return { ok: true };
}
