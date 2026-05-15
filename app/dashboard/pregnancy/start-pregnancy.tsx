"use client";

// "Start Pregnancy Tracking" panel shown on /dashboard/pregnancy when
// the user isn't currently pregnant. Replaces the old "go to settings"
// punt — users start tracking right here.
//
// Pattern: a friendly explainer card + a small stepper for current
// pregnancy week (1-40) + a "Start tracking" CTA. On success the
// server action mutates the User row and we router.refresh() so the
// page rerenders as the full clinical view.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Plus, Minus, Sparkles } from "lucide-react";
import { startPregnancyTracking } from "./actions";

export function StartPregnancyPanel() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [weeks, setWeeks] = useState<number>(8);
  const [error, setError] = useState<string | null>(null);

  const bump = (delta: number) => {
    setWeeks((w) => Math.max(1, Math.min(40, w + delta)));
  };

  const start = () => {
    setError(null);
    startTransition(async () => {
      const res = await startPregnancyTracking({ weeks });
      if (!res.ok) {
        setError(
          res.reason === "INVALID"
            ? "Weeks must be 1-40."
            : "Could not start tracking. Try again.",
        );
        return;
      }
      router.refresh();
    });
  };

  // Estimate due date for the preview (today + (40 - weeks) * 7 days)
  const eddPreview = (() => {
    const remaining = (40 - weeks) * 7;
    const d = new Date(Date.now() + remaining * 86_400_000);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  })();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-br from-rose-100 via-rose-50 to-amber-50 dark:from-rose-950/30 dark:via-rose-950/20 dark:to-amber-950/20 p-7 sm:p-9 relative overflow-hidden text-center"
      >
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="text-5xl mb-3" aria-hidden>🤰</div>
        <h1 className="font-heading text-3xl sm:text-4xl text-foreground tracking-tight">
          Start pregnancy tracking
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
          Unlock the 40-week clinical guide — fetal development, ANC schedule,
          phase-specific nutrition, warning signs, all anchored to your week.
        </p>
        <p className="text-xs text-muted-foreground mt-2 italic">
          Your cycle tracking keeps working in parallel — nothing else changes.
        </p>
      </motion.section>

      {/* Weeks stepper */}
      <section className="rounded-3xl bg-card border border-border p-6 sm:p-7">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground text-center">
          How many weeks pregnant are you?
        </p>
        <div className="mt-4 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => bump(-1)}
            aria-label="Decrease"
            className="w-14 h-14 rounded-2xl bg-muted hover:bg-muted/70 active:scale-95 transition flex items-center justify-center text-foreground"
          >
            <Minus className="w-5 h-5" />
          </button>
          <div className="text-center min-w-[140px]">
            <p className="font-heading text-6xl text-rose-600 tracking-tight tabular-nums">
              {weeks}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
              {weeks === 1 ? "week" : "weeks"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => bump(1)}
            aria-label="Increase"
            className="w-14 h-14 rounded-2xl bg-muted hover:bg-muted/70 active:scale-95 transition flex items-center justify-center text-foreground"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Quick presets for common cases */}
        <div className="mt-5 flex flex-wrap gap-2 justify-center">
          {[4, 8, 12, 16, 20, 24, 28, 32, 36].map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWeeks(w)}
              className={
                "text-xs font-semibold rounded-full px-3 py-1 border transition " +
                (weeks === w
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-card border-border text-muted-foreground hover:border-rose-300")
              }
            >
              W{w}
            </button>
          ))}
        </div>

        {/* EDD preview */}
        <div className="mt-5 rounded-2xl bg-muted/50 px-4 py-3 text-center text-sm">
          <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
            Estimated due date
          </p>
          <p className="font-heading text-lg text-foreground mt-0.5">{eddPreview}</p>
          <p className="text-[11px] text-muted-foreground mt-1">
            (rough — your doctor&apos;s scan-based EDD is more accurate)
          </p>
        </div>

        {error && (
          <p className="mt-3 text-center text-sm text-destructive">{error}</p>
        )}

        <button
          type="button"
          onClick={start}
          disabled={pending}
          className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white py-3.5 font-semibold shadow-lg hover:scale-[1.01] active:scale-95 transition disabled:opacity-60"
        >
          <Sparkles className="w-4 h-4" />
          {pending ? "Starting…" : "Start pregnancy tracking"}
        </button>

        <p className="mt-3 text-[11px] text-muted-foreground text-center leading-relaxed">
          You can stop tracking anytime — your cycle data stays intact.
        </p>
      </section>
    </div>
  );
}
