// Server component — BMI card on the dashboard. Uses ICMR-NIN South-Asian
// cutoffs (stricter than WHO). Renders even if user hasn't entered vitals
// (prompts them with a CTA to update profile).

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { calcBmi, type BmiCategory } from "@/lib/bmi";

const CATEGORY_LOOK: Record<BmiCategory, { color: string; emoji: string; rangeLabel: string }> = {
  UNDERWEIGHT: { color: "oklch(0.78 0.085 80)", emoji: "🌱", rangeLabel: "< 18.5" },
  NORMAL:      { color: "oklch(0.40 0.07 160)", emoji: "✓", rangeLabel: "18.5 – 22.9" },
  OVERWEIGHT:  { color: "oklch(0.78 0.085 80)", emoji: "⚠️", rangeLabel: "23 – 24.9" },
  OBESE_I:     { color: "oklch(0.55 0.18 25)", emoji: "⚠️", rangeLabel: "25 – 29.9" },
  OBESE_II:    { color: "oklch(0.55 0.18 25)", emoji: "⚠️", rangeLabel: "≥ 30" },
};

export async function BmiCard() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) return null;
  const u = await prisma.user.findUnique({
    where: { id: s.user.id },
    select: { height: true, weight: true },
  });

  if (!u?.height || !u?.weight) {
    return (
      <section className="rounded-2xl bg-card lift p-5 sm:p-6">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">BMI</p>
        <p className="mt-1 font-heading text-lg">Not yet calculated</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your height + weight in your profile to see your BMI on the
          South-Asian (ICMR-NIN) cutoff.
        </p>
        <a
          href="/dashboard/profile"
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          Update profile &rarr;
        </a>
      </section>
    );
  }

  const bmi = calcBmi(u.height, u.weight);
  const look = CATEGORY_LOOK[bmi.category];

  // Position dot on a 5-segment scale: under | normal | over | ob1 | ob2
  // BMI values: <18.5 | 18.5-23 | 23-25 | 25-30 | 30+. Dot relative to 16-35 visible range.
  const min = 16, max = 35;
  const pct = Math.max(0, Math.min(100, ((bmi.bmi - min) / (max - min)) * 100));

  return (
    <section className="rounded-2xl bg-card lift p-5 sm:p-6">
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">BMI · ICMR-NIN</p>
        <span className="text-xs text-muted-foreground">
          healthy: {bmi.healthyRangeKg.low}–{bmi.healthyRangeKg.high} kg for your height
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="font-heading text-4xl" style={{ color: look.color }}>
          {bmi.bmi}
        </span>
        <span className="chip" style={{ color: look.color, borderColor: look.color }}>
          {look.emoji} {bmi.label}
        </span>
      </div>

      {/* 5-band scale */}
      <div className="mt-4 relative h-3 rounded-full overflow-hidden flex">
        <div className="flex-[2.5] bg-amber-300/40" />
        <div className="flex-[4.5] bg-emerald-500/60" />
        <div className="flex-[2] bg-amber-400/60" />
        <div className="flex-[5] bg-orange-500/50" />
        <div className="flex-[5] bg-red-500/50" />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-foreground shadow-md"
          style={{ left: `calc(${pct}% - 2px)` }}
        />
      </div>
      <div className="mt-1 flex text-[9px] text-muted-foreground tabular-nums">
        <span className="flex-[2.5]">16</span>
        <span className="flex-[4.5] text-center">18.5</span>
        <span className="flex-[2] text-center">23</span>
        <span className="flex-[5] text-center">25</span>
        <span className="flex-[5] text-right">30+</span>
      </div>

      <p className="mt-3 text-sm">{bmi.message}</p>
    </section>
  );
}
