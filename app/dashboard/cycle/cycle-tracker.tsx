"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logCycle, deleteCycleEntry } from "@/lib/actions/cycle";
import { format, formatDistanceToNow } from "date-fns";

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
}: {
  history: CycleEntry[];
  prediction: Prediction;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showLog, setShowLog] = useState(false);

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
    </div>
  );
}
