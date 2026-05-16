"use client";

// Client-side tab shell for the meals tracker.
// Today / Add Meal / Stats / Insights — old keen_ai parity.
//
// All four panels are mounted at once and toggled via CSS so React state
// inside MealLogger / CustomFoodForm survives switching tabs. (E.g., a
// half-typed custom food doesn't get blown away when the user peeks at
// Stats.)

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  CalendarClock,
  Plus,
  TrendingUp,
  Sparkles,
} from "lucide-react";

type Tab = "today" | "add" | "stats" | "insights";

const TABS: { id: Tab; label: string; icon: ReactNode; sub: string }[] = [
  { id: "today", label: "Today", icon: <CalendarClock className="w-4 h-4" />, sub: "What you've logged" },
  { id: "add", label: "Add", icon: <Plus className="w-4 h-4" />, sub: "Voice + search + custom" },
  { id: "stats", label: "Stats", icon: <TrendingUp className="w-4 h-4" />, sub: "7-day rollup" },
  { id: "insights", label: "Insights", icon: <Sparkles className="w-4 h-4" />, sub: "What to try next" },
];

export function MealsTabsClient({
  today,
  add,
  stats,
  insights,
}: {
  today: ReactNode;
  add: ReactNode;
  stats: ReactNode;
  insights: ReactNode;
}) {
  const [tab, setTab] = useState<Tab>("today");

  return (
    <div className="space-y-4">
      <div
        role="tablist"
        aria-label="Meals view"
        className="grid grid-cols-4 gap-1 p-1 bg-muted/40 rounded-2xl sticky top-20 z-10 backdrop-blur-md"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "h-12 rounded-xl text-sm font-semibold transition flex flex-col items-center justify-center gap-0.5 px-1",
              tab === t.id
                ? "bg-primary text-white shadow-sm"
                : "text-foreground hover:bg-muted",
            )}
          >
            <span className="flex items-center gap-1.5">
              <span aria-hidden>{t.icon}</span>
              <span className="text-xs sm:text-sm">{t.label}</span>
            </span>
          </button>
        ))}
      </div>

      <Panel show={tab === "today"}>{today}</Panel>
      <Panel show={tab === "add"}>{add}</Panel>
      <Panel show={tab === "stats"}>{stats}</Panel>
      <Panel show={tab === "insights"}>{insights}</Panel>
    </div>
  );
}

function Panel({
  show,
  children,
}: {
  show: boolean;
  children: ReactNode;
}) {
  return <div className={cn("space-y-4", !show && "hidden")}>{children}</div>;
}
