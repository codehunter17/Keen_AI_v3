/**
 * Observer — Module 1.
 *
 * Pulls anonymized signals from the host adapter, persists raw rows, then
 * groups them into windowed Observations. Runs on a nightly cron.
 *
 * v0 keeps the summary heuristic and skips LLM calls so the first cron pass
 * is free + deterministic. Module 3 (Synthesizer) is where Claude joins in.
 */

import type { KeenAdapter, Observation, RawSignal, SignalKind } from "../types";

const SIGNAL_KINDS: SignalKind[] = [
  "feature_use",
  "drop_off",
  "chat_query",
  "ai_failure",
  "symptom_log",
  "cycle_log",
  "screening_completed",
  "doctor_visit",
  "outcome_followup",
  "error",
  "custom",
];

export interface ObserveResult {
  signalsCollected: number;
  signalsPersisted: number;
  observationId: string | null;
}

/**
 * Run one observation pass over the [since, until) window.
 *
 * Steps:
 *  1. Ask the host adapter for anonymized signals in the window.
 *  2. Persist each signal as a `keen_signal` row.
 *  3. Build one Observation row that summarizes the window (heuristic v0).
 *  4. Return the IDs so /admin can display the latest pass.
 */
export async function observe(
  adapter: KeenAdapter,
  since: Date,
  until: Date,
): Promise<ObserveResult> {
  const signals = await adapter.collectSignals(since, until);

  const persistedIds: string[] = [];
  for (const sig of signals) {
    const saved = await adapter.saveSignal(sig);
    persistedIds.push(saved.id);
  }

  if (signals.length === 0) {
    return { signalsCollected: 0, signalsPersisted: 0, observationId: null };
  }

  const observation = summarize(signals, persistedIds, since, until);
  const saved = await adapter.saveObservation(observation);

  return {
    signalsCollected: signals.length,
    signalsPersisted: persistedIds.length,
    observationId: saved.id,
  };
}

/** Deterministic v0 summary — counts + top features, no LLM call yet. */
function summarize(
  signals: RawSignal[],
  signalIds: string[],
  windowStart: Date,
  windowEnd: Date,
): Observation {
  const breakdown: Partial<Record<SignalKind, number>> = {};
  for (const kind of SIGNAL_KINDS) breakdown[kind] = 0;
  for (const s of signals) {
    breakdown[s.kind] = (breakdown[s.kind] ?? 0) + 1;
  }

  const tags = new Set<string>();
  for (const s of signals) {
    tags.add(s.kind);
    const featureName =
      typeof s.payload?.feature === "string" ? s.payload.feature : undefined;
    if (featureName) tags.add(featureName);
    const screening =
      typeof s.payload?.screening === "string" ? s.payload.screening : undefined;
    if (screening) tags.add(screening);
  }

  const topKinds = Object.entries(breakdown)
    .filter(([, count]) => (count ?? 0) > 0)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
    .slice(0, 3)
    .map(([k, c]) => `${k}=${c}`)
    .join(", ");

  const uniqueUsers = new Set(signals.map((s) => s.pseudonym)).size;

  const summary =
    `Window ${windowStart.toISOString()} → ${windowEnd.toISOString()}. ` +
    `${signals.length} signals from ${uniqueUsers} unique users. ` +
    `Top kinds: ${topKinds || "none"}.`;

  return {
    windowStart,
    windowEnd,
    summary,
    tags: Array.from(tags),
    signalCount: signals.length,
    signalBreakdown: breakdown,
    confidence: 1, // deterministic heuristic
    sourceSignalIds: signalIds,
  };
}
