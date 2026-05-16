// Meals → Insights tab. Derives 3–5 plain-English nudges from the 7-day
// stats. Deterministic (no LLM), so it's free, instant, and reliable for
// villager users on slow networks.

import Link from "next/link";
import { getWeekNutritionStats } from "@/lib/actions/nutrition-summary";
import { AbsorptionScienceCard } from "@/components/absorption-science-card";
import { Lightbulb, AlertOctagon, Phone } from "lucide-react";

// ICMR-NIN threshold tiers. Hit-rate below 30% on iron / folate / calcium
// during pregnancy is the cutoff where keen-ai's original product escalated
// from "general tip" to "Consult your ASHA worker / nearest PHC". ASHA is
// India's rural-health volunteer network — this is the most credible
// India-specific escalation copy in any women's-health app.
const CRITICAL_THRESHOLD = 30;
const ASHA_ESCALATABLE: ("iron" | "calcium" | "folate")[] = [
  "iron",
  "calcium",
  "folate",
];

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
    hitRate: stats.hitRate[n],
    critical:
      stats.hitRate[n] < CRITICAL_THRESHOLD &&
      (ASHA_ESCALATABLE as readonly string[]).includes(n),
    ...NUTRIENT_TIPS[n],
  }));

  const hasCritical = nudges.some((n) => n.critical);

  return (
    <div className="space-y-4">
      {/* ASHA escalation banner — only shows on Critical tier (hit-rate
          <30% on a key micronutrient). This is keen-ai's credibility
          signature: surface the rural-India health-worker network when
          numbers are genuinely concerning, not for every dip. */}
      {hasCritical && (
        <section className="rounded-3xl border border-red-300 dark:border-red-800/60 bg-red-50 dark:bg-red-950/30 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-300" />
            <h3 className="font-heading text-base font-bold text-red-900 dark:text-red-100">
              Consult your ASHA worker
            </h3>
          </div>
          <p className="text-sm text-red-900/90 dark:text-red-100/90 leading-relaxed">
            One or more key nutrients are at <strong>critically low</strong>{" "}
            levels this week (ICMR-NIN RDA &lt; {CRITICAL_THRESHOLD}% hit rate).
            For women in rural India, the fastest help is your local ASHA
            volunteer — she can arrange iron / folate supplements through the
            nearest PHC at no cost.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="tel:104"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
            >
              <Phone className="w-3.5 h-3.5" />
              Call 104 (Health Helpline)
            </a>
            <Link
              href="/dashboard/remedies/iron-deficiency-anaemia"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-950/50 transition"
            >
              Anaemia guide →
            </Link>
          </div>
          <p className="text-[11px] text-red-900/70 dark:text-red-100/70 italic">
            ASHA = Accredited Social Health Activist. ~10 lakh ASHA workers
            cover India&apos;s villages. Free service.
          </p>
        </section>
      )}

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
