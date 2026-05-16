// Meals → Stats tab. Renders the 7-day deterministic rollup from
// getWeekNutritionStats(). No client state — pure data.

import { getWeekNutritionStats } from "@/lib/actions/nutrition-summary";

export async function MealsStatsPanel() {
  const stats = await getWeekNutritionStats();
  if (!stats) {
    return (
      <p className="text-sm text-muted-foreground italic px-2 py-4">
        Sign in to see stats.
      </p>
    );
  }
  if (stats.daysLogged === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground space-y-2">
        <div className="text-3xl">📋</div>
        <p>
          Log a few meals first. Stats and insights show after at least one
          day&apos;s data.
        </p>
      </div>
    );
  }

  const bars: { key: keyof typeof stats.hitRate; label: string }[] = [
    { key: "iron", label: "Iron" },
    { key: "calcium", label: "Calcium" },
    { key: "folate", label: "Folate" },
    { key: "protein", label: "Protein" },
    { key: "water", label: "Water" },
  ];

  return (
    <div className="space-y-4">
      {/* Headline numbers */}
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Days logged" value={`${stats.daysLogged}/7`} />
        <Stat label="Meals" value={String(stats.totalMeals)} />
        <Stat
          label="Water (avg)"
          value={`${(stats.avgWaterMl / 1000).toFixed(1)} L`}
        />
      </div>

      {/* Target hit-rate bars */}
      <section className="rounded-3xl border border-border bg-card p-5 space-y-4">
        <h2 className="font-heading text-base font-bold text-foreground">
          % of days you hit each target
        </h2>
        <ul className="space-y-3">
          {bars.map((b) => {
            const pct = stats.hitRate[b.key];
            const tone =
              pct >= 70
                ? "bg-emerald-500"
                : pct >= 40
                  ? "bg-amber-500"
                  : "bg-rose-500";
            return (
              <li key={b.key}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {b.label}
                  </span>
                  <span className="text-xs font-semibold text-foreground/80">
                    {pct}%
                  </span>
                </div>
                <div
                  className="h-2 rounded-full bg-muted overflow-hidden"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${b.label} target hit on ${pct}% of days`}
                >
                  <div
                    className={`h-full ${tone} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Top foods */}
      {stats.topFoods.length > 0 && (
        <section className="rounded-3xl border border-border bg-card p-5 space-y-3">
          <h2 className="font-heading text-base font-bold text-foreground">
            Most-logged foods this week
          </h2>
          <ul className="space-y-2">
            {stats.topFoods.map((f) => (
              <li
                key={f.name}
                className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 px-3 py-2"
              >
                <span className="text-sm capitalize">{f.name}</span>
                <span className="text-xs font-semibold text-primary">
                  {f.count}×
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
        {label}
      </p>
      <p className="font-heading text-xl text-foreground mt-1">{value}</p>
    </div>
  );
}
