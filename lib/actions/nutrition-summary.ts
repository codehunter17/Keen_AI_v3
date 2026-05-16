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

// 7-day nutrition rollup used by the Meals Stats tab. Deterministic — no LLM.
export interface WeekStats {
  daysLogged: number;
  totalMeals: number;
  avgWaterMl: number;
  hitRate: {
    iron: number;     // % of days target met
    calcium: number;
    folate: number;
    protein: number;
    water: number;
  };
  topFoods: { name: string; count: number }[];
  missingNutrients: ("iron" | "calcium" | "folate" | "protein" | "water")[];
}

export async function getWeekNutritionStats(): Promise<WeekStats | null> {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) return null;
  const userId = s.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lifeStage: true, age: true, pregnancyWeek: true },
  });

  const since = startOfDay(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000));
  const logs = await prisma.dailyLog.findMany({
    where: { userId, date: { gte: since } },
    select: { meals: true, waterGlasses: true },
  });

  if (logs.length === 0) {
    return {
      daysLogged: 0,
      totalMeals: 0,
      avgWaterMl: 0,
      hitRate: { iron: 0, calcium: 0, folate: 0, protein: 0, water: 0 },
      topFoods: [],
      missingNutrients: [],
    };
  }

  let totalMeals = 0;
  let waterMlSum = 0;
  const foodCounts = new Map<string, number>();
  const dailyHits = { iron: 0, calcium: 0, folate: 0, protein: 0, water: 0 };

  for (const log of logs) {
    const meals = parseMealsField(log.meals);
    const mealsByType: Record<string, string[]> = {};
    for (const m of meals) {
      mealsByType[m.type] = (mealsByType[m.type] ?? []).concat(m.items);
      for (const item of m.items) {
        foodCounts.set(item, (foodCounts.get(item) ?? 0) + 1);
      }
      totalMeals++;
    }
    const waterGlasses = log.waterGlasses ?? 0;
    const intake = intakeFromMealLabels(mealsByType, waterGlasses);
    waterMlSum += waterGlasses * 250;
    const hits = checkTargets(intake, {
      age: user?.age ?? null,
      lifeStage: (user?.lifeStage as LifeStage | null) ?? null,
      pregnancyWeek: user?.pregnancyWeek ?? null,
    });
    if (hits.iron) dailyHits.iron++;
    if (hits.calcium) dailyHits.calcium++;
    if (hits.folate) dailyHits.folate++;
    if (hits.protein) dailyHits.protein++;
    if (hits.water) dailyHits.water++;
  }

  const daysLogged = logs.length;
  const hitRate = {
    iron: Math.round((dailyHits.iron / daysLogged) * 100),
    calcium: Math.round((dailyHits.calcium / daysLogged) * 100),
    folate: Math.round((dailyHits.folate / daysLogged) * 100),
    protein: Math.round((dailyHits.protein / daysLogged) * 100),
    water: Math.round((dailyHits.water / daysLogged) * 100),
  };
  const missingNutrients = (
    ["iron", "calcium", "folate", "protein", "water"] as const
  ).filter((n) => hitRate[n] < 50);
  const topFoods = [...foodCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  return {
    daysLogged,
    totalMeals,
    avgWaterMl: Math.round(waterMlSum / daysLogged),
    hitRate,
    topFoods,
    missingNutrients,
  };
}

function parseMealsField(v: unknown): { type: string; items: string[] }[] {
  if (!v) return [];
  const parsed = typeof v === "string" ? safeJson(v) : v;
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter((m): m is { type: string; items: string[] } =>
      typeof m === "object" &&
      m !== null &&
      "items" in m &&
      Array.isArray((m as { items: unknown }).items),
    )
    .map((m) => ({
      type: typeof m.type === "string" ? m.type : "meal",
      items: m.items.filter((x): x is string => typeof x === "string"),
    }));
}

function safeJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
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
