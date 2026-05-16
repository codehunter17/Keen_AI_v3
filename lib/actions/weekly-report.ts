"use server";

// Weekly Report — aggregates the last 7 days of user activity and asks the
// LLM to write a short, encouraging human story about it. The numeric
// rollups are deterministic; only the "Your story" paragraph is AI-written.
//
// Free tier: rollups only. Care+ tier: AI story included.
// Cheap path = single Prisma findMany per table, no joins, all in parallel.

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { startOfDay, subDays, format } from "date-fns";
import { streamText } from "@/lib/llm";
import { Prisma } from "@prisma/client";

export interface WeeklyReportPayload {
  ok: true;
  weekStart: string; // ISO date
  weekEnd: string;
  daysLogged: number;            // out of 7
  avgWaterGlasses: number;       // 0–N
  totalCheckins: number;
  topSymptoms: { name: string; count: number }[];
  moodSpread: Record<string, number>;
  cycleLogged: boolean;
  story: string | null;          // null when tier-locked
  storyLocked: boolean;
  highlights: string[];          // 1-line wins
  suggestions: string[];         // 1-line nudges
}

export type WeeklyReportResult =
  | WeeklyReportPayload
  | { ok: false; reason: "UNAUTHORIZED" }
  | { ok: false; reason: "NO_DATA" };

export async function getWeeklyReport(): Promise<WeeklyReportResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { ok: false, reason: "UNAUTHORIZED" };
  const userId = session.user.id;

  const now = new Date();
  const weekEnd = now;
  const weekStart = startOfDay(subDays(now, 6)); // inclusive 7-day window

  const [user, dailyLogs, cycleLogs] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        languagePref: true,
        lifeStage: true,
        pregnancyWeek: true,
        tier: true,
      },
    }),
    prisma.dailyLog.findMany({
      where: { userId, date: { gte: weekStart, lte: weekEnd } },
      orderBy: { date: "asc" },
      select: {
        date: true,
        meals: true,
        symptoms: true,
        waterGlasses: true,
        mood: true,
        checkin: true,
      },
    }),
    prisma.cycleLog.findMany({
      where: { userId, startDate: { gte: subDays(now, 60) } },
      orderBy: { startDate: "desc" },
      take: 3,
      select: { startDate: true, endDate: true },
    }),
  ]);

  if (!user) return { ok: false, reason: "UNAUTHORIZED" };
  if (dailyLogs.length === 0) return { ok: false, reason: "NO_DATA" };

  // ── Rollups (deterministic) ────────────────────────────────────
  const daysLogged = dailyLogs.length;
  const waterSum = dailyLogs.reduce((s, l) => s + (l.waterGlasses ?? 0), 0);
  const avgWaterGlasses = +(waterSum / daysLogged).toFixed(1);
  const totalCheckins = dailyLogs.filter((l) => l.checkin != null).length;

  const symptomCounts = new Map<string, number>();
  for (const l of dailyLogs) {
    const arr = parseMaybeJson(l.symptoms) as string[] | null;
    if (Array.isArray(arr)) {
      for (const s of arr) {
        if (typeof s === "string" && s.trim()) {
          symptomCounts.set(s, (symptomCounts.get(s) ?? 0) + 1);
        }
      }
    }
  }
  const topSymptoms = [...symptomCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const moodSpread: Record<string, number> = {};
  for (const l of dailyLogs) {
    if (l.mood) moodSpread[l.mood] = (moodSpread[l.mood] ?? 0) + 1;
  }

  // ── Tactical highlights + suggestions ─────────────────────────
  const highlights: string[] = [];
  const suggestions: string[] = [];

  if (daysLogged >= 5) highlights.push(`Logged ${daysLogged} of 7 days — consistent.`);
  else suggestions.push(`Only ${daysLogged} day${daysLogged === 1 ? "" : "s"} logged — try one quick check-in tomorrow.`);

  if (avgWaterGlasses >= 8) highlights.push(`Hydration averaged ${avgWaterGlasses} glasses/day — excellent.`);
  else if (avgWaterGlasses >= 5) suggestions.push(`Water averaged ${avgWaterGlasses} glasses/day — aim for 8+.`);
  else suggestions.push(`Water was low (${avgWaterGlasses} glasses/day). Keep a bottle within reach.`);

  if (totalCheckins >= 5) highlights.push(`${totalCheckins} morning check-ins — strong streak.`);

  if (topSymptoms.length === 0) {
    highlights.push("No symptoms logged — a calm week.");
  } else if (topSymptoms[0].count >= 4) {
    suggestions.push(
      `"${topSymptoms[0].name}" appeared ${topSymptoms[0].count} times — worth flagging to your doctor if it continues.`,
    );
  }

  if (cycleLogs.length === 0 && (user.lifeStage === "ADULT_MENSTRUATING" || !user.lifeStage)) {
    suggestions.push("No recent period logged — add your last cycle to enable predictions.");
  }

  // ── AI story (Care+ only) ─────────────────────────────────────
  const tierLocked = user.tier === "FREE" || !user.tier;
  let story: string | null = null;

  if (!tierLocked) {
    try {
      const prompt = buildStoryPrompt({
        firstName: (user.name ?? "").split(" ")[0] || "",
        daysLogged,
        avgWaterGlasses,
        totalCheckins,
        topSymptoms,
        moodSpread,
        lifeStage: user.lifeStage,
        pregnancyWeek: user.pregnancyWeek ?? null,
      });
      const result = await streamText({
        system:
          "You are NutriMama, a warm, evidence-based women's-health AI. Write in plain, calm prose. 100 words max. Two short paragraphs.",
        prompt,
        history: [],
        temperature: 0.6,
        premium: false,
      });
      // Drain the stream so we can store as static text.
      let buf = "";
      for await (const chunk of result.iterator) buf += chunk;
      story = buf.trim();
    } catch (err) {
      console.warn("[weekly-report] AI story failed:", err);
      story = null;
    }
  }

  return {
    ok: true,
    weekStart: weekStart.toISOString().slice(0, 10),
    weekEnd: format(weekEnd, "yyyy-MM-dd"),
    daysLogged,
    avgWaterGlasses,
    totalCheckins,
    topSymptoms,
    moodSpread,
    cycleLogged: cycleLogs.length > 0,
    story,
    storyLocked: tierLocked,
    highlights,
    suggestions,
  };
}

function buildStoryPrompt(p: {
  firstName: string;
  daysLogged: number;
  avgWaterGlasses: number;
  totalCheckins: number;
  topSymptoms: { name: string; count: number }[];
  moodSpread: Record<string, number>;
  lifeStage: string | null;
  pregnancyWeek: number | null;
}): string {
  const name = p.firstName || "the user";
  const symptomLine =
    p.topSymptoms.length > 0
      ? p.topSymptoms.map((s) => `${s.name} ×${s.count}`).join(", ")
      : "no symptoms";
  const moodLine = Object.entries(p.moodSpread)
    .map(([m, n]) => `${m}×${n}`)
    .join(", ");
  return [
    `Write a short, encouraging weekly recap for ${name}.`,
    `Days logged: ${p.daysLogged}/7. Water average: ${p.avgWaterGlasses}/day. Check-ins: ${p.totalCheckins}.`,
    `Top symptoms: ${symptomLine}.`,
    `Mood spread: ${moodLine || "none recorded"}.`,
    p.lifeStage ? `Life stage: ${p.lifeStage}.` : "",
    p.pregnancyWeek ? `Pregnancy week: ${p.pregnancyWeek}.` : "",
    `Use second person ("you"). End with one concrete action for next week. No medical diagnoses.`,
  ]
    .filter(Boolean)
    .join("\n");
}

function parseMaybeJson(v: Prisma.JsonValue | null): unknown {
  if (v == null) return null;
  if (typeof v === "string") {
    try {
      return JSON.parse(v);
    } catch {
      return null;
    }
  }
  return v;
}
