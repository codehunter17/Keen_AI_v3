"use server";

// Daily wellness tracking — water, BMI, mood, activity, sleep — and the
// streak engine that keeps users coming back.

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { calcBmi, dailyWaterTargetMl } from "@/lib/bmi";
import {
  startOfDay,
  endOfDay,
  differenceInCalendarDays,
  subDays,
} from "date-fns";

async function s() {
  const sess = await auth.api.getSession({ headers: await headers() });
  if (!sess) throw new Error("UNAUTHORIZED");
  return sess;
}

// ─── BMI ─────────────────────────────────────────────────────
export async function computeBmi() {
  const sess = await s();
  const u = await prisma.user.findUnique({
    where: { id: sess.user.id },
    select: { height: true, weight: true },
  });
  if (!u?.height || !u?.weight) return null;
  return calcBmi(u.height, u.weight);
}

// ─── Water tracker ───────────────────────────────────────────
const drinkSchema = z.object({
  ml: z.number().int().min(50).max(2000),
});

export async function logWaterIntake(input: z.infer<typeof drinkSchema>) {
  const sess = await s();
  const data = drinkSchema.parse(input);

  const today = await prisma.dailyLog.findFirst({
    where: {
      userId: sess.user.id,
      date: { gte: startOfDay(new Date()), lte: endOfDay(new Date()) },
    },
  });

  if (today) {
    const newGlasses = today.waterGlasses + Math.round(data.ml / 250);
    await prisma.dailyLog.update({
      where: { id: today.id },
      data: { waterGlasses: newGlasses },
    });
  } else {
    await prisma.dailyLog.create({
      data: {
        userId: sess.user.id,
        date: new Date(),
        meals: {},
        symptoms: {},
        waterGlasses: Math.round(data.ml / 250),
      },
    });
  }

  // bump streak + check nutrition + badge unlock
  await bumpStreak(sess.user.id);
  try {
    const { refreshNutritionStreak, checkAndAwardBadges } = await import("./badges");
    refreshNutritionStreak().catch(() => {});
    checkAndAwardBadges().catch(() => {});
  } catch {
    /* swallow */
  }
  return { ok: true };
}

export async function getTodaysHydration() {
  const sess = await s();
  const u = await prisma.user.findUnique({
    where: { id: sess.user.id },
    select: { weight: true, lifeStage: true },
  });
  const todayLog = await prisma.dailyLog.findFirst({
    where: {
      userId: sess.user.id,
      date: { gte: startOfDay(new Date()), lte: endOfDay(new Date()) },
    },
  });
  const ml = (todayLog?.waterGlasses ?? 0) * 250;
  const target = u?.weight
    ? dailyWaterTargetMl({
        weightKg: u.weight,
        pregnant: u.lifeStage === "PREGNANT",
        postpartumNursing: u.lifeStage === "POSTPARTUM",
      })
    : 2500;
  return { ml, target, percent: Math.min(100, Math.round((ml / target) * 100)) };
}

// ─── Streak engine ───────────────────────────────────────────
// Bumped on any meaningful daily action (water log, cycle log, symptom log, content view).
// Resets if more than 1 day gap. Visible in dashboard hero.
async function bumpStreak(userId: string) {
  const today = startOfDay(new Date());
  const cur = await prisma.streak.findUnique({ where: { userId } });
  if (!cur) {
    await prisma.streak.create({
      data: { userId, currentDays: 1, longestDays: 1, lastCheckIn: today },
    });
    return;
  }
  if (!cur.lastCheckIn) {
    await prisma.streak.update({
      where: { userId },
      data: { currentDays: 1, longestDays: Math.max(cur.longestDays, 1), lastCheckIn: today },
    });
    return;
  }
  const days = differenceInCalendarDays(today, cur.lastCheckIn);
  if (days === 0) return; // already checked in today
  const newCurrent = days === 1 ? cur.currentDays + 1 : 1;
  await prisma.streak.update({
    where: { userId },
    data: {
      currentDays: newCurrent,
      longestDays: Math.max(cur.longestDays, newCurrent),
      lastCheckIn: today,
    },
  });
}

export async function getStreak() {
  const sess = await s();
  const cur = await prisma.streak.findUnique({ where: { userId: sess.user.id } });
  return cur ?? { currentDays: 0, longestDays: 0, lastCheckIn: null };
}

// ─── Daily mood / quick check-in ─────────────────────────────
const moodSchema = z.object({
  mood: z.enum(["great", "good", "okay", "low", "rough"]),
  energy: z.number().int().min(1).max(5),
  notes: z.string().max(280).optional(),
});

export async function logCheckIn(input: z.infer<typeof moodSchema>) {
  const sess = await s();
  const data = moodSchema.parse(input);

  const today = await prisma.dailyLog.findFirst({
    where: {
      userId: sess.user.id,
      date: { gte: startOfDay(new Date()), lte: endOfDay(new Date()) },
    },
  });
  const payload = {
    mood: data.mood,
    activity: `energy ${data.energy}/5${data.notes ? `: ${data.notes}` : ""}`,
  };
  if (today) {
    await prisma.dailyLog.update({
      where: { id: today.id },
      data: payload,
    });
  } else {
    await prisma.dailyLog.create({
      data: {
        userId: sess.user.id,
        date: new Date(),
        meals: {},
        symptoms: {},
        waterGlasses: 0,
        ...payload,
      },
    });
  }
  await bumpStreak(sess.user.id);
  return { ok: true };
}

// ─── Emergency contacts ──────────────────────────────────────
const emergencySchema = z.object({
  name: z.string().min(1).max(60),
  phone: z.string().min(7).max(20),
  relation: z.enum(["PARTNER", "PARENT", "DOCTOR", "FRIEND"]),
  priority: z.number().int().min(1).max(5).default(1),
});

export async function addEmergencyContact(input: z.infer<typeof emergencySchema>) {
  const sess = await s();
  const data = emergencySchema.parse(input);
  return prisma.emergencyContact.create({
    data: { ...data, userId: sess.user.id },
  });
}

export async function listEmergencyContacts() {
  const sess = await s();
  return prisma.emergencyContact.findMany({
    where: { userId: sess.user.id },
    orderBy: { priority: "asc" },
  });
}

export async function deleteEmergencyContact(id: string) {
  const sess = await s();
  await prisma.emergencyContact.deleteMany({
    where: { id, userId: sess.user.id },
  });
  return { ok: true };
}

// ─── Last 7 days summary (for dashboard hero) ────────────────
export async function getWeeklySummary() {
  const sess = await s();
  const since = subDays(startOfDay(new Date()), 6);
  const logs = await prisma.dailyLog.findMany({
    where: { userId: sess.user.id, date: { gte: since } },
    orderBy: { date: "asc" },
  });
  const symptomCount = await prisma.symptomLog.count({
    where: { userId: sess.user.id, date: { gte: since } },
  });
  const cycleCount = await prisma.cycleLog.count({
    where: { userId: sess.user.id, startDate: { gte: since } },
  });
  return {
    daysLogged: logs.length,
    averageWaterGlasses:
      logs.reduce((a, b) => a + b.waterGlasses, 0) / Math.max(1, logs.length),
    symptomCount,
    cycleCount,
  };
}
