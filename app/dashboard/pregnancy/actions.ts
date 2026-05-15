"use server";

// Switch tracking mode in/out of pregnancy from the Pregnancy page itself,
// so users never have to bounce to Settings to start a pregnancy.
//
// Effect of startPregnancyTracking:
//   - User.pregnancyStage     = "PREGNANT"
//   - User.pregnancyWeek      = (provided)
//   - User.lifeStage          = "PREGNANT"
//   - User.dueDate            = today + (40 - weeks) * 7 days  (rough EDD)
//
// Period tracking continues to work in parallel — cycle logs and the
// Cycle page don't depend on pregnancyStage. When the user later sets
// stage back to PRE_PREGNANT/POSTPARTUM, the cycle tab carries on as is.

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const startSchema = z.object({
  weeks: z.number().int().min(1).max(40),
});

export async function startPregnancyTracking(
  input: z.infer<typeof startSchema>,
): Promise<{ ok: boolean; reason?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { ok: false, reason: "UNAUTHORIZED" };

  const parsed = startSchema.safeParse(input);
  if (!parsed.success) return { ok: false, reason: "INVALID" };

  const weeks = parsed.data.weeks;
  // EDD = today + (40 - currentWeek) weeks. Standard back-calc.
  const remaining = (40 - weeks) * 7;
  const dueDate = new Date(Date.now() + remaining * 86_400_000);

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        pregnancyStage: "PREGNANT",
        pregnancyWeek: weeks,
        lifeStage: "PREGNANT",
        dueDate,
      },
    });
    return { ok: true };
  } catch (err) {
    console.error("[startPregnancyTracking] failed:", err);
    return { ok: false, reason: "SAVE_FAILED" };
  }
}

export async function stopPregnancyTracking(): Promise<{ ok: boolean }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { ok: false };

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        pregnancyStage: "PRE_PREGNANT",
        pregnancyWeek: null,
        // Don't blank lifeStage — that would break onboarding gates.
        // User can refine to TRYING_TO_CONCEIVE / ADULT_MENSTRUATING in Settings.
        dueDate: null,
      },
    });
    return { ok: true };
  } catch (err) {
    console.error("[stopPregnancyTracking] failed:", err);
    return { ok: false };
  }
}

export async function updatePregnancyWeek(input: {
  weeks: number;
}): Promise<{ ok: boolean }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { ok: false };
  const parsed = startSchema.safeParse(input);
  if (!parsed.success) return { ok: false };

  const remaining = (40 - parsed.data.weeks) * 7;
  const dueDate = new Date(Date.now() + remaining * 86_400_000);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { pregnancyWeek: parsed.data.weeks, dueDate },
  });
  return { ok: true };
}
