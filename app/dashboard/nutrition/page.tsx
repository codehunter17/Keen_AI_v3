"use client";
import { useQuery } from "@tanstack/react-query";
import { getNutritionPlan } from "@/lib/actions/nutrition";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { Info, AlertCircle, Apple, Sparkles, Lock } from "lucide-react";
import { pickDaily, DAILY_NUTRIENT_FOCUS } from "@/lib/daily";
import { isTierLockError, isQuotaError } from "@/lib/errors";

export default function NutritionPage() {
  const [activeDay, setActiveDay] = useState(1);
  // Today's "focus nutrient" — rotates daily, same for everyone on a given date.
  const focus = pickDaily(DAILY_NUTRIENT_FOCUS);
  const { data, isLoading, error } = useQuery({
    queryKey: ["nutritionPlan"],
    queryFn: async () => await getNutritionPlan(),
    // Don't retry paywall errors — they won't resolve without an upgrade.
    retry: (failureCount, err) => {
      if (isTierLockError(err) || isQuotaError(err)) return false;
      return failureCount < 1;
    },
  });

  // Tier-locked → render a paywall instead of crashing or spinning forever.
  const isTierLocked = isTierLockError(error);
  const isQuotaExceeded = isQuotaError(error);

  if (isLoading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">
          Generating your personalized AI nutrition plan...
        </p>
      </div>
    );
  }

  // Paywall — Free tier user, no meal plans access. Show the daily nutrient
  // strip as a sample of value, then prompt upgrade.
  if (isTierLocked || isQuotaExceeded) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 px-5 pb-16">
        {/* Still show the rotating focus nutrient — gives Free users value */}
        <NutrientFocusStrip focus={focus} />

        <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-secondary/5 to-gold/5 p-6 sm:p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl text-foreground">
            {isQuotaExceeded ? "You've used this month's meal plans" : "Personalized meal plans"}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            {isQuotaExceeded
              ? "You're on Care (4 plans per month). Upgrade to Pro for unlimited weekly regenerations."
              : "AI-generated 7-day meal plans, regional & cycle-aware, with ICMR-NIN nutrient targets. Care includes 4 plans / month, Pro is unlimited."}
          </p>
          <Link
            href="/pricing"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:scale-[1.02] transition shadow-lg"
          >
            View plans →
          </Link>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Care from ₹49/mo · cancel anytime
          </p>
        </div>

        {/* Generic guidance any tier can use — keeps page useful, not empty */}
        <div className="rounded-2xl bg-card border border-border p-5">
          <h3 className="font-heading text-lg mb-2">Free guidance you can use today</h3>
          <ul className="text-sm text-foreground/80 space-y-2 leading-relaxed">
            <li>• Aim for one fistful of greens at lunch <em>and</em> dinner.</li>
            <li>• Pair iron sources (chana, methi, gur) with lemon/amla — doubles absorption.</li>
            <li>• Drink water 30 min <em>before</em> meals, not during, for better digestion.</li>
            <li>• Last meal at least 2 hours before bed → better sleep + blood-sugar control.</li>
          </ul>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center mt-20 text-destructive">
        Could not load your nutrition plan. Try again in a moment.
      </div>
    );
  }

  const currentDayData =
    data.days?.find((d: { day: number }) => d.day === activeDay) || data.days[0];

  return (
    <div className="max-w-5xl mx-auto space-y-8 px-5 pb-10">
      <NutrientFocusStrip focus={focus} />

      {/* Milestone Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-linear-to-tl dark:from-primary dark:to-secondary from-primary/70 to-secondary/70  p-8 text-white shadow-xl relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl text-amber-800 font-bold mb-2">
              This Week&apos;s Focus
            </h1>
            <p className="text-lg font-medium opacity-90">{data.milestone}</p>
          </div>
          {data.preferenceReasoning && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 max-w-md">
              <div className="flex items-center space-x-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
                  Personalized for You
                </span>
              </div>
              <p className="text-sm opacity-90 leading-relaxed italic">
                &quot;{data.preferenceReasoning}&quot;
              </p>
            </div>
          )}
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-20 -z-0">
          <Apple className="w-32 h-32" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Infos */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl bg-card p-6 shadow-sm border border-border">
            <div className="flex items-center space-x-2 text-secondary mb-4">
              <Info className="w-5 h-5" />
              <h3 className="font-heading text-xl font-semibold text-foreground">
                Top Nutrients
              </h3>
            </div>
            <ul className="space-y-3">
              {data.topNutrients?.map((n: string, i: number) => (
                <li
                  key={i}
                  className="flex items-center space-x-3 bg-secondary/20 p-3 rounded-xl"
                >
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="font-medium text-foreground text-sm">
                    {n}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-destructive/5 text-red-500 p-6 border border-destructive/20 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-xl font-bold text-red-500">Foods to Avoid</h3>
            </div>
            <ul className="space-y-2 text-red-500/90">
              {data.avoidFoods?.map((f: string, i: number) => (
                <li key={i} className="text-sm font-medium flex items-center">
                  <span className="mr-2">•</span> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-primary/10 p-6 shadow-sm border border-primary/20 text-center">
            <p className="text-xs text-primary font-bold tracking-wider uppercase mb-2">
              Notice
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              This is informational only and not a substitute for professional
              medical advice. Please consult your doctor for medical concerns.
            </p>
          </div>
        </div>

        {/* Calendar UI */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex space-x-2 overflow-x-auto pb-2  custom-scrollbar">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-24 rounded-2xl transition-all duration-300 ${
                  activeDay === d
                    ? "bg-primary text-white shadow-primary/30 shadow-md"
                    : "bg-card text-muted-foreground border border-border hover:bg-secondary/30"
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-wider mb-1">
                  Day
                </span>
                <span className="text-2xl font-bold">{d}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {["breakfast", "lunch", "dinner", "snacks"].map(
                (mealStr, index) => {
                  const mealData = currentDayData[mealStr];
                  if (!mealData) return null;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={mealStr}
                      className="bg-card p-6 rounded-3xl shadow-sm border border-border flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                          {mealStr}
                        </h4>
                        <p className="font-medium text-foreground text-lg leading-relaxed">
                          {mealData.items}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {mealData.nutrients}
                        </p>
                      </div>
                      <div className="bg-secondary/30 px-4 py-3 rounded-2xl flex flex-col items-center justify-center shrink-0 min-w-[100px]">
                        <span className="text-xl font-bold text-foreground">
                          {mealData.calories}
                        </span>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                          kcal
                        </span>
                      </div>
                    </motion.div>
                  );
                },
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Reusable focus-nutrient strip — shown both on the full meal-plan page
// AND the Free-tier paywall, so day-zero users still get one piece of
// daily value here.
function NutrientFocusStrip({
  focus,
}: {
  focus: { nutrient: string; target: string; sources: string; why: string };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-primary/20 bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest font-semibold text-primary">
            Today&apos;s focus nutrient
          </p>
          <p className="font-heading text-xl text-foreground mt-0.5">
            {focus.nutrient}
            <span className="text-sm text-muted-foreground font-normal ml-2">
              target {focus.target}
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-1 leading-snug">
            {focus.why}
          </p>
        </div>
      </div>
      <div className="text-xs sm:text-right text-foreground/80 sm:max-w-[240px]">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-1">
          Get it from
        </p>
        {focus.sources}
      </div>
    </motion.div>
  );
}
