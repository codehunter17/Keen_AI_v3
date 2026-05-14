"use client";

// Compact horizontal cycle strip for the dashboard overview.
// Different visual language from the big ring on /dashboard/cycle:
//
//   • Horizontal bar (not a ring) — fits in a card row
//   • 28 vertical "wave" bars, one per cycle day
//   • Bars are tinted by their phase color
//   • Current day's bar is taller + glowing + has a pulsing dot above it
//   • The whole strip has a subtle left-to-right shimmer that loops slowly
//
// At a glance: where am I in my cycle, what's the current phase, and how
// close is the next period.

import { motion } from "motion/react";

const PHASE_COLORS: Record<number, { color: string; label: string }> = {};
// Days 1-5 menstrual
for (let d = 1; d <= 5; d++) PHASE_COLORS[d] = { color: "oklch(0.55 0.18 25)", label: "Menstrual" };
// Days 6-13 follicular
for (let d = 6; d <= 13; d++) PHASE_COLORS[d] = { color: "oklch(0.45 0.10 160)", label: "Follicular" };
// Days 14-15 ovulatory
for (let d = 14; d <= 15; d++) PHASE_COLORS[d] = { color: "oklch(0.78 0.085 80)", label: "Ovulatory" };
// Days 16-28 luteal
for (let d = 16; d <= 28; d++) PHASE_COLORS[d] = { color: "oklch(0.86 0.05 25)", label: "Luteal" };

export function CyclePhaseStrip({
  cycleDay,
  nextPeriodInDays,
}: {
  cycleDay: number | null;
  nextPeriodInDays?: number | null;
}) {
  if (cycleDay == null) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/40 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          🌙
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground">Log a period to start tracking</p>
          <p className="text-xs text-muted-foreground">Your phase will light up here each day.</p>
        </div>
      </div>
    );
  }

  const normalizedDay = ((cycleDay - 1) % 28) + 1;
  const currentPhase = PHASE_COLORS[normalizedDay];

  return (
    <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 overflow-hidden relative">
      {/* Subtle left-to-right shimmer overlay — adds aliveness */}
      <motion.div
        aria-hidden
        className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent pointer-events-none"
        animate={{ x: ["0%", "400%"] }}
        transition={{ duration: 6, ease: "linear", repeat: Infinity }}
      />

      {/* Header */}
      <div className="flex items-baseline justify-between mb-3 relative">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-muted-foreground">
            Today · Day {normalizedDay}
          </p>
          <p
            className="font-heading text-xl sm:text-2xl mt-0.5"
            style={{ color: currentPhase.color }}
          >
            {currentPhase.label}
          </p>
        </div>
        {nextPeriodInDays != null && nextPeriodInDays > 0 && (
          <p className="text-xs text-muted-foreground text-right">
            <span className="block text-[10px] uppercase tracking-widest font-semibold">
              Period in
            </span>
            <span className="font-heading text-lg text-foreground">{nextPeriodInDays}d</span>
          </p>
        )}
      </div>

      {/* 28-day wave bars */}
      <div className="relative flex items-end gap-[3px] h-12 sm:h-14">
        {Array.from({ length: 28 }).map((_, i) => {
          const day = i + 1;
          const isCurrent = day === normalizedDay;
          const isPast = day < normalizedDay;
          const phase = PHASE_COLORS[day];
          // Bars taller in mid-cycle (visual wave shape, peak at ovulation)
          const baseHeight = 30 + Math.round(35 * Math.sin((Math.PI * (day - 1)) / 27));
          return (
            <div key={day} className="flex-1 flex flex-col items-center relative">
              {/* The day bar */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: isCurrent ? `${baseHeight + 18}%` : `${baseHeight}%`,
                  opacity: isPast ? 0.55 : isCurrent ? 1 : 0.75,
                }}
                transition={{ delay: i * 0.012, duration: 0.45, ease: "easeOut" }}
                className="w-full rounded-t-md self-end"
                style={{
                  background: phase.color,
                  boxShadow: isCurrent ? `0 0 14px ${phase.color}` : undefined,
                }}
              />
              {/* Today indicator dot above the current bar */}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: phase.color }}
                      animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, ease: "easeOut", repeat: Infinity }}
                    />
                    <div
                      className="relative w-2 h-2 rounded-full ring-2 ring-white"
                      style={{ background: phase.color }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tiny axis labels: day numbers at start, mid, end */}
      <div className="flex justify-between mt-1.5 text-[9px] text-muted-foreground font-semibold tracking-wider">
        <span>1</span>
        <span>7</span>
        <span>14</span>
        <span>21</span>
        <span>28</span>
      </div>
    </div>
  );
}
