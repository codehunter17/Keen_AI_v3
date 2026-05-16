// 4-phase fertility view — Menstrual / Follicular / Ovulatory / Luteal.
// Each phase shows: hormone summary, what to eat, what to avoid, and the
// kind of energy / symptoms to expect. ICMR-NIN aligned, plain Hinglish-
// friendly copy. Stays useful even before predictions kick in (uses just
// cycleDay + averageLength).

import { Apple, Dumbbell, AlertCircle, Heart, Sparkles } from "lucide-react";

type Phase = "menstrual" | "follicular" | "ovulatory" | "luteal";

interface PhaseProfile {
  emoji: string;
  label: string;
  days: string;
  hormone: string;
  feel: string;
  foods: string[];
  avoid: string[];
  movement: string;
  tone: "rose" | "emerald" | "amber" | "violet";
}

const PHASES: Record<Phase, PhaseProfile> = {
  menstrual: {
    emoji: "🩸",
    label: "Menstrual phase",
    days: "Days 1–5",
    hormone: "Estrogen + progesterone lowest. Body is shedding the uterine lining.",
    feel:
      "Lower energy, cramps possible, mood can dip. Need rest + warmth + iron.",
    foods: [
      "Iron-rich: palak, chana, ragi, dates, beetroot",
      "Vitamin C alongside (nimbu, amla, guava) — triples iron absorption",
      "Warm food: dal-chawal, khichdi, soups",
      "Magnesium for cramps: pumpkin seeds, dark chocolate",
    ],
    avoid: [
      "Chai/coffee 1h after iron-rich meals (tannins block iron)",
      "Cold drinks + ice (Ayurveda: worsens cramps)",
      "Excess salt (worsens bloating)",
    ],
    movement:
      "Gentle yoga, walking. Skip heavy workouts — your body is doing real work.",
    tone: "rose",
  },
  follicular: {
    emoji: "🌱",
    label: "Follicular phase",
    days: "Days 6–13",
    hormone: "Estrogen rising. Body is rebuilding + preparing an egg.",
    feel:
      "Energy returns, mood lifts, skin clears. Best time for new things — try a new recipe, schedule that workout.",
    foods: [
      "Fresh + light: sprouts, salads, fermented (idli, dosa, dahi)",
      "B-vitamins: whole grains, eggs, dal",
      "Lean protein: paneer, chicken, fish, tofu",
      "Cruciferous: broccoli, cauliflower (estrogen metabolism)",
    ],
    avoid: [
      "Heavy fried food — slows the lift you'd otherwise feel",
      "Excess sugar (blunts the natural energy)",
    ],
    movement:
      "Strength training is most effective NOW. Cardio + HIIT also work well.",
    tone: "emerald",
  },
  ovulatory: {
    emoji: "🌸",
    label: "Ovulatory phase",
    days: "Days 14–16 (~ovulation)",
    hormone: "Estrogen peaks, LH surge releases the egg. Brief fertile window.",
    feel:
      "Highest energy + libido + confidence. Mid-cycle pain (mittelschmerz) possible — short, sharp, one-sided. Normal.",
    foods: [
      "Antioxidants: berries, citrus, leafy greens",
      "Zinc + selenium: pumpkin seeds, brazil nuts, eggs (egg quality)",
      "Hydration max — 2.5–3L water",
      "Light meals, easy digestion",
    ],
    avoid: [
      "Excess alcohol (estrogen overload)",
      "Heavy meat-heavy meals around ovulation if trying to conceive",
    ],
    movement:
      "Peak performance window. HIIT, sprints, weights — capacity is highest.",
    tone: "amber",
  },
  luteal: {
    emoji: "🌙",
    label: "Luteal phase",
    days: "Days 17–28",
    hormone: "Progesterone rises, estrogen drops. Body is preparing for either pregnancy or period.",
    feel:
      "Slower energy, more inward, PMS possible in last 5 days (bloating, irritability, cravings).",
    foods: [
      "Complex carbs: oats, ragi, brown rice (stabilizes serotonin)",
      "Magnesium for PMS: dark chocolate (70%+), spinach, banana",
      "B6: chickpeas, banana, sweet potato",
      "Calcium-rich: dahi, ragi, sesame ladoo",
    ],
    avoid: [
      "Excess salt + sugar last week (worsens bloating + cravings)",
      "Caffeine after 2 PM (sleep gets worse)",
      "Skipping meals (crashes mood)",
    ],
    movement:
      "Yoga, pilates, brisk walks. Listen to the body — back off in week 4 if needed.",
    tone: "violet",
  },
};

function phaseFromCycleDay(
  cycleDay: number | null,
  averageLength: number,
): Phase | null {
  if (cycleDay == null) return null;
  const len = Math.max(21, Math.min(45, averageLength || 28));
  if (cycleDay <= 5) return "menstrual";
  if (cycleDay < len - 14) return "follicular";
  const ovStart = len - 14 - 1;
  const ovEnd = len - 14 + 1;
  if (cycleDay >= ovStart && cycleDay <= ovEnd) return "ovulatory";
  return "luteal";
}

export function FertilityPhaseCard({
  cycleDay,
  averageLength,
}: {
  cycleDay: number | null;
  averageLength: number;
}) {
  const phase = phaseFromCycleDay(cycleDay, averageLength);
  if (!phase) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card/40 p-5 text-sm text-muted-foreground italic">
        Log a period start date to see your 4-phase nutrition + activity guide.
      </div>
    );
  }
  const p = PHASES[phase];
  const toneClasses = {
    rose: "border-rose-300 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-800/50 text-rose-900 dark:text-rose-100",
    emerald:
      "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-100",
    amber:
      "border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800/50 text-amber-900 dark:text-amber-100",
    violet:
      "border-violet-300 bg-violet-50 dark:bg-violet-950/30 dark:border-violet-800/50 text-violet-900 dark:text-violet-100",
  }[p.tone];

  return (
    <section className={`rounded-3xl border-2 p-5 sm:p-6 space-y-4 ${toneClasses}`}>
      <header className="flex items-start gap-3">
        <div className="text-4xl leading-none shrink-0" aria-hidden>
          {p.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-widest font-semibold opacity-70">
            You&apos;re in
          </p>
          <h2 className="font-heading text-2xl font-bold leading-tight">
            {p.label}
          </h2>
          <p className="text-xs opacity-80 mt-0.5">
            {p.days} · cycle day {cycleDay}
          </p>
        </div>
      </header>

      <div className="space-y-3">
        <div className="rounded-2xl bg-white/40 dark:bg-black/20 p-4 space-y-1">
          <p className="text-[11px] uppercase tracking-wider font-bold opacity-80 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> What&apos;s happening
          </p>
          <p className="text-sm leading-relaxed">{p.hormone}</p>
          <p className="text-sm leading-relaxed">{p.feel}</p>
        </div>

        <div className="rounded-2xl bg-white/40 dark:bg-black/20 p-4 space-y-2">
          <p className="text-[11px] uppercase tracking-wider font-bold opacity-80 flex items-center gap-1.5">
            <Apple className="w-3 h-3" /> Eat now
          </p>
          <ul className="space-y-1 text-sm">
            {p.foods.map((f, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span aria-hidden className="opacity-60">→</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white/40 dark:bg-black/20 p-4 space-y-2">
          <p className="text-[11px] uppercase tracking-wider font-bold opacity-80 flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3" /> Limit
          </p>
          <ul className="space-y-1 text-sm">
            {p.avoid.map((f, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span aria-hidden className="opacity-60">→</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white/40 dark:bg-black/20 p-4 space-y-1">
          <p className="text-[11px] uppercase tracking-wider font-bold opacity-80 flex items-center gap-1.5">
            <Dumbbell className="w-3 h-3" /> Move
          </p>
          <p className="text-sm leading-relaxed">{p.movement}</p>
        </div>
      </div>

      <p className="text-[11px] opacity-70 italic flex items-center gap-1">
        <Heart className="w-3 h-3" aria-hidden />
        Aligned with ICMR-NIN RDA, FOGSI cycle science, and Ayurvedic Ritucharya.
      </p>
    </section>
  );
}
