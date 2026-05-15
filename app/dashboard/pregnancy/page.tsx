// Pregnancy week-by-week tracker — ports the keen-ai view but wired
// to v3's User model + the canonical 40-week clinical dataset.
//
// Server component: reads session + user, computes current week,
// looks up the week data, renders the full clinical brief.

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  getPregnancyInfo,
  getANCSchedule,
  type FetalWeek,
} from "@/lib/fetal-weeks";
import { CitationBadge, CitationGroup, SourceFooter } from "@/components/citation-badge";
import { Ruler, Sparkles, ClipboardList, AlertTriangle, MessageSquare, Calendar } from "lucide-react";

export const metadata = { title: "Pregnancy · NutriMama" };

function trimesterFor(week: number): { num: 1 | 2 | 3; label: string } {
  if (week <= 13) return { num: 1, label: "First Trimester" };
  if (week <= 27) return { num: 2, label: "Second Trimester" };
  return { num: 3, label: "Third Trimester" };
}

function trimesterTheme(t: 1 | 2 | 3) {
  if (t === 1) return { from: "from-purple-100", to: "to-purple-50", accent: "text-purple-700", accentBg: "bg-purple-100" };
  if (t === 2) return { from: "from-emerald-100", to: "to-emerald-50", accent: "text-emerald-700", accentBg: "bg-emerald-100" };
  return { from: "from-rose-100", to: "to-rose-50", accent: "text-rose-700", accentBg: "bg-rose-100" };
}

export default async function PregnancyPage() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) redirect("/auth/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: s.user.id },
    select: {
      pregnancyStage: true,
      pregnancyWeek: true,
      dueDate: true,
      lifeStage: true,
    },
  });

  if (!user) redirect("/dashboard");

  // Gate: only PREGNANT users see this view. Others get nudged to update.
  if (user.pregnancyStage !== "PREGNANT") {
    return <NotPregnantState lifeStage={user.lifeStage} />;
  }

  const week = Math.max(1, Math.min(40, user.pregnancyWeek ?? 1));
  const data = getPregnancyInfo(week);
  const tri = trimesterFor(week);
  const theme = trimesterTheme(tri.num);
  const anc = getANCSchedule();

  // Pick the contact whose timing is nearest the current week
  const ancUpcoming = anc.schedule.find(
    (c) => parseWeekFromTiming(c.timing) >= week,
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Hero — week + trimester + due date */}
      <section
        className={`rounded-3xl bg-gradient-to-br ${theme.from} ${theme.to} p-7 sm:p-9 relative overflow-hidden`}
      >
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/30 blur-3xl" />
        <div className="relative text-center">
          <div className="text-5xl mb-2" aria-hidden>🤰</div>
          <p className={`font-heading text-6xl sm:text-7xl ${theme.accent} tracking-tight`}>
            {week}
          </p>
          <p className={`text-sm font-semibold ${theme.accent} uppercase tracking-widest mt-1`}>
            weeks pregnant
          </p>
          <span
            className={`inline-block mt-4 rounded-full ${theme.accentBg} ${theme.accent} px-4 py-1.5 text-xs font-semibold`}
          >
            {tri.label} · trimester {tri.num}
          </span>
          {user.dueDate && (
            <p className="text-sm text-foreground/80 mt-3">
              📅 Due date:{" "}
              <strong>
                {new Date(user.dueDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </strong>
            </p>
          )}
          <div className="mt-4 flex justify-center">
            <CitationBadge source="WHO_ANC_2016" />
          </div>
        </div>
      </section>

      {/* Baby size card */}
      <section className="rounded-3xl bg-card border border-border p-5 sm:p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
          <Ruler className="w-6 h-6 text-amber-700 dark:text-amber-300" />
        </div>
        <div className="min-w-0">
          <p className="font-heading text-lg sm:text-xl text-foreground">
            Baby is about the size of —{" "}
            <span className="text-primary">like a {data.babySize.comparison}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Length: ~{data.babySize.length_cm} cm · Weight: ~{data.babySize.weight_g}g
          </p>
        </div>
      </section>

      {/* Development paragraph */}
      <section className="rounded-3xl bg-card border border-border p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-foreground">Development</h2>
        </div>
        <p className="text-sm text-foreground/85 leading-relaxed">
          {data.development}
        </p>
        <div className="mt-3">
          <CitationGroup raw={data.source} />
        </div>
      </section>

      {/* What to expect this week */}
      <section className="rounded-3xl bg-card border border-border p-5 sm:p-6">
        <h2 className="font-heading text-lg text-foreground mb-3">
          🌿 What to expect this week
        </h2>
        <ul className="space-y-2 text-sm text-foreground/85">
          {data.motherSymptoms.map((s, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Nutrition focus — key nutrients + citations */}
      <section className="rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 p-5 sm:p-7">
        <h2 className="font-heading text-lg sm:text-xl text-emerald-900 dark:text-emerald-100 mb-1">
          🥗 {data.nutrition.focus} — Week {week}
        </h2>

        <div className="mt-4 space-y-3">
          {data.nutrition.keyNutrients.map((n) => (
            <div
              key={n.name}
              className="rounded-2xl bg-white dark:bg-card border border-emerald-200 dark:border-emerald-900 p-4"
            >
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <p className="font-semibold text-foreground">{n.name}</p>
                <span className="text-[10px] uppercase tracking-widest font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full px-2.5 py-1">
                  {n.dose}
                </span>
              </div>
              <p className="text-xs text-foreground/80 mt-1.5">
                🍽 <span className="font-medium">Sources:</span> {n.foods}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug">
                ℹ️ {n.reason}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 px-4 py-3 text-sm text-emerald-900 dark:text-emerald-100">
          💡 {data.nutrition.tip}
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <CitationBadge source="ICMR_RDA_2020" />
          <CitationBadge source="FOGSI_2023" />
        </div>
      </section>

      {/* ANC visit prompt — surfaces the next clinically-due contact */}
      {ancUpcoming && (
        <section className="rounded-3xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <ClipboardList className="w-5 h-5 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h2 className="font-heading text-lg text-amber-900 dark:text-amber-100">
                ANC Visit · Contact {ancUpcoming.contact}
              </h2>
              <p className="text-sm text-foreground/85 mt-2 leading-relaxed">
                <strong>{ancUpcoming.timing}</strong> — {ancUpcoming.key}
              </p>
              {data.antenatalCare && (
                <p className="text-xs text-muted-foreground mt-2">
                  This week specifically: {data.antenatalCare}
                </p>
              )}
              <div className="mt-3">
                <CitationBadge source="WHO_ANC_2016" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Warning signs — expandable */}
      <details className="rounded-3xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 p-5 group">
        <summary className="flex items-center gap-2 cursor-pointer list-none">
          <AlertTriangle className="w-5 h-5 text-rose-700 dark:text-rose-300" />
          <span className="font-heading text-base text-rose-900 dark:text-rose-100">
            Warning signs this week — know these
          </span>
          <span className="ml-auto text-rose-600 group-open:rotate-180 transition-transform">▾</span>
        </summary>
        <ul className="mt-3 space-y-2 text-sm text-foreground/85">
          {data.warningSignsThisWeek.map((w, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-rose-500 mt-0.5">●</span>
              <span>{w}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-rose-700 dark:text-rose-300 font-medium">
          Any of these → call your OB-GYN today, or dial <strong>102</strong> / <strong>112</strong>.
        </p>
      </details>

      {/* ANC full schedule — expandable */}
      <details className="rounded-3xl bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900 p-5 group">
        <summary className="flex items-center gap-2 cursor-pointer list-none">
          <Calendar className="w-5 h-5 text-violet-700 dark:text-violet-300" />
          <span className="font-heading text-base text-violet-900 dark:text-violet-100">
            ANC Visit Schedule (WHO — 8 Contacts)
          </span>
          <span className="ml-auto text-violet-600 group-open:rotate-180 transition-transform">▾</span>
        </summary>
        <ol className="mt-3 space-y-3 text-sm text-foreground/85">
          {anc.schedule.map((c) => (
            <li key={c.contact} className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-violet-200 dark:bg-violet-900/60 text-violet-800 dark:text-violet-200 flex items-center justify-center text-xs font-bold shrink-0">
                {c.contact}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-foreground">{c.timing}</p>
                <p className="text-xs text-foreground/75 mt-0.5">{c.key}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-muted-foreground">
          Source: {anc.source}
        </p>
      </details>

      {/* AI chat CTA */}
      <Link
        href="/dashboard/chat"
        className="block rounded-3xl bg-primary text-primary-foreground py-4 px-6 text-center font-semibold shadow-lg hover:scale-[1.01] transition active:scale-95"
      >
        <MessageSquare className="w-4 h-4 inline-block mr-2 -mt-0.5" />
        Talk to NutriMama AI
      </Link>

      {/* Source footer */}
      <SourceFooter
        sources={["FOGSI_2023", "ICMR_RDA_2020", "WHO_ANC_2016", "ACOG_2020", "MOORE_PERSAUD_10"]}
      />
    </div>
  );
}

function NotPregnantState({ lifeStage }: { lifeStage: string | null }) {
  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <div className="rounded-3xl bg-card border border-dashed border-border p-8">
        <div className="text-5xl mb-3" aria-hidden>🌱</div>
        <h1 className="font-heading text-2xl text-primary mb-2">
          Pregnancy tracking
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {lifeStage === "TRYING_TO_CONCEIVE"
            ? "When you confirm a pregnancy, switch your tracking mode in Settings and we'll unlock the full 40-week clinical guide here."
            : "You're not currently tracking a pregnancy. If that changes, switch your tracking mode in Settings."}
        </p>
        <Link
          href="/dashboard/settings"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:scale-[1.02] transition"
        >
          Open Settings →
        </Link>
      </div>
    </div>
  );
}

// Helper: turn "< 12 weeks", "20 weeks", "26 weeks" into a numeric upper bound
function parseWeekFromTiming(timing: string): number {
  const m = timing.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 999;
}
