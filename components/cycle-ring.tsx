// Server component — circular progress ring showing where you are in your
// cycle (period / follicular / fertile / luteal). Inspired by the Keen_AI
// "floating period" look.
//
// SVG circle stroke is split: full grey background ring + colored arc that
// fills proportional to cycleDay / cycleLen. Phase color dictates the arc tint.

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { differenceInCalendarDays } from "date-fns";
import { computeCyclePhase } from "@/lib/phase-payload";

interface PhaseLook {
  label: string;
  emoji: string;
  color: string; // CSS color value
  description: string;
}

const PHASES: Record<string, PhaseLook> = {
  MENSTRUAL: {
    label: "Period",
    emoji: "🌹",
    color: "oklch(0.55 0.18 25)",
    description: "Day 1–5 · take it easy + hydrate.",
  },
  FOLLICULAR: {
    label: "Follicular",
    emoji: "🌱",
    color: "oklch(0.45 0.10 160)",
    description: "Energy rising · ideal for new starts + workouts.",
  },
  OVULATORY: {
    label: "Ovulation",
    emoji: "🌸",
    color: "oklch(0.78 0.085 80)",
    description: "Peak fertility · day 13–15.",
  },
  LUTEAL: {
    label: "Luteal",
    emoji: "🍃",
    color: "oklch(0.86 0.05 25)",
    description: "Wind-down · iron + magnesium help cramps.",
  },
  UNKNOWN: {
    label: "Log a period",
    emoji: "✨",
    color: "oklch(0.40 0.07 160)",
    description: "Log your last period to start the ring.",
  },
};

export async function CycleRing() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) return null;

  const user = await prisma.user.findUnique({
    where: { id: s.user.id },
    select: { lifeStage: true, dob: true },
  });
  if (!user?.dob) return null;
  // Don't show for pregnant / postpartum / minors
  if (user.lifeStage === "PREGNANT" || user.lifeStage === "POSTPARTUM") return null;

  const lastCycle = await prisma.cycleLog.findFirst({
    where: { userId: s.user.id },
    orderBy: { startDate: "desc" },
    select: { startDate: true },
  });

  const cycleDay = lastCycle
    ? differenceInCalendarDays(new Date(), lastCycle.startDate) + 1
    : null;
  const { phase, cycleDay: normalizedDay } = computeCyclePhase(cycleDay);
  const look = PHASES[phase] ?? PHASES.UNKNOWN;

  // Ring math
  const size = 168;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const cycleLen = 28;
  const filled = normalizedDay
    ? Math.min(1, normalizedDay / cycleLen) * circumference
    : 0;
  const empty = circumference - filled;

  return (
    <section className="rounded-2xl bg-card lift p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5">
      {/* SVG ring */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="oklch(0.95 0.012 85)"
            strokeWidth={stroke}
          />
          {filled > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={look.color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${filled} ${empty}`}
              style={{ transition: "stroke-dasharray 1s ease-out" }}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl">{look.emoji}</span>
          <span className="font-heading text-3xl mt-1" style={{ color: look.color }}>
            {normalizedDay ?? "—"}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {normalizedDay ? `day / ${cycleLen}` : "no data"}
          </span>
        </div>
      </div>

      {/* Phase label */}
      <div className="flex-1 text-center sm:text-left">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Cycle phase
        </p>
        <p className="font-heading text-2xl mt-0.5" style={{ color: look.color }}>
          {look.label}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{look.description}</p>
        <a
          href="/dashboard/cycle"
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          Log today &rarr;
        </a>
      </div>
    </section>
  );
}
