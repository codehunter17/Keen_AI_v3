import Link from "next/link";
import { BadgeShelf } from "@/components/badge-shelf";
import { Suspense } from "react";
import { BmiCard } from "@/components/bmi-card";
import { StreakWidget } from "@/components/streak-widget";
import { NotificationPrompt } from "@/components/notification-prompt";

/**
 * Teen dashboard (ages 12–17): Cycle + Nutrition + Wellness.
 * No AI chat, no pregnancy, no adult-only sections.
 */
export function TeenOverview({ name, lifeStage }: { name: string; lifeStage: string }) {
  const firstName = name.split(" ")[0] || "Friend";
  const hasPeriod = lifeStage === "TEEN_14_17" || lifeStage === "TEEN_11_13";

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto">
      <NotificationPrompt />

      {/* Welcome */}
      <div className="rounded-3xl bg-linear-to-br from-primary/10 via-secondary/10 to-gold/5 border border-primary/15 p-6">
        <h1 className="font-heading text-2xl text-primary">Hi, {firstName}! 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your personal health hub — track your cycle, eat well, feel great.
        </p>
      </div>

      {/* Quick links grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {hasPeriod && (
          <Link
            href="/dashboard/cycle"
            className="rounded-2xl border border-border bg-card hover:bg-primary/5 hover:border-primary/30 transition p-4 flex flex-col items-center gap-2 text-center active:scale-[0.97]"
          >
            <span className="text-3xl">🌸</span>
            <p className="font-heading text-sm font-bold text-foreground">My Cycle</p>
            <p className="text-xs text-muted-foreground">Track periods &amp; phases</p>
          </Link>
        )}

        <Link
          href="/dashboard/meals"
          className="rounded-2xl border border-border bg-card hover:bg-secondary/5 hover:border-secondary/30 transition p-4 flex flex-col items-center gap-2 text-center active:scale-[0.97]"
        >
          <span className="text-3xl">🥗</span>
          <p className="font-heading text-sm font-bold text-foreground">Meals</p>
          <p className="text-xs text-muted-foreground">Nutrition for your age</p>
        </Link>

        <Link
          href="/dashboard/wellness"
          className="rounded-2xl border border-border bg-card hover:bg-accent hover:border-accent-foreground/10 transition p-4 flex flex-col items-center gap-2 text-center active:scale-[0.97]"
        >
          <span className="text-3xl">💧</span>
          <p className="font-heading text-sm font-bold text-foreground">Wellness</p>
          <p className="text-xs text-muted-foreground">Mood, hydration &amp; more</p>
        </Link>

        <Link
          href="/dashboard/remedies"
          className="rounded-2xl border border-border bg-card hover:bg-muted transition p-4 flex flex-col items-center gap-2 text-center active:scale-[0.97]"
        >
          <span className="text-3xl">🌿</span>
          <p className="font-heading text-sm font-bold text-foreground">Remedies</p>
          <p className="text-xs text-muted-foreground">Natural relief tips</p>
        </Link>

        <Link
          href="/dashboard/learn"
          className="rounded-2xl border border-border bg-card hover:bg-muted transition p-4 flex flex-col items-center gap-2 text-center active:scale-[0.97]"
        >
          <span className="text-3xl">📚</span>
          <p className="font-heading text-sm font-bold text-foreground">Learn</p>
          <p className="text-xs text-muted-foreground">Articles &amp; videos</p>
        </Link>

        <Link
          href="/dashboard/selfcare"
          className="rounded-2xl border border-border bg-card hover:bg-muted transition p-4 flex flex-col items-center gap-2 text-center active:scale-[0.97]"
        >
          <span className="text-3xl">🧘</span>
          <p className="font-heading text-sm font-bold text-foreground">Self-care</p>
          <p className="text-xs text-muted-foreground">Rest &amp; relax</p>
        </Link>
      </div>

      {/* BMI card (age-adjusted) + Streak */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Suspense fallback={null}>
          <BmiCard />
        </Suspense>
        <Suspense fallback={null}>
          <StreakWidget />
        </Suspense>
      </div>

      {/* Achievements */}
      <Suspense fallback={null}>
        <BadgeShelf />
      </Suspense>
    </div>
  );
}
