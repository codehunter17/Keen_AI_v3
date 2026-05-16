"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Panel {
  trimester: 1 | 2 | 3;
  range: string;
  perWeekSigns: string[];
  redFlags: { text: string; conditionName: string; conditionSlug: string }[];
}

export function TrimesterWarningsTabs({
  panels,
  initialTrimester,
}: {
  panels: Record<1 | 2 | 3, Panel>;
  initialTrimester: 1 | 2 | 3;
}) {
  const [active, setActive] = useState<1 | 2 | 3>(initialTrimester);
  const panel = panels[active];

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Trimester"
        className="grid grid-cols-3 gap-2 p-1 bg-muted/40 rounded-2xl"
      >
        {([1, 2, 3] as const).map((t) => {
          const isActive = active === t;
          return (
            <button
              key={t}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(t)}
              className={cn(
                "h-11 rounded-xl text-sm font-semibold transition flex flex-col items-center justify-center gap-0.5",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-foreground hover:bg-muted",
              )}
            >
              <span>Trimester {t}</span>
              <span className="text-[10px] opacity-80 font-medium">
                {panels[t].range}
              </span>
            </button>
          );
        })}
      </div>

      {/* Red flags from KB */}
      {panel.redFlags.length > 0 && (
        <section className="rounded-3xl border border-red-300 dark:border-red-800/60 bg-red-50/60 dark:bg-red-950/20 p-5 space-y-3">
          <h2 className="font-heading text-base font-bold text-red-900 dark:text-red-100">
            🔴 Call a doctor immediately
          </h2>
          <ul className="space-y-2 text-sm">
            {panel.redFlags.map((f, i) => (
              <li
                key={i}
                className="rounded-2xl bg-card border border-red-200 dark:border-red-800/40 px-3 py-2.5 flex flex-col gap-1.5"
              >
                <div className="flex gap-2">
                  <span className="text-red-500 select-none">🔴</span>
                  <span className="text-red-900 dark:text-red-100">
                    {f.text}
                  </span>
                </div>
                <Link
                  href={`/dashboard/remedies/${f.conditionSlug}`}
                  className="self-start text-xs font-semibold text-primary hover:underline"
                >
                  Read more about {f.conditionName} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Per-week curated signs */}
      {panel.perWeekSigns.length > 0 && (
        <section className="rounded-3xl border border-amber-300/40 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800/40 p-5 space-y-3">
          <h2 className="font-heading text-base font-bold text-amber-900 dark:text-amber-100">
            🟡 Watch for during {panel.range.toLowerCase()}
          </h2>
          <ul className="space-y-1.5 text-sm text-amber-900/90 dark:text-amber-100/90">
            {panel.perWeekSigns.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden>→</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {panel.redFlags.length === 0 && panel.perWeekSigns.length === 0 && (
        <p className="text-sm text-muted-foreground italic px-2">
          No specific signs documented for this trimester. Continue routine ANC
          visits as scheduled.
        </p>
      )}
    </div>
  );
}
