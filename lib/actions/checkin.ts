"use server";

// Daily Check-in — 4-step morning routine.
// Writes the full payload into DailyLog.checkin JSON so the AI context,
// dashboard widgets, and weekly report can all read structured input.
//
// One row per user per UTC day. Re-submitting on the same day updates
// the existing row (upsert pattern via findFirst → update / create).

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { startOfDay, endOfDay } from "date-fns";
import { z } from "zod";

const schema = z.object({
  mealsPlanned: z.number().int().min(1).max(8),
  supplements: z.array(
    z.enum(["IRON", "FOLIC_ACID", "CALCIUM", "MULTIVITAMIN", "NONE"]),
  ),
  waterTargetL: z.number().min(0.5).max(5),
  mood: z.string().max(40).optional(),
  symptoms: z.array(z.string()).max(10),
});

export type CheckInInput = z.infer<typeof schema>;

export async function submitDailyCheckin(
  input: CheckInInput,
): Promise<{ ok: boolean; reason?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { ok: false, reason: "UNAUTHORIZED" };

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    console.warn("[checkin] invalid input:", parsed.error.message);
    return { ok: false, reason: "INVALID" };
  }
  const data = parsed.data;

  const today = startOfDay(new Date());
  const tomorrow = endOfDay(new Date());

  const checkinPayload = {
    mealsPlanned: data.mealsPlanned,
    supplements: data.supplements,
    waterTargetL: data.waterTargetL,
    symptoms: data.symptoms,
    completedAt: new Date().toISOString(),
  };

  try {
    // Upsert: one DailyLog per user per day
    const existing = await prisma.dailyLog.findFirst({
      where: {
        userId: session.user.id,
        date: { gte: today, lte: tomorrow },
      },
      select: { id: true },
    });

    if (existing) {
      await prisma.dailyLog.update({
        where: { id: existing.id },
        data: {
          mood: data.mood ?? undefined,
          symptoms: data.symptoms,
          checkin: checkinPayload,
        },
      });
    } else {
      await prisma.dailyLog.create({
        data: {
          userId: session.user.id,
          date: today,
          mood: data.mood ?? null,
          symptoms: data.symptoms,
          meals: { planned: data.mealsPlanned },
          waterGlasses: 0,
          checkin: checkinPayload,
        },
      });
    }

    return { ok: true };
  } catch (err) {
    console.error("[checkin] save failed:", err);
    return { ok: false, reason: "SAVE_FAILED" };
  }
}

/** Has the user completed today's check-in? */
export async function hasCheckedInToday(): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return false;
  const today = startOfDay(new Date());
  const tomorrow = endOfDay(new Date());
  const row = await prisma.dailyLog.findFirst({
    where: {
      userId: session.user.id,
      date: { gte: today, lte: tomorrow },
      checkin: { not: undefined },
    },
    select: { id: true },
  });
  return Boolean(row);
}
