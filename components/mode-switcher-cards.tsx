// Mode-switcher cards — three lifecycle-aware entry points (Cycle /
// Nutrition / Pregnancy). Each card is themed to its mode and shows a
// one-glance status, then links to the full page. The "primary" mode
// (largest card) is picked based on the user's lifeStage, so a pregnant
// user opens to the Pregnancy card most prominently.
//
// Replaces the generic Cycle/BMI side-by-side strip on the dashboard for
// users who haven't customized — gives the home page identity.

import Link from "next/link";
import { Heart, Apple, Baby, ChevronRight, Droplets, Calendar } from "lucide-react";

type LifeStage =
  | "ADULT_MENSTRUATING"
  | "TRYING_TO_CONCEIVE"
  | "PREGNANT"
  | "POSTPARTUM"
  | "PERIMENOPAUSE"
  | "MENOPAUSE"
  | string
  | null
  | undefined;

interface Props {
  lifeStage: LifeStage;
  pregnancyWeek?: number | null;
  cycleDay?: number | null;
  nextPeriodInDays?: number | null;
  hydrationPercent?: number;
  daysLoggedThisWeek?: number;
}

function primaryMode(stage: LifeStage): "cycle" | "nutrition" | "pregnancy" {
  if (stage === "PREGNANT" || stage === "POSTPARTUM") return "pregnancy";
  if (stage === "TRYING_TO_CONCEIVE") return "cycle";
  return "cycle";
}

export function ModeSwitcherCards({
  lifeStage,
  pregnancyWeek,
  cycleDay,
  nextPeriodInDays,
  hydrationPercent = 0,
  daysLoggedThisWeek = 0,
}: Props) {
  const primary = primaryMode(lifeStage);

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Today&apos;s focus
        </h2>
        <span className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground">
          Pick a mode
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ModeCard
          href="/dashboard/cycle"
          tone="rose"
          large={primary === "cycle"}
          emoji="🌸"
          icon={<Heart className="w-4 h-4" />}
          title="Cycle mode"
          subtitle={
            cycleDay
              ? `Day ${cycleDay} of your cycle`
              : "Track your period + phases"
          }
          stat={
            nextPeriodInDays != null
              ? `Next period in ~${nextPeriodInDays}d`
              : "Log a period to start"
          }
          statIcon={<Calendar className="w-3.5 h-3.5" />}
        />

        <ModeCard
          href="/dashboard/meals"
          tone="emerald"
          large={primary === "nutrition"}
          emoji="🥗"
          icon={<Apple className="w-4 h-4" />}
          title="Nutrition mode"
          subtitle="Log meals · hit your targets"
          stat={
            daysLoggedThisWeek > 0
              ? `${daysLoggedThisWeek}/7 days logged`
              : "Tap to log today"
          }
          statIcon={<Droplets className="w-3.5 h-3.5" />}
          rightStat={`${hydrationPercent}% water`}
        />

        <ModeCard
          href="/dashboard/pregnancy"
          tone="amber"
          large={primary === "pregnancy"}
          emoji="🤰"
          icon={<Baby className="w-4 h-4" />}
          title="Pregnancy mode"
          subtitle={
            pregnancyWeek
              ? `Week ${pregnancyWeek} care plan`
              : "Plan + week-by-week"
          }
          stat={
            pregnancyWeek
              ? `Trimester ${pregnancyWeek <= 13 ? 1 : pregnancyWeek <= 26 ? 2 : 3}`
              : "Set your due date"
          }
          statIcon={<Baby className="w-3.5 h-3.5" />}
        />
      </div>
    </section>
  );
}

function ModeCard({
  href,
  tone,
  large,
  emoji,
  icon,
  title,
  subtitle,
  stat,
  statIcon,
  rightStat,
}: {
  href: string;
  tone: "rose" | "emerald" | "amber";
  large: boolean;
  emoji: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  stat: string;
  statIcon: React.ReactNode;
  rightStat?: string;
}) {
  const toneBg = {
    rose: "bg-gradient-to-br from-rose-50 to-rose-100/60 dark:from-rose-950/40 dark:to-rose-900/20 border-rose-200/60 dark:border-rose-800/40",
    emerald:
      "bg-gradient-to-br from-emerald-50 to-emerald-100/60 dark:from-emerald-950/40 dark:to-emerald-900/20 border-emerald-200/60 dark:border-emerald-800/40",
    amber:
      "bg-gradient-to-br from-amber-50 to-amber-100/60 dark:from-amber-950/40 dark:to-amber-900/20 border-amber-200/60 dark:border-amber-800/40",
  }[tone];

  const toneText = {
    rose: "text-rose-900 dark:text-rose-100",
    emerald: "text-emerald-900 dark:text-emerald-100",
    amber: "text-amber-900 dark:text-amber-100",
  }[tone];

  const toneAccent = {
    rose: "text-rose-700 dark:text-rose-300",
    emerald: "text-emerald-700 dark:text-emerald-300",
    amber: "text-amber-700 dark:text-amber-300",
  }[tone];

  return (
    <Link
      href={href}
      className={`group rounded-3xl border-2 p-4 sm:p-5 transition active:scale-[0.99] hover:shadow-lg ${toneBg} ${
        large ? "sm:col-span-3 sm:p-6" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl sm:text-4xl leading-none shrink-0" aria-hidden>
          {emoji}
        </div>
        <div className={`flex-1 min-w-0 ${toneText}`}>
          <div className="flex items-center gap-1.5 mb-1">
            <span className={toneAccent}>{icon}</span>
            <h3 className="font-heading font-bold text-base sm:text-lg">
              {title}
            </h3>
          </div>
          <p className="text-sm opacity-85 leading-snug">{subtitle}</p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold ${toneAccent}`}
            >
              {statIcon}
              {stat}
            </span>
            {rightStat ? (
              <span className={`text-xs font-semibold ${toneAccent}`}>
                {rightStat}
              </span>
            ) : (
              <ChevronRight
                className={`w-4 h-4 ${toneAccent} group-hover:translate-x-0.5 transition`}
              />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
