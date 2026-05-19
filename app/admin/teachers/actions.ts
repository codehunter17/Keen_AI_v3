"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { addTeacher } from "@/keen";

async function assertOperator(): Promise<boolean> {
  const operatorEmail = process.env.KEEN_OPERATOR_EMAIL;
  if (!operatorEmail) return false;
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;
  return Boolean(email && email.toLowerCase() === operatorEmail.toLowerCase());
}

export async function addTeacherAction(
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await assertOperator())) {
    return { ok: false, error: "not authorized" };
  }

  const displayName = String(formData.get("displayName") ?? "").trim();
  const specialty = String(formData.get("specialty") ?? "").trim();
  const trustWeightRaw = String(formData.get("trustWeight") ?? "1");
  const trustWeight = Number.isFinite(Number(trustWeightRaw))
    ? Number(trustWeightRaw)
    : 1.0;

  if (!displayName || !specialty) {
    return { ok: false, error: "Name and specialty are required." };
  }

  await addTeacher({ displayName, specialty, trustWeight });
  return { ok: true };
}
