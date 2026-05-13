"use server";

// Badge orchestration. Two surfaces:
//   - awardBadge(id)         — idempotent grant (called from other actions)
//   - getMyBadges()          — list + locked status for UI
//   - checkAndAwardBadges()  — called after key actions to auto-grant

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { BADGES, type BadgeId } from "@/lib/badges";
import { intakeFromMealLabels, checkTargets } from "@/lib/nutrition-target-detector";
import { startOfDay, endOfDay, differenceInCalendarDays, subDays } from "date-fns";
import type { LifeStage } from "@/lib/lifecycle";

async function requireUserId(): Promise<string> {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) throw new Error("UNAUTHORIZED");
  return s.user.id;
}

// Returns true only if the Prisma client was generated AGAINST a schema that
// includes the Badge model. Defensive guard so dashboard never crashes
// during a half-migrated dev state.
function hasBadgeTable(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (prisma as any).badge?.findMany === "function";
}

// ─────────────────────────────────────────────────────────────
//  Public: idempotent awarder
// ─────────────────────────────────────────────────────────────
export async function awardBadge(badgeId: BadgeId): Promise<{ awarded: boolean }> {
  const userId = await requireUserId();
  if (!BADGES[badgeId]) return { awarded: false };
  if (!hasBadgeTable()) return { awarded: false };
  try {
    await prisma.badge.create({ data: { userId, badgeId } });
    return { awarded: true };
  } catch {
    // unique constraint = already had it
    return { awarded: false };
  }
}

// ─────────────────────────────────────────────────────────────
//  Public: list for UI
// ─────────────────────────────────────────────────────────────
export async function getMyBadges() {
  const userId = await requireUserId();
  if (!hasBadgeTable()) {
    // Schema not yet migrated — show all locked, dashboard keeps rendering.
    return Object.values(BADGES).map((b) => ({
      ...b,
      earned: false,
      awardedAt: null,
    }));
  }
  const rows = await prisma.badge.findMany({
    where: { userId },
    orderBy: { awardedAt: "desc" },
  });
  const earned = new Set(rows.map((r) => r.badgeId));
  const all = Object.values(BADGES);
  return all.map((b) => ({
    ...b,
    earned: earned.has(b.id),
    awardedAt: rows.find((r) => r.badgeId === b.id)?.awardedAt?.toISOString() ?? null,
  }));
}

// ─────────────────────────────────────────────────────────────
//  Public: nightly-and-on-demand checker. Awards anything new.
// ─────────────────────────────────────────────────────────────
export async function checkAndAwardBadges(): Promise<{ newlyAwarded: BadgeId[] }> {
  const userId = await requireUserId();
  const newly: BadgeId[] = [];
  if (!hasBadgeTable()) return { newlyAwarded: [] };

  const [user, streak, cycleCount, reportCount, dailyLogs, pcosScreen] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        termsAcceptedAt: true,
        age: true,
        lifeStage: true,
        pregnancyWeek: true,
        weight: true,
      },
    }),
    prisma.streak.findUnique({ where: { userId } }),
    prisma.cycleLog.count({ where: { userId } }),
    prisma.report.count({ where: { userId, aiAnalysis: { not: null } } }),
    prisma.dailyLog.findMany({
      where: { userId, date: { gte: subDays(startOfDay(new Date()), 7) } },
      orderBy: { date: "desc" },
    }),
    prisma.symptomLog.findFirst({ where: { userId, category: "PCOS" } }),
  ]);
  if (!user) return { newlyAwarded: [] };

  // Onboarding
  if (user.termsAcceptedAt) await maybe("WELCOME");

  // Cycle
  if (cycleCount >= 1) await maybe("FIRST_PERIOD");
  if (cycleCount >= 3) await maybe("CYCLE_PATTERN");
  if (pcosScreen) await maybe("PCOS_SCREENED");

  // Streak
  if ((streak?.longestDays ?? 0) >= 7) await maybe("STREAK_7");
  if ((streak?.longestDays ?? 0) >= 30) await maybe("STREAK_30");
  if ((streak?.longestDays ?? 0) >= 100) await maybe("STREAK_100");

  // Reports
  if (reportCount >= 1) await maybe("FIRST_REPORT");

  // Pregnancy
  if (user.pregnancyWeek && user.pregnancyWeek > 13) await maybe("PREGNANCY_T1");

  // Nutrition targets — analyze last 7 days of meal logs
  const targetCtx = {
    age: user.age,
    lifeStage: (user.lifeStage as LifeStage | null) ?? null,
    pregnancyWeek: user.pregnancyWeek,
    weightKg: user.weight,
  };
  let waterStreak = 0;
  let ironStreak = 0;
  let calciumStreak = 0;
  let folateStreak = 0;
  let anyTriple = false;

  // logs are newest-first. Iterate consecutively from today backwards.
  let expectedDay = startOfDay(new Date());
  for (const log of dailyLogs) {
    const logDay = startOfDay(log.date);
    if (differenceInCalendarDays(expectedDay, logDay) > 0) break; // gap → streak ends

    const intake = intakeFromMealLabels(
      (log.meals as Record<string, string[]>) ?? {},
      log.waterGlasses,
    );
    const hits = checkTargets(intake, targetCtx);
    if (hits.water) waterStreak++;
    else if (waterStreak > 0) waterStreak = -1; // sentinel: streak broken
    if (hits.iron) ironStreak++;
    else if (ironStreak > 0) ironStreak = -1;
    if (hits.calcium) calciumStreak++;
    else if (calciumStreak > 0) calciumStreak = -1;
    if (hits.folate) folateStreak++;
    else if (folateStreak > 0) folateStreak = -1;
    if (hits.tripleNutrient) anyTriple = true;

    expectedDay = subDays(expectedDay, 1);
  }
  if (waterStreak >= 1) await maybe("HYDRATION_STARTER");
  if (waterStreak >= 7) await maybe("HYDRATION_CHAMPION");
  if (ironStreak >= 7) await maybe("IRON_HIT");
  if (calciumStreak >= 7) await maybe("CALCIUM_HIT");
  if (folateStreak >= 7) await maybe("FOLATE_HIT");
  if (anyTriple) await maybe("TRIPLE_TARGET");

  return { newlyAwarded: newly };

  async function maybe(id: BadgeId) {
    if (!BADGES[id]) return;
    try {
      await prisma.badge.create({ data: { userId, badgeId: id } });
      newly.push(id);
    } catch {
      /* already had it */
    }
  }
}

// ─────────────────────────────────────────────────────────────
//  Public: nutrition streak refresh — called when meals/water log
// ─────────────────────────────────────────────────────────────
export async function refreshNutritionStreak(): Promise<{ currentDays: number; longestDays: number }> {
  const userId = await requireUserId();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { age: true, lifeStage: true, pregnancyWeek: true, weight: true },
  });
  if (!user) return { currentDays: 0, longestDays: 0 };

  // If the new Streak fields aren't yet in the DB schema, skip silently.
  // Detected by a tiny test write — if it errors, we abort gracefully.
  try {
    await prisma.streak.findFirst({ where: { userId }, select: { id: true } });
  } catch {
    return { currentDays: 0, longestDays: 0 };
  }

  // Walk back day by day from today, count consecutive days where all
  // three (iron + calcium + folate) targets were hit.
  let cur = 0;
  let cursor = startOfDay(new Date());
  for (let i = 0; i < 365; i++) {
    const log = await prisma.dailyLog.findFirst({
      where: {
        userId,
        date: { gte: cursor, lte: endOfDay(cursor) },
      },
    });
    if (!log) break;
    const intake = intakeFromMealLabels(
      (log.meals as Record<string, string[]>) ?? {},
      log.waterGlasses,
    );
    const hits = checkTargets(intake, {
      age: user.age,
      lifeStage: (user.lifeStage as LifeStage | null) ?? null,
      pregnancyWeek: user.pregnancyWeek,
      weightKg: user.weight,
    });
    if (hits.tripleNutrient) {
      cur++;
      cursor = subDays(cursor, 1);
    } else {
      break;
    }
  }

  const existing = await prisma.streak.findUnique({ where: { userId } });
  const longest = Math.max(existing?.nutritionLongestDays ?? 0, cur);
  await prisma.streak.upsert({
    where: { userId },
    update: {
      nutritionCurrentDays: cur,
      nutritionLongestDays: longest,
      nutritionLastHit: cur > 0 ? new Date() : (existing?.nutritionLastHit ?? null),
    },
    create: {
      userId,
      nutritionCurrentDays: cur,
      nutritionLongestDays: longest,
      nutritionLastHit: cur > 0 ? new Date() : null,
    },
  });
  return { currentDays: cur, longestDays: longest };
}
