// Server component — BMI / weight card on the dashboard.
// Adults: ICMR-NIN South-Asian cutoffs (stricter than WHO).
// Children & teens: raw BMI shown with growth-context note (WHO BMI-for-age
//   percentiles vary by sex which we don't collect, so we avoid categorical
//   labels and instead show healthy-weight range for height).

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
    select: { height: true, weight: true, age: true, lifeStage: true },
  });

  const isChild = (u?.lifeStage ?? "").startsWith("CHILD_");
  const isTeen  = (u?.lifeStage ?? "").startsWith("TEEN_");
  const age = u?.age ?? null;

  if (!u?.height || !u?.weight) {
    return (
      <section className="rounded-2xl bg-card lift p-5 sm:p-6">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {isChild ? "Weight & Height" : "BMI"}
        </p>
        <p className="mt-1 font-heading text-lg">Not yet recorded</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {isChild
            ? "Ask a parent to add your height and weight so we can give you the right nutrition plan."
            : isTeen
            ? "Add your height + weight to get nutrition targets tailored to your age."
            : "Add your height + weight in your profile to see your BMI on the South-Asian (ICMR-NIN) cutoff."}
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

  // ── Children / teens: skip categorical labels, show healthy range only ──
  if (isChild) {
    // Children use BMI-for-age percentile (sex-dependent, not available).
    // Show raw BMI + healthy weight range for height as a soft guide.
    const m = u.height / 100;
    const healthyLow  = Math.round(15.0 * m * m * 10) / 10; // rough lower bound for child
    const healthyHigh = Math.round(20.0 * m * m * 10) / 10; // rough upper bound for child
    return (
      <section className="rounded-2xl bg-card lift p-5 sm:p-6">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Weight check</p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-heading text-4xl text-primary">{bmi.bmi}</span>
          <span className="text-sm text-muted-foreground">BMI</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Healthy weight range for this height: <strong>{healthyLow}–{healthyHigh} kg</strong>
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground/70">
          For children, exact healthy BMI depends on age and growth stage. Check with your doctor for a personalised assessment.
        </p>
      </section>
    );
  }

  if (isTeen) {
    // Teens: show BMI but use broader healthy band (18.5–22.9 still too strict for 13-yr-olds)
    const teensNormal = bmi.bmi >= 17 && bmi.bmi <= 24;
    const color = teensNormal ? "oklch(0.40 0.07 160)" : "oklch(0.55 0.18 25)";
    return (
      <section className="rounded-2xl bg-card lift p-5 sm:p-6">
        <div className="flex items-baseline justify-between mb-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">BMI · Teen guide</p>
          <span className="text-xs text-muted-foreground">
            {u.height} cm · {u.weight} kg
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-4xl" style={{ color }}>
            {bmi.bmi}
          </span>
          <span className="chip" style={{ color, borderColor: color }}>
            {teensNormal ? "✓ On track" : "Check with doctor"}
          </span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {teensNormal
            ? "Your weight looks healthy for your height. Focus on eating a variety of nutrients — iron, calcium, and protein are especially important during your growing years."
            : age != null && bmi.bmi < 17
            ? `You may need more calories and protein for your age (${age}). Eat more dal, eggs, milk, nuts, and whole grains. Talk to your family if you're often feeling tired.`
            : `Your BMI is on the higher side. Small changes help a lot — drink more water, cut sugary drinks, and stay active for 45 minutes daily. Talk to your doctor for a personalised plan.`}
        </p>
        <p className="mt-2 text-[10px] text-muted-foreground/70">
          Teen BMI depends on age and growth stage. Values are a guide, not a diagnosis.
        </p>
      </section>
    );
  }

  // ── Adults — ICMR-NIN SOUTH-ASIAN cutoffs ─────────────────────────────
  const look = CATEGORY_LOOK[bmi.category];
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
