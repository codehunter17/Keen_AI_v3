"use server";

// Cycle tracking actions. Used by adults AND consented post-menarche minors.
// Predictions are written with predicted=true so we can distinguish from
// user-logged truth in retraining + UI.

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { addDays, differenceInCalendarDays } from "date-fns";
import { tierAllows, type Tier } from "@/lib/tiers";

async function requireSessionUser() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) throw new Error("UNAUTHORIZED");
  return s;
}

const logCycleSchema = z.object({
  startDate: z.string(),
  endDate: z.string().optional(),
  flow: z.enum(["LIGHT", "MEDIUM", "HEAVY", "SPOTTING"]).optional(),
  pain: z.number().int().min(0).max(10).optional(),
  symptoms: z.array(z.string()).optional(),
  notes: z.string().max(500).optional(),
  // For dependent profiles (parent logging on behalf)
  dependentId: z.string().optional(),
});

export async function logCycle(input: z.infer<typeof logCycleSchema>) {
  const s = await requireSessionUser();
  const data = logCycleSchema.parse(input);

  // Authorize dependent linkage
  if (data.dependentId) {
    const dep = await prisma.dependentProfile.findFirst({
      where: { id: data.dependentId, parentId: s.user.id, deletedAt: null },
    });
    if (!dep) throw new Error("DEPENDENT_NOT_FOUND");
  }

  const created = await prisma.cycleLog.create({
    data: {
      userId: data.dependentId ? null : s.user.id,
      dependentId: data.dependentId ?? null,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      flow: data.flow,
      pain: data.pain,
      symptoms: data.symptoms ?? [],
      notes: data.notes,
      predicted: false,
    },
  });
  // Fire-and-forget badge re-check (FIRST_PERIOD, CYCLE_PATTERN)
  if (!data.dependentId) {
    const { checkAndAwardBadges } = await import("./badges");
    checkAndAwardBadges().catch(() => {});
  }
  return created;
}

export async function getCycleHistory(opts: { dependentId?: string; limit?: number } = {}) {
  const s = await requireSessionUser();
  return prisma.cycleLog.findMany({
    where: opts.dependentId
      ? { dependentId: opts.dependentId, dependent: { parentId: s.user.id } }
      : { userId: s.user.id },
    orderBy: { startDate: "desc" },
    take: opts.limit ?? 12,
  });
}

export async function deleteCycleEntry(id: string) {
  const s = await requireSessionUser();
  await prisma.cycleLog.deleteMany({
    where: {
      id,
      OR: [
        { userId: s.user.id },
        { dependent: { parentId: s.user.id } },
      ],
    },
  });
  return { ok: true };
}

// Simple statistical predictor — average cycle length over last 6 cycles.
// Replaced later by ai/cycle_predictor.cbm (CatBoost) once we have data.
export interface CyclePrediction {
  averageLengthDays: number | null;
  averagePeriodDays: number | null;
  lastStart: Date | null;
  nextPredictedStart: Date | null;
  fertileWindowStart: Date | null;
  fertileWindowEnd: Date | null;
  ovulationDate: Date | null;
  confidence: "low" | "medium" | "high";
}

export async function predictNextCycle(opts: { dependentId?: string } = {}): Promise<CyclePrediction> {
  const s = await requireSessionUser();
  const logs = await prisma.cycleLog.findMany({
    where: opts.dependentId
      ? { dependentId: opts.dependentId, dependent: { parentId: s.user.id }, predicted: false }
      : { userId: s.user.id, predicted: false },
    orderBy: { startDate: "desc" },
    take: 6,
  });

  if (logs.length === 0) {
    return {
      averageLengthDays: null,
      averagePeriodDays: null,
      lastStart: null,
      nextPredictedStart: null,
      fertileWindowStart: null,
      fertileWindowEnd: null,
      ovulationDate: null,
      confidence: "low",
    };
  }

  const sorted = [...logs].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime(),
  );
  const lengths: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    lengths.push(
      differenceInCalendarDays(sorted[i].startDate, sorted[i - 1].startDate),
    );
  }
  const periodDays = sorted
    .filter((l) => l.endDate)
    .map((l) => differenceInCalendarDays(l.endDate!, l.startDate) + 1);

  const avgLength =
    lengths.length > 0
      ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
      : 28;
  const avgPeriod =
    periodDays.length > 0
      ? Math.round(periodDays.reduce((a, b) => a + b, 0) / periodDays.length)
      : 5;

  const last = sorted[sorted.length - 1];
  const nextStart = addDays(last.startDate, avgLength);
  const ovulation = addDays(nextStart, -14);
  const fertileStart = addDays(ovulation, -5);
  const fertileEnd = addDays(ovulation, 1);

  const confidence: "low" | "medium" | "high" =
    logs.length >= 4 ? "high" : logs.length >= 2 ? "medium" : "low";

  return {
    averageLengthDays: avgLength,
    averagePeriodDays: avgPeriod,
    lastStart: last.startDate,
    nextPredictedStart: nextStart,
    fertileWindowStart: fertileStart,
    fertileWindowEnd: fertileEnd,
    ovulationDate: ovulation,
    confidence,
  };
}

// ─────────────────────────────────────────────────────────────
// PCOS screening — Rotterdam-style symptom questionnaire.
// Score is informational only; we always recommend a clinician.
// ─────────────────────────────────────────────────────────────
const pcosSchema = z.object({
  irregularPeriods: z.boolean(),
  excessHair: z.boolean(),
  acne: z.boolean(),
  weightGain: z.boolean(),
  hairLossOnHead: z.boolean(),
  difficultyConceiving: z.boolean(),
  fatigue: z.boolean(),
  moodChanges: z.boolean(),
  familyHistory: z.boolean(),
});

export async function submitPcosScreen(input: z.infer<typeof pcosSchema>) {
  const s = await requireSessionUser();
  // Tier gate: PCOS screening is Care/Pro/staff only.
  const u = await prisma.user.findUnique({
    where: { id: s.user.id },
    select: { tier: true, isStaff: true },
  });
  if (!u) throw new Error("USER_NOT_FOUND");
  const tier = (u.tier as Tier) || "FREE";
  if (!tierAllows({ tier, isStaff: u.isStaff }, "pcosScreening")) {
    throw new Error(
      "PCOS screening is a Care/Pro feature. Upgrade to unlock — visit /pricing.",
    );
  }
  const data = pcosSchema.parse(input);

  // Each "yes" = 1. Score 4+ → suggested clinician follow-up.
  const trueCount = Object.values(data).filter(Boolean).length;
  const risk: "LOW" | "MODERATE" | "HIGH" =
    trueCount >= 6 ? "HIGH" : trueCount >= 4 ? "MODERATE" : "LOW";

  const insight =
    risk === "HIGH"
      ? "Several signs in your responses are commonly associated with PCOS. We strongly recommend booking an appointment with a gynecologist and asking for an ultrasound + hormone panel. This screen is not a diagnosis."
      : risk === "MODERATE"
        ? "A few signs in your responses can be associated with PCOS, but they can also have other explanations. Consider mentioning these to your doctor at your next visit."
        : "Your responses don't strongly suggest PCOS. Continue tracking your cycle and watch for changes.";

  await prisma.symptomLog.create({
    data: {
      userId: s.user.id,
      category: "PCOS",
      data: { ...data, score: trueCount, risk },
      aiInsight: insight,
    },
  });
  const { awardBadge } = await import("./badges");
  awardBadge("PCOS_SCREENED").catch(() => {});

  return { trueCount, risk, insight };
}
