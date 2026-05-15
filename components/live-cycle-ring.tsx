"use client";

// Big animated cycle ring for /dashboard/cycle.
// Different from the homepage hero ring:
//   • Bigger (max-w-[340px] sm:max-w-[400px])
//   • Continuously rotating ripple field around the current-day dot
//   • Pulsing day dot with 3 concentric expanding rings
//   • Slow ambient rotation on the WHOLE ring (60s) — barely perceptible
//     motion that makes the visual feel alive without being distracting
//   • Tap/hover any phase segment to highlight + show its description

import { useState } from "react";
import { motion } from "motion/react";

// Phase config — colors, day ranges, copy. Single source of truth.
const PHASES = [
  {
    key: "MENSTRUAL",
    label: "Menstrual",
    range: [1, 5] as const,
    color: "oklch(0.55 0.18 25)", // deep rose
    bgTint: "oklch(0.92 0.06 25)",
    blurb: "Days 1-5 · Period flow. Rest more, iron-rich foods (chana, methi, gur). Cramps eased by magnesium.",
  },
  {
    key: "FOLLICULAR",
    label: "Follicular",
    range: [6, 13] as const,
    color: "oklch(0.45 0.10 160)", // emerald
    bgTint: "oklch(0.92 0.06 160)",
    blurb: "Days 6-13 · Energy rising. Estrogen builds. Best phase for new starts + intense workouts.",
  },
  {
    key: "OVULATORY",
    label: "Ovulatory",
    range: [14, 15] as const,
    color: "oklch(0.78 0.085 80)", // gold
    bgTint: "oklch(0.95 0.05 80)",
    blurb: "Days 14-15 · Peak fertility. Egg releases. Energy + libido high. Hydrate well.",
  },
  {
    key: "LUTEAL",
    label: "Luteal",
    range: [16, 28] as const,
    color: "oklch(0.86 0.05 25)", // blush
    bgTint: "oklch(0.94 0.03 25)",
    blurb: "Days 16-28 · Progesterone rises. PMS possible. Reduce caffeine, eat complex carbs.",
  },
] as const;

const CIRCUMFERENCE = 578; // 2 * pi * 92 (radius)

function dayToPhase(day: number) {
  const d = ((day - 1) % 28) + 1;
  return PHASES.find((p) => d >= p.range[0] && d <= p.range[1]) ?? PHASES[0];
}

export function LiveCycleRing({
  cycleDay,
  averageLength = 28,
  nextPeriodInDays,
}: {
  cycleDay: number | null;
  averageLength?: number;
  nextPeriodInDays?: number | null;
}) {
  // Two independent UI states:
  //   • focused — sticky click selection. Set on tap, persists until the
  //     user taps elsewhere (or taps the same chip again to clear).
  //   • hovered — transient mouse-over preview. Cleared the moment the
  //     cursor leaves; never overwrites a click selection.
  //
  // Display priority: hovered (most temporary) → focused (sticky) →
  // currentPhase (default for today). This way hovering doesn't "lose"
  // your click, and leaving with mouse doesn't snap back to today.
  const [focused, setFocused] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // If we don't have a cycle day yet (new user), show a "log to begin" state.
  if (cycleDay == null) {
    return (
      <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[400px] aspect-square">
        <div className="absolute inset-[10%] flex items-center justify-center rounded-full border-2 border-dashed border-border bg-card/40">
          <div className="text-center px-6">
            <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-muted-foreground">
              Cycle ring
            </p>
            <p className="font-heading text-xl mt-2 text-foreground">
              Log a period below
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              We&apos;ll plot your phase + light it up here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const normalizedDay = ((cycleDay - 1) % 28) + 1;
  const currentPhase = dayToPhase(normalizedDay);
  // Pick what to display: hover preview wins over sticky click, click wins
  // over today's default. A phase chip click "sticks" until tapped again.
  const activeKey = hovered ?? focused;
  const displayPhase = activeKey
    ? PHASES.find((p) => p.key === activeKey) ?? currentPhase
    : currentPhase;
  // Has the user explicitly chosen a phase to inspect? (Either via click
  // stick OR a current hover.) Drives whether we show the full blurb vs
  // just the lead sentence for today.
  const isInspecting = activeKey !== null;

  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[400px] aspect-square select-none">
      {/* Ambient soft glow behind the ring */}
      <div
        className="absolute inset-6 rounded-full blur-3xl opacity-50 transition-colors duration-700"
        style={{ background: displayPhase.bgTint }}
      />

      {/* Slow ambient rotation wrapper — makes the whole ring barely-perceptibly
          rotate, adding life. 60s per revolution = invisible per-frame but
          the eye picks up motion subliminally. */}
      <motion.div
        className="absolute inset-[8%]"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, ease: "linear", repeat: Infinity }}
      >
        <svg viewBox="-25 -25 250 250" className="w-full h-full -rotate-90" overflow="visible">
          {/* Background ring (silent) */}
          <circle cx="100" cy="100" r="92" fill="none" stroke="oklch(0.95 0.012 85)" strokeWidth="6" />

          {/* Day tick marks (28) */}
          {Array.from({ length: 28 }).map((_, i) => {
            const angle = (i / 28) * 360;
            const rad = (angle * Math.PI) / 180;
            const x1 = +(100 + 86 * Math.cos(rad)).toFixed(4);
            const y1 = +(100 + 86 * Math.sin(rad)).toFixed(4);
            const x2 = +(100 + 92 * Math.cos(rad)).toFixed(4);
            const y2 = +(100 + 92 * Math.sin(rad)).toFixed(4);
            const isWeekStart = i % 7 === 0;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isWeekStart ? "oklch(0.75 0.012 85)" : "oklch(0.85 0.012 85)"}
                strokeWidth={isWeekStart ? 2 : 1.2}
              />
            );
          })}

          {/* Phase segments. Each segment gets a hit-area circle (transparent)
              so users can tap to "focus" that phase and read its blurb. */}
          {PHASES.map((p, i) => {
            const offsetDays = PHASES.slice(0, i).reduce(
              (sum, prev) => sum + (prev.range[1] - prev.range[0] + 1),
              0,
            );
            const lengthDays = p.range[1] - p.range[0] + 1;
            const dashLen = (lengthDays / 28) * CIRCUMFERENCE;
            const dashOffset = -(offsetDays / 28) * CIRCUMFERENCE;
            const isHighlighted = displayPhase.key === p.key;
            return (
              <g key={p.key}>
                <circle
                  cx="100"
                  cy="100"
                  r="92"
                  fill="none"
                  stroke={p.color}
                  strokeWidth={isHighlighted ? 16 : 12}
                  strokeLinecap="round"
                  strokeDasharray={`${dashLen} ${CIRCUMFERENCE}`}
                  strokeDashoffset={dashOffset}
                  style={{
                    opacity: focused && !isHighlighted ? 0.35 : 0.92,
                    transition: "stroke-width 0.4s, opacity 0.4s",
                  }}
                />
                {/* Invisible thick hit area for tap/hover */}
                <circle
                  cx="100"
                  cy="100"
                  r="92"
                  fill="none"
                  stroke="transparent"
                  strokeWidth={28}
                  strokeDasharray={`${dashLen} ${CIRCUMFERENCE}`}
                  strokeDashoffset={dashOffset}
                  style={{ cursor: "pointer" }}
                  // Click locks the selection (sticky). Hover only previews,
                  // and never clears a click selection on leave.
                  onClick={() => setFocused(focused === p.key ? null : p.key)}
                  onMouseEnter={() => setHovered(p.key)}
                  onMouseLeave={() => setHovered(null)}
                />
              </g>
            );
          })}

          {/* Current-day dot with concentric pulsing ripples. Three ripple
              circles staggered in time so something is always expanding. */}
          {(() => {
            // Day 1 sits at top (SVG starts at 12 o'clock with -rotate-90).
            // Each day is (360/28)° clockwise.
            const angle = ((normalizedDay - 1) / 28) * 360;
            const rad = (angle * Math.PI) / 180;
            const cx = +(100 + 92 * Math.cos(rad)).toFixed(4);
            const cy = +(100 + 92 * Math.sin(rad)).toFixed(4);
            return (
              <g>
                {/* Ripple 1 */}
                <circle cx={cx} cy={cy} r="14" fill="none" stroke={currentPhase.color} strokeWidth="2">
                  <animate attributeName="r" values="14;30;14" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.55;0;0.55" dur="2.4s" repeatCount="indefinite" />
                </circle>
                {/* Ripple 2 (offset) */}
                <circle cx={cx} cy={cy} r="14" fill="none" stroke={currentPhase.color} strokeWidth="2">
                  <animate attributeName="r" values="14;30;14" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.55;0;0.55" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
                </circle>
                {/* Ripple 3 (offset more) */}
                <circle cx={cx} cy={cy} r="14" fill="none" stroke={currentPhase.color} strokeWidth="2">
                  <animate attributeName="r" values="14;30;14" dur="2.4s" begin="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.55;0;0.55" dur="2.4s" begin="1.6s" repeatCount="indefinite" />
                </circle>
                {/* Solid white halo */}
                <circle cx={cx} cy={cy} r="15" fill="white" />
                {/* Inner solid dot */}
                <circle cx={cx} cy={cy} r="10" fill={currentPhase.color} />
                {/* Inner brightness highlight */}
                <circle cx={cx - 3} cy={cy - 3} r="3" fill="white" opacity="0.5" />
              </g>
            );
          })()}
        </svg>
      </motion.div>

      {/* Center content. Sits OUTSIDE the rotating wrapper so it stays
          upright while the ring rotates beneath it. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12 pointer-events-none">
        <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-muted-foreground">
          Day {normalizedDay} / {averageLength}
        </p>
        <motion.p
          key={displayPhase.key}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-heading text-4xl sm:text-5xl text-primary mt-2 tracking-tight"
          style={{ color: displayPhase.color }}
        >
          {displayPhase.label}
        </motion.p>
        <motion.p
          key={`blurb-${displayPhase.key}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-[11px] sm:text-xs text-muted-foreground mt-3 leading-snug max-w-[200px]"
        >
          {isInspecting
            ? displayPhase.blurb
            : currentPhase.blurb.split(".")[0] + "."}
        </motion.p>
        {!isInspecting && nextPeriodInDays != null && nextPeriodInDays > 0 && (
          <p className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">
            Period in {nextPeriodInDays}d
          </p>
        )}
      </div>

      {/* Phase legend chips below — tap to lock a phase, tap again to clear.
          The "active" highlight shows whichever the user is currently
          inspecting (hover or sticky click), so the visual matches what the
          ring + center text are showing. */}
      <div className="absolute -bottom-2 left-0 right-0 flex flex-wrap justify-center gap-1.5 px-2">
        {PHASES.map((p) => {
          const isActiveChip = displayPhase.key === p.key;
          const isPinned = focused === p.key;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setFocused(focused === p.key ? null : p.key)}
              onMouseEnter={() => setHovered(p.key)}
              onMouseLeave={() => setHovered(null)}
              aria-pressed={isPinned}
              className={
                "text-[10px] uppercase tracking-widest font-semibold rounded-full px-2.5 py-1 border transition-colors " +
                (isActiveChip
                  ? "border-transparent text-white shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:text-foreground")
              }
              style={isActiveChip ? { background: p.color } : undefined}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
