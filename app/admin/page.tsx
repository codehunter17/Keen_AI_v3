/**
 * Operator dashboard — shows what Keen is observing.
 *
 * v0 lists the latest 50 observations + latest 50 proposals. As later modules
 * come online (Synthesizer, Proposer, Executor) this page grows tabs for each.
 */

import { nutrimamaHost } from "@/keen";
import { CronPanel } from "./cron-panel";

export const dynamic = "force-dynamic";

function fmt(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toISOString().replace("T", " ").slice(0, 16) + "Z";
}

export default async function AdminPage() {
  const [observations, proposals] = await Promise.all([
    nutrimamaHost.recentObservations(50),
    nutrimamaHost.recentProposals(50),
  ]);

  return (
    <div className="space-y-12">
      <CronPanel />

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h1 className="text-2xl font-heading font-bold">Recent observations</h1>
          <span className="text-xs text-muted-foreground font-mono">
            {observations.length} rows
          </span>
        </div>
        {observations.length === 0 ? (
          <div className="border border-dashed border-border rounded-2xl p-10 text-center text-sm text-muted-foreground">
            No observations yet. Trigger the nightly cron or wait for it to run.
          </div>
        ) : (
          <ul className="space-y-3">
            {observations.map((o) => (
              <li
                key={o.id}
                className="border border-border rounded-2xl p-4 bg-card"
              >
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
                  <span>
                    {fmt(o.windowStart)} → {fmt(o.windowEnd)}
                  </span>
                  <span>
                    {o.signalCount} signals · conf{" "}
                    {(o.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{o.summary}</p>
                {o.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {o.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-2xl font-heading font-bold">Pending proposals</h2>
          <span className="text-xs text-muted-foreground font-mono">
            {proposals.length} rows
          </span>
        </div>
        {proposals.length === 0 ? (
          <div className="border border-dashed border-border rounded-2xl p-10 text-center text-sm text-muted-foreground">
            No proposals yet. Proposer module is not online.
          </div>
        ) : (
          <ul className="space-y-3">
            {proposals.map((p) => (
              <li
                key={p.id}
                className="border border-border rounded-2xl p-4 bg-card"
              >
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
                  <span>{p.tier}</span>
                  <span>{p.status}</span>
                </div>
                <p className="text-sm font-semibold mb-1">{p.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {p.risk}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
