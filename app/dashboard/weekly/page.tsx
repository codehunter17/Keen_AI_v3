// Weekly Report — server component shell. Heavy aggregation + AI story
// happen in lib/actions/weekly-report.ts. Free tier sees rollups only;
// Care+ sees the AI-written "Your story" paragraph too.

import { getWeeklyReport } from "@/lib/actions/weekly-report";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { getWeekNutritionStats } from "@/lib/actions/nutrition-summary";
import {
  Calendar,
  Droplets,
  ClipboardCheck,
  Activity,
  Sparkles,
  Lock,
  AlertCircle,
  AlertOctagon,
  Phone,
  TrendingUp,
} from "lucide-react";

export const metadata = { title: "Your week — NutriMama" };

// ICMR-NIN-grounded ASHA escalation. If any of iron/calcium/folate hit
// rate is below 30% this week, we surface the rural-India health-worker
// callout above the AI story — credibility signature, not for every dip.
const CRITICAL_THRESHOLD = 30;

export default async function WeeklyPage() {
  const [res, nutritionStats] = await Promise.all([
    getWeeklyReport(),
    getWeekNutritionStats(),
  ]);
  const criticalNutrients = nutritionStats
    ? (["iron", "calcium", "folate"] as const).filter(
        (n) => nutritionStats.hitRate[n] < CRITICAL_THRESHOLD,
      )
    : [];

  if (!res.ok && res.reason === "NO_DATA") {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-5">
        <h1 className="font-heading text-2xl text-foreground">Your week</h1>
        <div className="rounded-3xl border border-dashed border-border bg-card/40 p-8 text-center space-y-3">
          <div className="text-4xl">📋</div>
          <p className="text-sm text-muted-foreground">
            Log a few days first so we can show you patterns. Open Wellness or
            do a quick check-in and come back tomorrow.
          </p>
          <Link
            href="/dashboard/wellness"
            className="inline-flex h-11 px-5 rounded-full bg-primary text-white font-semibold items-center"
          >
            Go to Wellness
          </Link>
        </div>
      </div>
    );
  }

  if (!res.ok) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-sm text-muted-foreground">Sign in to view your weekly report.</p>
      </div>
    );
  }

  const startLabel = format(parseISO(res.weekStart), "d MMM");
  const endLabel = format(parseISO(res.weekEnd), "d MMM yyyy");

  return (
    <div className="max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-5">
      <header className="space-y-1.5">
        <span className="chip border-primary/30 text-primary">
          Weekly report
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl text-foreground">
          {startLabel} – {endLabel}
        </h1>
        <p className="text-sm text-muted-foreground">
          A 7-day snapshot of your logs, mood, and rhythm.
        </p>
      </header>

      {/* ASHA escalation — only when critical, never noisy */}
      {criticalNutrients.length > 0 && (
        <section className="rounded-3xl border border-red-300 dark:border-red-800/60 bg-red-50 dark:bg-red-950/30 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-300" />
            <h2 className="font-heading text-base font-bold text-red-900 dark:text-red-100">
              Consult your ASHA worker this week
            </h2>
          </div>
          <p className="text-sm text-red-900/90 dark:text-red-100/90 leading-relaxed">
            <strong>
              {criticalNutrients.map((n) => n).join(", ")}
            </strong>{" "}
            ran critically low (ICMR-NIN RDA &lt; 30% hit rate). Your local
            ASHA worker can arrange free supplements from the nearest PHC. In
            pregnancy, persistent deficiency carries real risk — don&apos;t
            wait it out.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="tel:104"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
            >
              <Phone className="w-3.5 h-3.5" />
              Call 104 (Health Helpline)
            </a>
            <Link
              href="/dashboard/meals"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-red-300 dark:border-red-800 text-red-900 dark:text-red-100 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-950/50 transition"
            >
              See nutrition insights →
            </Link>
          </div>
        </section>
      )}

      {/* Numbers strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Calendar className="w-5 h-5" />}
          label="Days logged"
          value={`${res.daysLogged}/7`}
          tone="primary"
        />
        <StatCard
          icon={<Droplets className="w-5 h-5" />}
          label="Water (avg)"
          value={`${res.avgWaterGlasses}/day`}
          tone="sky"
        />
        <StatCard
          icon={<ClipboardCheck className="w-5 h-5" />}
          label="Check-ins"
          value={String(res.totalCheckins)}
          tone="emerald"
        />
        <StatCard
          icon={<Activity className="w-5 h-5" />}
          label="Cycle logged"
          value={res.cycleLogged ? "Yes" : "—"}
          tone="rose"
        />
      </div>

      {/* AI story */}
      <section className="rounded-3xl border border-border bg-card p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="font-heading text-lg font-bold text-foreground">
            Your story this week
          </h2>
        </div>
        {res.storyLocked ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>AI weekly story is a Care feature.</span>
            </div>
            <Link
              href="/pricing"
              className="inline-flex h-10 px-4 rounded-full bg-primary text-white text-sm font-semibold items-center"
            >
              See plans
            </Link>
          </div>
        ) : res.story ? (
          <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
            {res.story}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Couldn&apos;t generate the story right now. Try again in a moment —
            your numbers are still below.
          </p>
        )}
      </section>

      {/* Highlights */}
      {res.highlights.length > 0 && (
        <section className="rounded-3xl border border-emerald-300/40 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800/40 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
            <h2 className="font-heading text-base font-bold text-emerald-900 dark:text-emerald-100">
              Wins
            </h2>
          </div>
          <ul className="space-y-1.5 text-sm text-emerald-900/90 dark:text-emerald-100/90">
            {res.highlights.map((h, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden>✨</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Suggestions */}
      {res.suggestions.length > 0 && (
        <section className="rounded-3xl border border-amber-300/40 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800/40 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-300" />
            <h2 className="font-heading text-base font-bold text-amber-900 dark:text-amber-100">
              For next week
            </h2>
          </div>
          <ul className="space-y-1.5 text-sm text-amber-900/90 dark:text-amber-100/90">
            {res.suggestions.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden>→</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Top symptoms */}
      {res.topSymptoms.length > 0 && (
        <section className="rounded-3xl border border-border bg-card p-5 space-y-3">
          <h2 className="font-heading text-base font-bold text-foreground">
            Symptoms tracked
          </h2>
          <ul className="space-y-2">
            {res.topSymptoms.map((s, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 px-3 py-2"
              >
                <span className="text-sm capitalize">{s.name}</span>
                <span className="text-xs font-semibold text-primary">
                  {s.count} {s.count === 1 ? "day" : "days"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Mood spread */}
      {Object.keys(res.moodSpread).length > 0 && (
        <section className="rounded-3xl border border-border bg-card p-5 space-y-3">
          <h2 className="font-heading text-base font-bold text-foreground">
            Mood pattern
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(res.moodSpread)
              .sort((a, b) => b[1] - a[1])
              .map(([mood, count]) => (
                <span
                  key={mood}
                  className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 px-3 py-1 text-xs text-rose-900 dark:text-rose-100"
                >
                  <span>{mood}</span>
                  <span className="font-bold">{count}</span>
                </span>
              ))}
          </div>
        </section>
      )}

      <p className="pt-4 text-[11px] text-muted-foreground text-center">
        This summary is informational, not medical advice. For ongoing or
        worsening symptoms, consult a qualified doctor.
      </p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "primary" | "sky" | "emerald" | "rose";
}) {
  const toneClass = {
    primary: "bg-primary/10 text-primary",
    sky: "bg-sky-100 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300",
    emerald:
      "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300",
    rose:
      "bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300",
  }[tone];
  return (
    <div className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-2">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${toneClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
          {label}
        </p>
        <p className="font-heading text-xl text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}
