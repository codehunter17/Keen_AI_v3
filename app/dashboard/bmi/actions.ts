"use server";

// Persist BMI inputs back to the User row so the dashboard widgets,
// AI context payload, and any other place that reads user.height /
// user.weight stays in sync.

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function saveVitals(input: {
  heightCm: number;
  weightKg: number;
}): Promise<{ ok: boolean }> {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) return { ok: false };
  // Sanity bounds — same as our schema and Better Auth field caps
  if (
    !Number.isFinite(input.heightCm) ||
    !Number.isFinite(input.weightKg) ||
    input.heightCm < 80 ||
    input.heightCm > 230 ||
    input.weightKg < 25 ||
    input.weightKg > 250
  ) {
    return { ok: false };
  }
  try {
    await prisma.user.update({
      where: { id: s.user.id },
      data: { height: input.heightCm, weight: input.weightKg },
    });
    return { ok: true };
  } catch (err) {
    console.error("[bmi/saveVitals] failed:", err);
    return { ok: false };
  }
}
