import Link from "next/link";
import { BadgeShelf } from "@/components/badge-shelf";
import { Suspense } from "react";

/**
 * Child dashboard (ages 4–11): Body Safety + Nutrition only.
 * Simple, joyful, age-appropriate layout.
 */
export function ChildOverview({ name }: { name: string }) {
  const firstName = name.split(" ")[0] || "Friend";
  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      {/* Welcome banner */}
      <div className="rounded-3xl bg-linear-to-br from-primary/10 via-secondary/10 to-gold/5 border border-primary/15 p-6 text-center">
        <p className="text-4xl mb-2">🌟</p>
        <h1 className="font-heading text-3xl text-primary">Hi, {firstName}!</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome to your health corner. Learn, eat well, and stay safe!
        </p>
      </div>

      {/* Two big action cards */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/dashboard/body-safety"
          className="group rounded-3xl border-2 border-primary/20 bg-card hover:bg-primary/5 hover:border-primary/40 transition-all p-5 flex flex-col items-center text-center gap-3 active:scale-[0.97]"
        >
          <span className="text-5xl">🛡️</span>
          <div>
            <p className="font-heading text-base font-bold text-foreground">
              Body Safety
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Good touch &amp; bad touch
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/meals"
          className="group rounded-3xl border-2 border-secondary/30 bg-card hover:bg-secondary/5 hover:border-secondary/50 transition-all p-5 flex flex-col items-center text-center gap-3 active:scale-[0.97]"
        >
          <span className="text-5xl">🥗</span>
          <div>
            <p className="font-heading text-base font-bold text-foreground">
              Healthy Meals
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Food for strong bodies
            </p>
          </div>
        </Link>
      </div>

      {/* Learn shortcut */}
      <Link
        href="/dashboard/learn"
        className="flex items-center gap-4 rounded-2xl border border-border bg-card hover:bg-muted transition p-4"
      >
        <span className="text-3xl">📚</span>
        <div>
          <p className="font-heading text-sm font-bold text-foreground">
            Learn &amp; Explore
          </p>
          <p className="text-xs text-muted-foreground">
            Fun health facts and stories
          </p>
        </div>
        <span className="ml-auto text-muted-foreground text-sm">→</span>
      </Link>

      {/* Badges */}
      <Suspense fallback={null}>
        <BadgeShelf />
      </Suspense>
    </div>
  );
}
