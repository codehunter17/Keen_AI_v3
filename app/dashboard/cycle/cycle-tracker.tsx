"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logCycle, deleteCycleEntry } from "@/lib/actions/cycle";
import {
  format,
  formatDistanceToNow,
  differenceInCalendarDays,
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  getDay,
} from "date-fns";
import { LiveCycleRing } from "@/components/live-cycle-ring";
import { FertilityPhaseCard } from "@/components/fertility-phase-card";
import { IntimacyToggle } from "@/components/intimacy-toggle";
import { cn } from "@/lib/utils";

type CycleTab = "today" | "calendar" | "analysis";

interface CycleEntry {
  id: string;
  startDate: string;
  endDate: string | null;
  flow: string | null;
  pain: number | null;
  symptoms: string[];
  notes: string | null;
}

interface Prediction {
  averageLengthDays: number | null;
  averagePeriodDays: number | null;
  lastStart: string | null;
  nextPredictedStart: string | null;
  ovulationDate: string | null;
  fertileWindowStart: string | null;
  fertileWindowEnd: string | null;
  confidence: "low" | "medium" | "high";
}

const FLOWS = ["LIGHT", "MEDIUM", "HEAVY", "SPOTTING"] as const;
const COMMON_SYMPTOMS = [
  "cramps",
  "bloating",
  "headache",
  "mood swings",
  "fatigue",
  "acne",
  "tender breasts",
  "back pain",
];

export function CycleTracker({
  history,
  prediction,
  intimacyLoggedToday = false,
}: {
  history: CycleEntry[];
  prediction: Prediction;
  intimacyLoggedToday?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showLog, setShowLog] = useState(false);
  const [tab, setTab] = useState<CycleTab>("today");

  // Pre-compute cycle-level analytics for the Analysis tab.
  const analysis = useMemo(() => {
    const lengths: number[] = [];
    const periodDays: number[] = [];
    for (let i = 1; i < history.length; i++) {
      const a = new Date(history[i - 1].startDate);
      const b = new Date(history[i].startDate);
      lengths.push(Math.abs(differenceInCalendarDays(a, b)));
    }
    for (const h of history) {
      if (h.endDate) {
        periodDays.push(
          Math.max(1, differenceInCalendarDays(new Date(h.endDate), new Date(h.startDate)) + 1),
        );
      }
    }
    const symptomCount: Record<string, number> = {};
    for (const h of history) {
      for (const s of h.symptoms ?? []) {
        symptomCount[s] = (symptomCount[s] ?? 0) + 1;
      }
    }
    const topSymptoms = Object.entries(symptomCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const avgLen = lengths.length
      ? +(lengths.reduce((s, n) => s + n, 0) / lengths.length).toFixed(1)
      : null;
    const avgPeriod = periodDays.length
      ? +(periodDays.reduce((s, n) => s + n, 0) / periodDays.length).toFixed(1)
      : null;
    const regular = avgLen != null && lengths.every((l) => Math.abs(l - avgLen) <= 4);
    return { avgLen, avgPeriod, topSymptoms, regular, lengths, periodDays };
  }, [history]);

  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [endDate, setEndDate] = useState<string>("");
  const [flow, setFlow] = useState<(typeof FLOWS)[number]>("MEDIUM");
  const [pain, setPain] = useState<number>(3);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>("");

  const submit = () => {
    startTransition(async () => {
      await logCycle({
        startDate,
        endDate: endDate || undefined,
        flow,
        pain,
        symptoms,
        notes: notes || undefined,
      });
      setShowLog(false);
      router.refresh();
    });
  };

  const remove = (id: string) => {
    startTransition(async () => {
      await deleteCycleEntry(id);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-4xl mx-auto">
      <header>
        <h1 className="font-heading text-3xl text-primary">Cycle</h1>
        <p className="text-sm text-muted-foreground">
          Track your period, spot patterns, and prepare for what&apos;s next.
        </p>
      </header>

      {/* ── Tab bar — Today / Calendar / Analysis ───────────────────── */}
      <div
        role="tablist"
        aria-label="Cycle view"
        className="grid grid-cols-3 gap-2 p-1 bg-muted/40 rounded-2xl"
      >
        {([
          { id: "today" as const, label: "Today", emoji: "📍" },
          { id: "calendar" as const, label: "Calendar", emoji: "📆" },
          { id: "analysis" as const, label: "Analysis", emoji: "📊" },
        ]).map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "h-11 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5",
              tab === t.id
                ? "bg-primary text-white shadow-sm"
                : "text-foreground hover:bg-muted",
            )}
          >
            <span aria-hidden>{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Live cycle ring — large, animated, interactive. Shows the user
          where she is in her cycle at a glance. Compute today's cycle day
          from the most-recent period start in history. */}
      {tab === "today" && (() => {
        const lastStart = prediction.lastStart
          ? new Date(prediction.lastStart)
          : history[0]?.startDate
            ? new Date(history[0].startDate)
            : null;
        const cycleDayOuter = lastStart
          ? Math.max(1, differenceInCalendarDays(new Date(), lastStart) + 1)
          : null;
        return <>
      <section className="rounded-3xl bg-card border border-border lift p-6 sm:p-8 pb-12">
        {(() => {
          const lastStart = prediction.lastStart
            ? new Date(prediction.lastStart)
            : history[0]?.startDate
              ? new Date(history[0].startDate)
              : null;
          const cycleDay = lastStart
            ? Math.max(1, differenceInCalendarDays(new Date(), lastStart) + 1)
            : null;
          const nextStart = prediction.nextPredictedStart
            ? new Date(prediction.nextPredictedStart)
            : null;
          const nextPeriodInDays = nextStart
            ? Math.max(0, differenceInCalendarDays(nextStart, new Date()))
            : null;
          return (
            <LiveCycleRing
              cycleDay={cycleDay}
              averageLength={prediction.averageLengthDays ?? 28}
              nextPeriodInDays={nextPeriodInDays}
            />
          );
        })()}
      </section>

      {/* 4-phase fertility view — Menstrual / Follicular / Ovulatory /
          Luteal. Renders the phase-specific nutrition + activity guidance.
          Shows a tasteful empty state if there's no period start yet. */}
      <FertilityPhaseCard
        cycleDay={cycleDayOuter}
        averageLength={prediction.averageLengthDays ?? 28}
      />

      {/* Discreet intercourse log — collapsed by default, privacy-first */}
      <IntimacyToggle initialLogged={intimacyLoggedToday} />

      {/* Prediction hero */}
      <section className="rounded-2xl surface-premium lift-strong p-6">
        <div className="flex items-baseline justify-between mb-3">
          <span className="chip border-primary/30 text-primary">
            {prediction.confidence === "high"
              ? "Strong pattern"
              : prediction.confidence === "medium"
                ? "Building pattern"
                : "Need more data"}
          </span>
          {prediction.averageLengthDays && (
            <span className="text-xs text-muted-foreground">
              avg {prediction.averageLengthDays}-day cycle · period {prediction.averagePeriodDays} days
            </span>
          )}
        </div>

        {prediction.nextPredictedStart ? (
          <>
            <p className="font-heading text-2xl sm:text-3xl">
              Next period in{" "}
              <span className="text-primary">
                {formatDistanceToNow(new Date(prediction.nextPredictedStart))}
              </span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              ~ {format(new Date(prediction.nextPredictedStart), "EEE, dd MMM")}
            </p>
            {prediction.ovulationDate && (
              <p className="text-sm mt-3">
                Fertile window:{" "}
                <strong>
                  {format(new Date(prediction.fertileWindowStart!), "dd MMM")} –{" "}
                  {format(new Date(prediction.fertileWindowEnd!), "dd MMM")}
                </strong>{" "}
                · ovulation around{" "}
                <strong>{format(new Date(prediction.ovulationDate), "dd MMM")}</strong>
              </p>
            )}
          </>
        ) : (
          <p className="text-sm">
            Log your last period to start seeing predictions. After 2–3 cycles
            we&apos;ll detect your pattern.
          </p>
        )}

        <div className="mt-5">
          <Button onClick={() => setShowLog((s) => !s)}>
            {showLog ? "Cancel" : "Log a period"}
          </Button>
        </div>
      </section>

      {/* Logger */}
      {showLog && (
        <section className="rounded-2xl bg-card lift p-6 space-y-4">
          <h2 className="font-heading text-xl text-primary">Log this period</h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Start date</label>
              <input
                type="date"
                value={startDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-input/40 px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">End date (optional)</label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-input/40 px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Flow</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {FLOWS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFlow(f)}
                  className={`chip cursor-pointer ${flow === f ? "chip-active" : ""}`}
                >
                  {f.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Pain ({pain}/10)
            </label>
            <input
              type="range"
              min={0}
              max={10}
              value={pain}
              onChange={(e) => setPain(parseInt(e.target.value))}
              className="mt-1 w-full accent-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Symptoms</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {COMMON_SYMPTOMS.map((sym) => {
                const active = symptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() =>
                      setSymptoms((cur) =>
                        active ? cur.filter((s) => s !== sym) : [...cur, sym],
                      )
                    }
                    className={`chip cursor-pointer ${active ? "chip-secondary-active" : ""}`}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-border bg-input/40 px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              placeholder="Anything else to remember about this cycle?"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowLog(false)} disabled={pending}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </Button>
          </div>
        </section>
      )}
        </>;
      })()}

      {/* ── Calendar tab — 8-week mini grid of past + predicted periods ── */}
      {tab === "calendar" && (
        <CycleCalendar
          history={history}
          prediction={prediction}
        />
      )}

      {/* ── Analysis tab: averages + symptom frequency + history ─────── */}
      {tab === "analysis" && (
        <>
          <section className="rounded-3xl bg-card border border-border p-5 sm:p-6 space-y-4">
            <h2 className="font-heading text-lg text-foreground">Your patterns</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-muted/40 p-4">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Avg cycle length
                </p>
                <p className="font-heading text-2xl text-foreground mt-1">
                  {analysis.avgLen ? `${analysis.avgLen} days` : "—"}
                </p>
              </div>
              <div className="rounded-2xl bg-muted/40 p-4">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Avg period
                </p>
                <p className="font-heading text-2xl text-foreground mt-1">
                  {analysis.avgPeriod ? `${analysis.avgPeriod} days` : "—"}
                </p>
              </div>
              <div className="rounded-2xl bg-muted/40 p-4 col-span-2">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Regularity
                </p>
                <p className="text-sm text-foreground mt-1">
                  {analysis.lengths.length === 0
                    ? "Log 2+ cycles to see regularity."
                    : analysis.regular
                      ? "Your cycles are regular (within ±4 days)."
                      : "Your cycles vary by more than 4 days. Worth a chat with your doctor if this continues."}
                </p>
              </div>
            </div>
          </section>

          {analysis.topSymptoms.length > 0 && (
            <section className="rounded-3xl bg-card border border-border p-5 sm:p-6 space-y-3">
              <h2 className="font-heading text-lg text-foreground">Most frequent symptoms</h2>
              <ul className="space-y-2">
                {analysis.topSymptoms.map(([name, count]) => (
                  <li
                    key={name}
                    className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 px-3 py-2"
                  >
                    <span className="text-sm capitalize">{name}</span>
                    <span className="text-xs font-semibold text-primary">
                      {count} {count === 1 ? "cycle" : "cycles"}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

      {/* History */}
      <section className="rounded-2xl bg-card lift p-6">
        <h2 className="font-heading text-xl text-primary mb-3">
          Recent cycles
        </h2>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No cycles logged yet. Tap <em>Log a period</em> above to start.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {history.map((h) => (
              <li
                key={h.id}
                className="flex items-start justify-between py-3 gap-3"
              >
                <div>
                  <p className="font-medium">
                    {format(new Date(h.startDate), "dd MMM yyyy")}
                    {h.endDate && (
                      <>
                        {" "}
                        →{" "}
                        <span className="text-muted-foreground">
                          {format(new Date(h.endDate), "dd MMM")}
                        </span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {h.flow ? `${h.flow.toLowerCase()} flow` : "no flow logged"}
                    {h.pain != null && ` · pain ${h.pain}/10`}
                  </p>
                  {h.symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {h.symptoms.map((s) => (
                        <span key={s} className="chip text-[10px] py-0.5">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {h.notes && (
                    <p className="text-xs italic text-muted-foreground mt-1">
                      &ldquo;{h.notes}&rdquo;
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(h.id)}
                  disabled={pending}
                  className="text-xs text-destructive hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
        </>
      )}
    </div>
  );
}

// ── Calendar mini-grid component ───────────────────────────────────────
// Two-month vertical layout. Each cell is a day. Past period days are
// rose-tinted; predicted period days are dashed; ovulation is highlighted.
function CycleCalendar({
  history,
  prediction,
}: {
  history: CycleEntry[];
  prediction: Prediction;
}) {
  // Build a set of "period day" ISO strings from history.
  const periodDays = new Set<string>();
  for (const h of history) {
    const start = new Date(h.startDate);
    const end = h.endDate ? new Date(h.endDate) : addDays(start, 4);
    for (const d of eachDayOfInterval({ start, end })) {
      periodDays.add(d.toISOString().slice(0, 10));
    }
  }
  // Predicted next period range.
  const predictedDays = new Set<string>();
  if (prediction.nextPredictedStart) {
    const ps = new Date(prediction.nextPredictedStart);
    const len = prediction.averagePeriodDays ?? 5;
    for (const d of eachDayOfInterval({ start: ps, end: addDays(ps, len - 1) })) {
      predictedDays.add(d.toISOString().slice(0, 10));
    }
  }
  const ovulationKey = prediction.ovulationDate
    ? new Date(prediction.ovulationDate).toISOString().slice(0, 10)
    : null;

  // Render this month + next month.
  const today = new Date();
  const months = [today, addDays(endOfMonth(today), 1)];
  const weekdayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <section className="rounded-3xl bg-card border border-border p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg text-foreground">Calendar</h2>
        <Legend />
      </div>
      {months.map((m, mi) => {
        const monthStart = startOfMonth(m);
        const monthEnd = endOfMonth(m);
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
        const offset = getDay(monthStart); // 0 = Sun
        return (
          <div key={mi}>
            <p className="text-sm font-semibold text-foreground mb-2">
              {format(m, "MMMM yyyy")}
            </p>
            <div className="grid grid-cols-7 gap-1">
              {weekdayLabels.map((w, i) => (
                <div
                  key={i}
                  className="text-[10px] text-center text-muted-foreground font-semibold py-1"
                >
                  {w}
                </div>
              ))}
              {Array.from({ length: offset }).map((_, i) => (
                <div key={`pad-${i}`} aria-hidden />
              ))}
              {days.map((d) => {
                const key = d.toISOString().slice(0, 10);
                const isToday = isSameDay(d, today);
                const isPeriod = periodDays.has(key);
                const isPredicted = predictedDays.has(key);
                const isOvulation = ovulationKey === key;
                return (
                  <div
                    key={key}
                    aria-label={format(d, "EEEE d MMMM")}
                    className={cn(
                      "aspect-square rounded-lg flex items-center justify-center text-xs font-medium relative",
                      isPeriod
                        ? "bg-rose-200 dark:bg-rose-900/60 text-rose-900 dark:text-rose-100"
                        : isPredicted
                          ? "border border-dashed border-rose-400 dark:border-rose-700 text-rose-700 dark:text-rose-300"
                          : isOvulation
                            ? "bg-emerald-200 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-100"
                            : "text-foreground/70",
                      isToday && "ring-2 ring-primary ring-offset-1 ring-offset-card",
                    )}
                  >
                    {format(d, "d")}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
      <span className="inline-flex items-center gap-1">
        <span className="w-3 h-3 rounded bg-rose-200 dark:bg-rose-900/60" />
        Period
      </span>
      <span className="inline-flex items-center gap-1">
        <span className="w-3 h-3 rounded border border-dashed border-rose-400" />
        Predicted
      </span>
      <span className="inline-flex items-center gap-1">
        <span className="w-3 h-3 rounded bg-emerald-200 dark:bg-emerald-900/60" />
        Ovulation
      </span>
    </div>
  );
}
