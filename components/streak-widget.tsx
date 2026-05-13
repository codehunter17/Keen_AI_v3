// Server component — Duolingo-style streak widget.
// Shows current streak (large number + flame), longest streak, and a 7-day
// fire-trail so the user can see which days they hit. Designed to be
// glanceable on mobile.

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { startOfDay, subDays, isSameDay } from "date-fns";

export async function StreakWidget() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) return null;

  const [streak, last7Logs] = await Promise.all([
    prisma.streak.findUnique({ where: { userId: s.user.id } }),
    prisma.dailyLog.findMany({
      where: {
        userId: s.user.id,
        date: { gte: subDays(startOfDay(new Date()), 6) },
      },
      select: { date: true, waterGlasses: true, mood: true },
      orderBy: { date: "asc" },
    }),
  ]);

  const current = streak?.currentDays ?? 0;
  const longest = streak?.longestDays ?? 0;

  // Build a 7-day trail (oldest left → today right).
  const today = startOfDay(new Date());
  const trail: { day: Date; hit: boolean; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = subDays(today, i);
    const log = last7Logs.find((l) => isSameDay(l.date, day));
    const hit = !!log && (log.waterGlasses > 0 || !!log.mood);
    trail.push({
      day,
      hit,
      label: ["S", "M", "T", "W", "T", "F", "S"][day.getDay()],
    });
  }

  return (
    <section className="rounded-2xl bg-card lift p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Daily streak
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-heading text-4xl sm:text-5xl text-primary">
              {current}
            </span>
            <span className="text-2xl">🔥</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {current === 0
              ? "Log anything today to start your streak."
              : current < 3
                ? "Keep going — small wins compound."
                : current < 7
                  ? "You're building a habit. Keep at it."
                  : current < 30
                    ? "On fire. Don't break the chain."
                    : "Legendary streak. Inspiring."}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Longest
          </p>
          <p className="font-heading text-xl">{longest}</p>
        </div>
      </div>

      {/* 7-day trail */}
      <div className="mt-5 grid grid-cols-7 gap-1.5">
        {trail.map((d, i) => (
          <div
            key={i}
            className={`relative flex flex-col items-center justify-end aspect-square rounded-lg ${
              d.hit ? "bg-primary/15" : "bg-muted/40"
            }`}
            title={d.day.toLocaleDateString()}
          >
            <span className={`text-base ${d.hit ? "" : "grayscale opacity-30"}`}>
              {d.hit ? "🔥" : "○"}
            </span>
            <span className="text-[9px] text-muted-foreground mt-0.5 mb-1">
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
