"use server";

// Today's intake summary + ICMR-NIN target progress.
// Used by the meal page to show "what you've eaten today + how close to goals."

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { startOfDay, endOfDay } from "date-fns";
import { intakeFromMealLabels, checkTargets } from "@/lib/nutrition-target-detector";
import { computeTargets } from "@/lib/phase-payload";
import type { LifeStage } from "@/lib/lifecycle";

export interface TodaySummary {
  meals: { type: string; items: string[] }[];
  intake: {
    iron_mg: number;
    calcium_mg: number;
    folate_mcg: number;
    protein_g: number;
    kcal: number;
    waterMl: number;
  };
  targets: {
    iron_mg: number;
    calcium_mg: number;
    folate_mcg: number;
    protein_g: number;
    waterMl: number;
  };
  hits: {
    iron: boolean;
    calcium: boolean;
    folate: boolean;
    protein: boolean;
    water: boolean;
    tripleNutrient: boolean;
  };
}

export async function getTodayNutritionSummary(): Promise<TodaySummary | null> {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) return null;

  const [user, todayLog] = await Promise.all([
    prisma.user.findUnique({
      where: { id: s.user.id },
      select: { age: true, lifeStage: true, pregnancyWeek: true, weight: true },
    }),
    prisma.dailyLog.findFirst({
      where: {
        userId: s.user.id,
        date: { gte: startOfDay(new Date()), lte: endOfDay(new Date()) },
      },
    }),
  ]);
  if (!user) return null;

  const mealsByType = (todayLog?.meals as Record<string, string[]>) ?? {};
  const intake = intakeFromMealLabels(mealsByType, todayLog?.waterGlasses ?? 0);

  const t = computeTargets({
    age: user.age,
    lifeStage: (user.lifeStage as LifeStage | null) ?? null,
    pregnancyWeek: user.pregnancyWeek,
  });

  const targets = {
    iron_mg: t.iron_mg ?? 21,
    calcium_mg: t.calcium_mg ?? 600,
    folate_mcg: t.folate_mcg ?? 400,
    protein_g: t.protein_g ?? 55,
    waterMl: (t.water_l ?? 2.5) * 1000,
  };

  const hits = checkTargets(intake, {
    age: user.age,
    lifeStage: (user.lifeStage as LifeStage | null) ?? null,
    pregnancyWeek: user.pregnancyWeek,
    weightKg: user.weight,
  });

  // Convert meals object into a clean array (ordered: breakfast → lunch → snacks → dinner)
  const order = ["breakfast", "lunch", "snacks", "dinner"];
  const meals = order
    .map((type) => ({ type, items: mealsByType[type] ?? [] }))
    .filter((m) => m.items.length > 0);

  return { meals, intake, targets, hits };
}

// Delete a single logged item from today (so users can fix mistakes).
export async function deleteTodayMealItem(input: {
  mealType: string;
  itemLabel: string;
}) {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) throw new Error("UNAUTHORIZED");

  const today = await prisma.dailyLog.findFirst({
    where: {
      userId: s.user.id,
      date: { gte: startOfDay(new Date()), lte: endOfDay(new Date()) },
    },
  });
  if (!today) return { ok: false };

  const meals = { ...((today.meals as Record<string, string[]>) ?? {}) };
  const arr = meals[input.mealType] ?? [];
  const idx = arr.findIndex((x) => x === input.itemLabel);
  if (idx === -1) return { ok: false };
  arr.splice(idx, 1);
  meals[input.mealType] = arr;

  await prisma.dailyLog.update({
    where: { id: today.id },
    data: { meals },
  });
  return { ok: true };
}
