"use server";

// One-tap quick-log actions for the dashboard:
//   - logMoodToday(emoji)   — single emoji, upserts today's DailyLog
//   - drinkOneGlass()       — increments today's waterGlasses by 1
//
// Both are idempotent on the date — running them many times on the same
// day updates today's row instead of creating duplicates.

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { startOfDay, endOfDay } from "date-fns";

async function requireUserId(): Promise<string | null> {
  const s = await auth.api.getSession({ headers: await headers() });
  return s?.user.id ?? null;
}

const MOODS = ["😊", "😐", "😔", "😴", "🤩", "😣"] as const;
export type Mood = (typeof MOODS)[number];

function isValidMood(s: string): s is Mood {
  return (MOODS as readonly string[]).includes(s);
}

export async function logMoodToday(
  emoji: string,
): Promise<{ ok: boolean; reason?: string }> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, reason: "UNAUTHORIZED" };
  if (!isValidMood(emoji)) return { ok: false, reason: "INVALID_MOOD" };

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
        data: { mood: emoji },
      });
    } else {
      await prisma.dailyLog.create({
        data: {
          userId,
          date: today,
          mood: emoji,
          meals: [],
          symptoms: [],
          waterGlasses: 0,
        },
      });
    }
    return { ok: true };
  } catch (err) {
    console.error("[quick-log:mood] save failed:", err);
    return { ok: false, reason: "SAVE_FAILED" };
  }
}

export async function drinkOneGlass(): Promise<{
  ok: boolean;
  glasses?: number;
  reason?: string;
}> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, reason: "UNAUTHORIZED" };

  const today = startOfDay(new Date());
  const tomorrow = endOfDay(new Date());

  try {
    const existing = await prisma.dailyLog.findFirst({
      where: { userId, date: { gte: today, lte: tomorrow } },
      select: { id: true, waterGlasses: true },
    });
    if (existing) {
      const updated = await prisma.dailyLog.update({
        where: { id: existing.id },
        data: { waterGlasses: { increment: 1 } },
        select: { waterGlasses: true },
      });
      return { ok: true, glasses: updated.waterGlasses };
    } else {
      const created = await prisma.dailyLog.create({
        data: {
          userId,
          date: today,
          meals: [],
          symptoms: [],
          waterGlasses: 1,
        },
        select: { waterGlasses: true },
      });
      return { ok: true, glasses: created.waterGlasses };
    }
  } catch (err) {
    console.error("[quick-log:water] save failed:", err);
    return { ok: false, reason: "SAVE_FAILED" };
  }
}

export async function getTodayQuickState(): Promise<{
  mood: string | null;
  waterGlasses: number;
}> {
  const userId = await requireUserId();
  if (!userId) return { mood: null, waterGlasses: 0 };
  const today = startOfDay(new Date());
  const tomorrow = endOfDay(new Date());
  const row = await prisma.dailyLog.findFirst({
    where: { userId, date: { gte: today, lte: tomorrow } },
    select: { mood: true, waterGlasses: true },
  });
  return {
    mood: row?.mood ?? null,
    waterGlasses: row?.waterGlasses ?? 0,
  };
}
