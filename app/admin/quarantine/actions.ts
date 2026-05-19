"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function assertOperator(): Promise<boolean> {
  const operatorEmail = process.env.KEEN_OPERATOR_EMAIL;
  if (!operatorEmail) return false;
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;
  return Boolean(email && email.toLowerCase() === operatorEmail.toLowerCase());
}

export async function decideQuarantineAction(
  id: string,
  action: "release" | "purge",
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await assertOperator())) {
    return { ok: false, error: "not authorized" };
  }

  if (action === "release") {
    await prisma.keenQuarantine.update({
      where: { id },
      data: { status: "released", decidedAt: new Date() },
    });
    return { ok: true };
  }

  if (action === "purge") {
    await prisma.keenQuarantine.update({
      where: { id },
      data: { status: "purged", decidedAt: new Date() },
    });
    return { ok: true };
  }

  return { ok: false, error: "invalid action" };
}
