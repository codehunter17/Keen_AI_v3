"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { deleteTodayMealItem, type TodaySummary } from "@/lib/actions/nutrition-summary";

const MEAL_LABEL: Record<string, { emoji: string; label: string }> = {
  breakfast: { emoji: "🌅", label: "Breakfast" },
  lunch: { emoji: "🌞", label: "Lunch" },
  snacks: { emoji: "🍎", label: "Snacks" },
  dinner: { emoji: "🌙", label: "Dinner" },
};

export function TodayMealsClient({ summary }: { summary: TodaySummary }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const remove = (mealType: string, itemLabel: string) => {
    startTransition(async () => {
      await deleteTodayMealItem({ mealType, itemLabel });
      router.refresh();
    });
  };

  const totalLogged = summary.meals.reduce((a, m) => a + m.items.length, 0);

  return (
    <section className="rounded-2xl bg-card lift p-5 sm:p-6">
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Today
          </p>
          <p className="font-heading text-xl">
            {totalLogged === 0
              ? "Nothing logged yet"
              : `${totalLogged} item${totalLogged === 1 ? "" : "s"} so far`}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          {summary.intake.kcal} kcal · {summary.intake.protein_g.toFixed(0)} g protein
        </p>
      </div>

      {/* Per-meal breakdown */}
      {summary.meals.length > 0 && (
        <ul className="space-y-3 mb-5">
          {summary.meals.map((m) => {
            const meta = MEAL_LABEL[m.type] ?? { emoji: "🍽️", label: m.type };
            return (
              <li key={m.type}>
                <p className="text-xs font-semibold mb-1.5">
                  <span className="mr-1">{meta.emoji}</span>
                  {meta.label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {m.items.map((item, i) => (
                    <span
                      key={`${m.type}-${i}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => remove(m.type, item)}
                        disabled={pending}
                        className="opacity-50 hover:opacity-100 transition-opacity"
                        aria-label="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Targets bar */}
      <div className="space-y-2 pt-4 border-t border-border/60">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          ICMR-NIN daily targets
        </p>
        <ProgressRow label="Iron" current={summary.intake.iron_mg} target={summary.targets.iron_mg} unit="mg" hit={summary.hits.iron} />
        <ProgressRow label="Calcium" current={summary.intake.calcium_mg} target={summary.targets.calcium_mg} unit="mg" hit={summary.hits.calcium} />
        <ProgressRow label="Folate" current={summary.intake.folate_mcg} target={summary.targets.folate_mcg} unit="mcg" hit={summary.hits.folate} />
        <ProgressRow label="Protein" current={summary.intake.protein_g} target={summary.targets.protein_g} unit="g" hit={summary.hits.protein} />
        <ProgressRow label="Water" current={summary.intake.waterMl} target={summary.targets.waterMl} unit="ml" hit={summary.hits.water} />
      </div>

      {summary.hits.tripleNutrient && (
        <div className="mt-4 rounded-xl surface-gold p-3 text-xs font-semibold text-center">
          ✨ Triple target hit today — iron, calcium, folate all on point.
        </div>
      )}
    </section>
  );
}

function ProgressRow({
  label,
  current,
  target,
  unit,
  hit,
}: {
  label: string;
  current: number;
  target: number;
  unit: string;
  hit: boolean;
}) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs mb-0.5">
        <span className="font-medium">
          {label}
          {hit && <span className="ml-1 text-primary">✓</span>}
        </span>
        <span className="text-muted-foreground tabular-nums">
          {current.toFixed(unit === "mcg" ? 0 : 1)} / {target} {unit}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full transition-all ${hit ? "bg-primary" : "bg-secondary"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
