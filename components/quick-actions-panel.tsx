"use client";

// Dashboard "Today" quick-actions panel.
// Mood logger (one-tap emoji) + hydration counter (tap + or 250ml) + 4
// shortcuts to log meal / open chat / view warnings / open weekly.
//
// Designed for villager + urban: every action has an icon AND a word,
// targets are 44px+, error states are soft (toast-free — inline).

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Droplets,
  Apple,
  MessageSquare,
  AlertTriangle,
  BarChart3,
  Plus,
  Loader2,
} from "lucide-react";
import {
  drinkOneGlass,
  logMoodToday,
  getTodayQuickState,
} from "@/lib/actions/quick-log";

const MOOD_EMOJIS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😔", label: "Down" },
  { emoji: "😴", label: "Tired" },
  { emoji: "🤩", label: "Great" },
  { emoji: "😣", label: "Unwell" },
] as const;

export function QuickActionsPanel({
  initialMood,
  initialWaterGlasses,
}: {
  initialMood: string | null;
  initialWaterGlasses: number;
}) {
  const [mood, setMood] = useState(initialMood);
  const [glasses, setGlasses] = useState(initialWaterGlasses);
  const [savingMood, setSavingMood] = useTransition();
  const [savingWater, setSavingWater] = useTransition();

  const onMood = (emoji: string) => {
    const previous = mood;
    setMood(emoji); // optimistic
    setSavingMood(async () => {
      const res = await logMoodToday(emoji);
      if (!res.ok) {
        setMood(previous); // revert
        return;
      }
      // Refresh from server to stay honest about persisted state.
      const fresh = await getTodayQuickState();
      setMood(fresh.mood);
    });
  };

  const onDrink = () => {
    setGlasses((g) => g + 1); // optimistic
    setSavingWater(async () => {
      const res = await drinkOneGlass();
      if (res.ok && typeof res.glasses === "number") {
        setGlasses(res.glasses);
      }
    });
  };

  const waterMl = glasses * 250;
  const waterTarget = 2000;
  const waterPct = Math.min(100, Math.round((waterMl / waterTarget) * 100));

  return (
    <section className="rounded-3xl bg-card border border-border p-5 sm:p-6 space-y-5 shadow-sm">
      <header className="flex items-center justify-between">
        <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">
          Quick log
        </h2>
        <span className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground">
          Tap once
        </span>
      </header>

      {/* Mood row */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground/85">
          How are you feeling?{" "}
          {mood && (
            <span className="text-muted-foreground text-xs">
              Saved: {mood}
            </span>
          )}
        </p>
        <div className="grid grid-cols-6 gap-2">
          {MOOD_EMOJIS.map((m) => {
            const active = mood === m.emoji;
            return (
              <button
                key={m.emoji}
                type="button"
                onClick={() => onMood(m.emoji)}
                disabled={savingMood}
                aria-label={`Log mood: ${m.label}`}
                aria-pressed={active}
                className={`min-h-12 rounded-2xl border text-2xl flex items-center justify-center transition active:scale-95 ${
                  active
                    ? "bg-primary/10 border-primary shadow-sm"
                    : "bg-card border-border hover:border-primary/40"
                }`}
              >
                {m.emoji}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hydration row */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-foreground/85">
            Water · {glasses} glasses (≈ {(waterMl / 1000).toFixed(1)} L)
          </p>
          <span className="text-xs font-semibold text-primary">
            {waterPct}%
          </span>
        </div>
        <div
          className="h-2 rounded-full bg-muted overflow-hidden"
          role="progressbar"
          aria-valuenow={waterPct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-sky-400 transition-all"
            style={{ width: `${waterPct}%` }}
          />
        </div>
        <button
          type="button"
          onClick={onDrink}
          disabled={savingWater}
          className="w-full h-12 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold inline-flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-70"
        >
          {savingWater ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <Droplets className="w-4 h-4" aria-hidden />
          <span>I drank a glass</span>
        </button>
      </div>

      {/* Shortcuts grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Shortcut
          href="/dashboard/meals"
          icon={<Apple className="w-4 h-4" />}
          label="Log meal"
          tone="emerald"
        />
        <Shortcut
          href="/dashboard/chat"
          icon={<MessageSquare className="w-4 h-4" />}
          label="Ask AI"
          tone="violet"
        />
        <Shortcut
          href="/dashboard/pregnancy/warnings"
          icon={<AlertTriangle className="w-4 h-4" />}
          label="Warning signs"
          tone="rose"
        />
        <Shortcut
          href="/dashboard/weekly"
          icon={<BarChart3 className="w-4 h-4" />}
          label="Weekly"
          tone="amber"
        />
      </div>
    </section>
  );
}

function Shortcut({
  href,
  icon,
  label,
  tone,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  tone: "emerald" | "violet" | "rose" | "amber";
}) {
  const toneClass = {
    emerald:
      "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50",
    violet:
      "bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/50",
    rose:
      "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/50",
    amber:
      "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50",
  }[tone];
  return (
    <Link
      href={href}
      className={`min-h-12 rounded-2xl border p-3 flex flex-col items-center justify-center gap-1 text-xs font-semibold transition active:scale-[0.98] ${toneClass}`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
