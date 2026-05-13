"use server";

// Server action that receives queued meal logs from the offline queue.
// Accepts a batch (so a long-offline user pushes many at once) and writes
// them as DailyLog rows / additions to today's row.

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { startOfDay, endOfDay } from "date-fns";

const mealSchema = z.object({
  type: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  foodId: z.string(),
  foodName: z.string(),
  servings: z.number().min(0.25).max(10),
  loggedAt: z.number(), // epoch ms
});

const batchSchema = z.object({
  meals: z.array(mealSchema).max(100),
});

export async function syncMealBatch(input: z.infer<typeof batchSchema>) {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) throw new Error("UNAUTHORIZED");
  const data = batchSchema.parse(input);

  // Group by calendar day (UTC for stability across deploys).
  const byDay = new Map<string, typeof data.meals>();
  for (const m of data.meals) {
    const day = new Date(m.loggedAt).toISOString().slice(0, 10);
    const arr = byDay.get(day) ?? [];
    arr.push(m);
    byDay.set(day, arr);
  }

  const writtenIds: number[] = [];
  for (const [day, meals] of byDay) {
    const dayDate = new Date(day);
    const existing = await prisma.dailyLog.findFirst({
      where: {
        userId: s.user.id,
        date: { gte: startOfDay(dayDate), lte: endOfDay(dayDate) },
      },
    });

    // Aggregate meals by type
    const mealsByType: Record<string, string[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    };
    for (const m of meals) {
      const t = m.type === "snack" ? "snacks" : m.type;
      const label = m.servings === 1 ? m.foodName : `${m.servings}x ${m.foodName}`;
      mealsByType[t].push(label);
    }

    if (existing) {
      const existingMeals = (existing.meals as Record<string, string[]>) ?? {};
      const merged: Record<string, string[]> = { ...existingMeals };
      for (const [k, v] of Object.entries(mealsByType)) {
        merged[k] = [...(existingMeals[k] ?? []), ...v];
      }
      await prisma.dailyLog.update({
        where: { id: existing.id },
        data: { meals: merged },
      });
    } else {
      await prisma.dailyLog.create({
        data: {
          userId: s.user.id,
          date: dayDate,
          meals: mealsByType,
          symptoms: {},
          waterGlasses: 0,
        },
      });
    }
  }

  // Refresh nutrition streak + check badges. Wrapped so a downstream
  // failure never breaks the meal write.
  try {
    const { refreshNutritionStreak, checkAndAwardBadges } = await import("./badges");
    await refreshNutritionStreak();
    checkAndAwardBadges().catch(() => {});
  } catch {
    /* swallow */
  }

  return { ok: true as const, written: data.meals.length, writtenIds };
}
