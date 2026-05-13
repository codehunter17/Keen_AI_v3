"use server";

// Build the weekly-summary text that gets shared with an ASHA worker / family
// via WhatsApp or Web Share API. Plain text, low-data, ASHA-readable Hindi+English.

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { startOfDay, subDays, format } from "date-fns";

export async function getWeeklyShareText(): Promise<{ text: string; subject: string }> {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) throw new Error("UNAUTHORIZED");

  const since = subDays(startOfDay(new Date()), 6);
  const [user, logs, cycles, streak] = await Promise.all([
    prisma.user.findUnique({
      where: { id: s.user.id },
      select: { name: true, pregnancyWeek: true, lifeStage: true },
    }),
    prisma.dailyLog.findMany({
      where: { userId: s.user.id, date: { gte: since } },
      orderBy: { date: "asc" },
    }),
    prisma.cycleLog.count({
      where: { userId: s.user.id, startDate: { gte: since } },
    }),
    prisma.streak.findUnique({ where: { userId: s.user.id } }),
  ]);

  const totalWater = logs.reduce((a, b) => a + b.waterGlasses, 0);
  const avgWater = logs.length ? Math.round((totalWater / logs.length) * 10) / 10 : 0;

  const week = format(new Date(), "dd MMM");

  const lines: string[] = [
    `*NutriMama — ${user?.name ?? "मेरा"} weekly update*`,
    `Week ending ${week}`,
    "",
    `✅ Days logged: ${logs.length}/7 (दिन लॉग किए)`,
    `💧 Avg water: ${avgWater} glasses/day (पानी प्रति दिन)`,
    `🔥 Streak: ${streak?.currentDays ?? 0} days (स्ट्रीक)`,
  ];
  if (cycles > 0) lines.push(`🌙 Period logged: ${cycles}x (मासिक लॉग)`);
  if (user?.pregnancyWeek) lines.push(`🤰 Pregnancy: Week ${user.pregnancyWeek}/40 (हफ़्ते)`);
  lines.push("");
  lines.push("Thank you for caring for me. 💚");

  return {
    subject: `NutriMama weekly update — ${week}`,
    text: lines.join("\n"),
  };
}
