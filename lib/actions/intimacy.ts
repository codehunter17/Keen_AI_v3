"use server";

// Intercourse tracking — privacy-first.
//
// PRIVACY CONTRACT (enforced everywhere this field is read):
//   - Never included in AI prompts (chat / weekly report / nutrition).
//   - Never visible to dependents or partner views.
//   - Never appears in /api/share or exports unless explicitly opted in.
//   - Stored as a plain boolean per day, no notes / no count, so the
//     surface area for accidental leaks is minimal.
//
// Purpose is purely for fertility-window tracking — knowing whether
// intercourse happened in the user's fertile window improves conception
// predictions and helps surface "you may want a pregnancy test" copy.

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { startOfDay, endOfDay } from "date-fns";

async function requireUserId(): Promise<string | null> {
  const s = await auth.api.getSession({ headers: await headers() });
  return s?.user.id ?? null;
}

export async function logIntimacyToday(
  intimate: boolean,
): Promise<{ ok: boolean; reason?: string }> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, reason: "UNAUTHORIZED" };
  const today = startOfDay(new Date());
  const tomorrow = endOfDay(new Date());

  try {
    const existing = await prisma.dailyLog.findFirst({
      where: { userId, date: { gte: today, lte: tomorrow } },
      select: { id: true },
    });
    if (existing) {
      await prisma.dailyLog.update({
        where: { id: existing.id },
        data: { intimate },
      });
    } else {
      await prisma.dailyLog.create({
        data: {
          userId,
          date: today,
          intimate,
          meals: [],
          symptoms: [],
          waterGlasses: 0,
        },
      });
    }
    return { ok: true };
  } catch (err) {
    console.error("[intimacy] save failed:", err);
    return { ok: false, reason: "SAVE_FAILED" };
  }
}

export async function getIntimacyToday(): Promise<boolean> {
  const userId = await requireUserId();
  if (!userId) return false;
  const today = startOfDay(new Date());
  const tomorrow = endOfDay(new Date());
  const row = await prisma.dailyLog.findFirst({
    where: { userId, date: { gte: today, lte: tomorrow } },
    select: { intimate: true },
  });
  return Boolean(row?.intimate);
}
