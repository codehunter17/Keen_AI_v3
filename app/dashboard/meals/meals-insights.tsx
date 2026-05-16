// Meals → Insights tab. Derives 3–5 plain-English nudges from the 7-day
// stats. Deterministic (no LLM), so it's free, instant, and reliable for
// villager users on slow networks.

import Link from "next/link";
import { getWeekNutritionStats } from "@/lib/actions/nutrition-summary";
import { AbsorptionScienceCard } from "@/components/absorption-science-card";
import { Lightbulb } from "lucide-react";

const NUTRIENT_TIPS: Record<
  "iron" | "calcium" | "folate" | "protein" | "water",
  { headline: string; do: string; conditionSlug?: string }
> = {
  iron: {
    headline: "Iron is running low",
    do:
      "Add palak, ragi, chana or jaggery to lunch — with a squeeze of nimbu or an amla. Avoid chai for an hour after.",
    conditionSlug: "iron-deficiency-anaemia",
  },
  calcium: {
    headline: "Calcium needs a boost",
    do:
      "Two katoris dahi, paneer or ragi ladoo most days. Keep dairy AWAY from iron-rich meals (space them an hour apart).",
  },
  folate: {
    headline: "Folate (B9) is low",
    do:
      "Add daily greens — palak, methi, broccoli — or sprouts. Especially important if you might conceive.",
  },
  protein: {
    headline: "Protein is below target",
    do:
      "Add 1–2 katoris of dal, paneer, soya, sprouts or eggs each day. A handful of peanuts is a cheap top-up.",
  },
  water: {
    headline: "Drink more water",
    do:
      "Aim for 8–10 glasses (~2 L). Keep a 1L bottle within reach and refill it twice. Sip nimbu paani with meals.",
  },
};

export async function MealsInsightsPanel() {
  const stats = await getWeekNutritionStats();
  if (!stats || stats.daysLogged === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground space-y-2">
        <div className="text-3xl">💡</div>
        <p>
          Log at least 2 days of meals so we can spot patterns and give you
          targeted nudges.
        </p>
      </div>
    );
  }

  const nudges = stats.missingNutrients.map((n) => ({
    nutrient: n,
    ...NUTRIENT_TIPS[n],
  }));

  return (
    <div className="space-y-4">
      {/* Headline */}
      <header className="rounded-3xl border border-primary/20 bg-primary/5 p-5">
        <p className="text-[11px] uppercase tracking-widest font-semibold text-primary mb-1">
          Insights · last 7 days
        </p>
        {nudges.length === 0 ? (
          <p className="text-sm text-foreground/85 leading-relaxed">
            Your diet looks balanced this week — every key target was hit on
            more than half the days. Keep going. 🌱
          </p>
        ) : (
          <p className="text-sm text-foreground/85 leading-relaxed">
            We spotted{" "}
            <strong>
              {nudges.length} nutrient{nudges.length === 1 ? "" : "s"}
            </strong>{" "}
            that needed more attention this week. Small swaps fix this fast.
          </p>
        )}
      </header>

      {/* Per-nutrient nudges */}
      {nudges.map((n) => (
        <section
          key={n.nutrient}
          className="rounded-3xl border border-amber-300/40 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800/40 p-5 space-y-2"
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-700 dark:text-amber-300" />
            <h3 className="font-heading text-base font-bold text-amber-900 dark:text-amber-100">
              {n.headline}
            </h3>
          </div>
          <p className="text-sm text-amber-900/90 dark:text-amber-100/90 leading-relaxed">
            {n.do}
          </p>
          {n.conditionSlug && (
            <Link
              href={`/dashboard/remedies/${n.conditionSlug}`}
              className="inline-block text-xs font-semibold text-primary hover:underline"
            >
              Read the full remedy guide →
            </Link>
          )}
        </section>
      ))}

      <AbsorptionScienceCard compact />
    </div>
  );
}
