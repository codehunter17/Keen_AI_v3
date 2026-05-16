// Server wrapper that fetches the data the ModeSwitcher needs.

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, differenceInCalendarDays, subDays } from "date-fns";
import { predictNextCycle } from "@/lib/actions/cycle";
import { ModeSwitcherCards } from "./mode-switcher-cards";

export async function ModeSwitcherSection() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const userId = session.user.id;

  const [user, todayLog, weekLogs, prediction] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { lifeStage: true, pregnancyWeek: true },
    }),
    prisma.dailyLog.findFirst({
      where: {
        userId,
        date: { gte: startOfDay(new Date()), lte: endOfDay(new Date()) },
      },
      select: { waterGlasses: true },
    }),
    prisma.dailyLog.count({
      where: { userId, date: { gte: subDays(new Date(), 6) } },
    }),
    predictNextCycle().catch(() => null),
  ]);

  const cycleDay = prediction?.lastStart
    ? Math.max(1, differenceInCalendarDays(new Date(), prediction.lastStart) + 1)
    : null;
  const nextPeriodInDays = prediction?.nextPredictedStart
    ? Math.max(
        0,
        differenceInCalendarDays(prediction.nextPredictedStart, new Date()),
      )
    : null;
  const waterMl = (todayLog?.waterGlasses ?? 0) * 250;
  const hydrationPercent = Math.min(100, Math.round((waterMl / 2000) * 100));

  return (
    <ModeSwitcherCards
      lifeStage={user?.lifeStage ?? null}
      pregnancyWeek={user?.pregnancyWeek ?? null}
      cycleDay={cycleDay}
      nextPeriodInDays={nextPeriodInDays}
      hydrationPercent={hydrationPercent}
      daysLoggedThisWeek={weekLogs}
    />
  );
}
