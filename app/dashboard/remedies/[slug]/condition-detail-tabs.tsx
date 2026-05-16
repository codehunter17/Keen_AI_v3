"use client";

import { useState } from "react";
import type {
  ConditionSections,
  EmergencyAlert,
} from "@/lib/conditions";
import { ConditionSectionRenderer } from "@/components/condition-section-renderer";
import { cn } from "@/lib/utils";

interface Props {
  sections: ConditionSections;
  yellowFlags: EmergencyAlert[];
  redFlags: EmergencyAlert[];
}

type TabId = "gharelu" | "ayurveda" | "modern" | "emergency" | "overview";

export function ConditionDetailTabs({
  sections,
  yellowFlags,
  redFlags,
}: Props) {
  const [active, setActive] = useState<TabId>("gharelu");

  const tabs: { id: TabId; label: string; emoji: string }[] = [
    { id: "gharelu", label: "Gharelu", emoji: "🌿" },
    { id: "ayurveda", label: "Ayurveda", emoji: "🧘" },
    { id: "modern", label: "Modern", emoji: "💊" },
    { id: "emergency", label: "When to worry", emoji: "🚨" },
    { id: "overview", label: "Overview", emoji: "📋" },
  ];

  return (
    <div className="space-y-3">
      {/* Tab bar — horizontal scroll on mobile */}
      <div
        role="tablist"
        aria-label="Condition information"
        className="-mx-1 overflow-x-auto no-scrollbar sticky top-20 z-10 bg-background/95 backdrop-blur-md py-2"
      >
        <div className="flex gap-2 px-1 min-w-min">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={active === t.id}
              aria-controls={`tabpanel-${t.id}`}
              id={`tab-${t.id}`}
              type="button"
              onClick={() => setActive(t.id)}
              className={cn(
                "shrink-0 h-10 px-4 rounded-full text-sm font-semibold border transition-all flex items-center gap-1.5",
                active === t.id
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-card text-foreground border-border hover:border-primary/40",
              )}
            >
              <span aria-hidden>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Panels */}
      <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 min-h-[200px]">
        {active === "overview" && (
          <Panel id="overview">
            <ConditionSectionRenderer text={sections.overview} />
          </Panel>
        )}
        {active === "gharelu" && (
          <Panel id="gharelu">
            <ConditionSectionRenderer text={sections.gharelu} />
          </Panel>
        )}
        {active === "ayurveda" && (
          <Panel id="ayurveda">
            <ConditionSectionRenderer text={sections.ayurveda} />
            <p className="mt-4 text-[11px] text-muted-foreground/80 italic">
              Ayurvedic herb dosages are traditional references — always consult
              a registered Vaidya, especially during pregnancy or breastfeeding.
            </p>
          </Panel>
        )}
        {active === "modern" && (
          <Panel id="modern">
            <ConditionSectionRenderer text={sections.modern} />
            <p className="mt-4 text-[11px] text-muted-foreground/80 italic">
              Drug brand names + dosages shown for reference only. Never
              self-prescribe — only take medication on a doctor&apos;s
              prescription.
            </p>
          </Panel>
        )}
        {active === "emergency" && (
          <Panel id="emergency">
            <div className="space-y-4">
              {redFlags.length > 0 && (
                <div>
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-red-700 dark:text-red-300 mb-2">
                    🔴 Call a doctor immediately
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {redFlags.map((e, i) => (
                      <li
                        key={i}
                        className="flex gap-2 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 px-3 py-2"
                      >
                        <span className="text-red-500 select-none">🔴</span>
                        <span className="text-red-900 dark:text-red-100">
                          {e.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {yellowFlags.length > 0 && (
                <div>
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-2">
                    🟡 Investigate within a few days
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {yellowFlags.map((e, i) => (
                      <li
                        key={i}
                        className="flex gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 px-3 py-2"
                      >
                        <span className="text-amber-500 select-none">🟡</span>
                        <span className="text-amber-900 dark:text-amber-100">
                          {e.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {redFlags.length === 0 && yellowFlags.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  No specific red-flag signs documented for this condition.
                  Consult a doctor if symptoms persist or worsen.
                </p>
              )}
              <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                In a life-threatening emergency in India, call{" "}
                <a
                  href="tel:108"
                  className="font-bold underline text-red-600 dark:text-red-300"
                >
                  108
                </a>{" "}
                immediately.
              </p>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}

function Panel({
  id,
  children,
}: {
  id: TabId;
  children: React.ReactNode;
}) {
  return (
    <div role="tabpanel" id={`tabpanel-${id}`} aria-labelledby={`tab-${id}`}>
      {children}
    </div>
  );
}
