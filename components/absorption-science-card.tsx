// Absorption Science — five evergreen pairings that meaningfully change
// how nutrients are absorbed in the Indian diet. Static content, no LLM
// call. Embedded in nutrition pages + standalone learn module.
//
// Sources: ICMR-NIN 2020 Recommended Dietary Allowances, FOGSI Iron in
// Adolescent Girls 2022, AIIMS Maternal Nutrition Module 2021.

import { Beaker, Coffee, Milk, Sun, Wheat } from "lucide-react";

interface Rule {
  emoji: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  pair?: string;
  avoid?: string;
}

const RULES: Rule[] = [
  {
    emoji: "🍋",
    icon: <Beaker className="w-4 h-4" />,
    title: "Iron + Vitamin C",
    body:
      "Plant iron from palak, chana, ragi only absorbs ~5%. A squeeze of nimbu, an amla, or guava taken with the meal triples that.",
    pair: "Palak sabzi + nimbu, dal-chawal + amla murabba",
    avoid: "Chai/coffee within 1 hour of meals — they cut absorption ~50%.",
  },
  {
    emoji: "🥛",
    icon: <Milk className="w-4 h-4" />,
    title: "Calcium ≠ Iron at the same meal",
    body:
      "Milk, dahi, paneer block iron absorption. Space them at least an hour apart.",
    pair: "Iron-rich foods at lunch; dairy at breakfast or snack.",
    avoid: "Don't take iron tablets with milk.",
  },
  {
    emoji: "☀️",
    icon: <Sun className="w-4 h-4" />,
    title: "Vitamin D unlocks Calcium",
    body:
      "Calcium without Vitamin D barely reaches the bones. 15–20 minutes of morning sunlight + calcium foods does the job.",
    pair: "Morning sun (10 AM – 12 PM) + dahi/ragi/sesame ladoo same day.",
  },
  {
    emoji: "🌾",
    icon: <Wheat className="w-4 h-4" />,
    title: "Soak grains and dals",
    body:
      "Phytic acid in raw rajma, chana, ragi locks up iron and zinc. Soak overnight or sprout — absorption doubles.",
    pair: "Soaked chana chaat, sprouted moong salad, fermented dosa batter.",
  },
  {
    emoji: "☕",
    icon: <Coffee className="w-4 h-4" />,
    title: "Tannins block minerals",
    body:
      "Chai, coffee and even strong cocoa are full of tannins. Drink them between meals, not with them.",
    avoid: "Avoid chai for an hour after iron-rich meals or supplements.",
  },
];

export function AbsorptionScienceCard({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <section className="rounded-3xl bg-card border border-border p-5 sm:p-6 space-y-4">
      <header className="space-y-1">
        <span className="text-[11px] uppercase tracking-widest font-semibold text-primary">
          Absorption science · ICMR-NIN
        </span>
        <h2 className="font-heading text-lg sm:text-xl text-foreground">
          Five small swaps that double absorption
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The body doesn&apos;t absorb 100% of what you eat. These pairings
          significantly change the iron, calcium and vitamin you actually take
          up.
        </p>
      </header>
      <ul className={compact ? "space-y-2" : "grid sm:grid-cols-2 gap-3"}>
        {RULES.map((r, i) => (
          <li
            key={i}
            className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2"
          >
            <div className="flex items-center gap-2">
              <span aria-hidden className="text-2xl leading-none">
                {r.emoji}
              </span>
              <h3 className="font-heading text-sm font-bold text-foreground">
                {r.title}
              </h3>
            </div>
            <p className="text-xs text-foreground/85 leading-relaxed">
              {r.body}
            </p>
            {r.pair && (
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 flex gap-1">
                <span aria-hidden>✅</span>
                <span>{r.pair}</span>
              </p>
            )}
            {r.avoid && (
              <p className="text-[11px] text-amber-700 dark:text-amber-300 flex gap-1">
                <span aria-hidden>⚠️</span>
                <span>{r.avoid}</span>
              </p>
            )}
          </li>
        ))}
      </ul>
      <p className="text-[10px] text-muted-foreground italic">
        Source: ICMR-NIN RDA 2020, FOGSI 2022, AIIMS Maternal Nutrition Module 2021.
      </p>
    </section>
  );
}
