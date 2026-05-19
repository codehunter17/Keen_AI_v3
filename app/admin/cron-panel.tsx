"use client";

import { useState } from "react";
import { Zap, CheckCircle2, XCircle } from "lucide-react";

const JOBS: Array<{ key: string; label: string; hint: string }> = [
  { key: "observe", label: "Observe", hint: "mine anonymized user signals" },
  { key: "synthesize", label: "Synthesize", hint: "cluster signals into opportunities (LLM)" },
  { key: "propose", label: "Propose", hint: "draft proposals from open opportunities (LLM)" },
  { key: "distribute", label: "Distribute", hint: "growth + media opportunities (LLM)" },
  { key: "telemetry-drain", label: "Telemetry drain", hint: "process Redis stream + flag abuse" },
  { key: "optimize", label: "Optimize", hint: "self-optimization from telemetry" },
  { key: "media-dispatch", label: "Media dispatch", hint: "ship approved media to YouTube / Instagram" },
  { key: "scholar-harvest", label: "Scholar harvest", hint: "PubMed harvest into trust-weighted memory" },
  { key: "scholar-conflict", label: "Scholar conflict scan", hint: "find contradicting findings" },
  { key: "scholar-prune", label: "Scholar prune", hint: "archive uncited findings > 30d" },
];

type LogLine = {
  ts: string;
  job: string;
  ok: boolean;
  body: string;
};

export function CronPanel() {
  const [log, setLog] = useState<LogLine[]>([]);
  const [running, setRunning] = useState<string | null>(null);
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);

  const trigger = async (job: string) => {
    if (!secret) {
      setError("Paste your CRON_SECRET above first.");
      return;
    }
    setError(null);
    setRunning(job);
    try {
      const res = await fetch(`/api/keen/cron/${job}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${secret}` },
        cache: "no-store",
      });
      const text = await res.text();
      let pretty = text;
      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        // not JSON — leave raw
      }
      setLog((prev) =>
        [
          {
            ts: new Date().toISOString().slice(11, 19),
            job,
            ok: res.ok,
            body: pretty,
          },
          ...prev,
        ].slice(0, 20),
      );
    } catch (err) {
      setLog((prev) => [
        {
          ts: new Date().toISOString().slice(11, 19),
          job,
          ok: false,
          body: err instanceof Error ? err.message : "fetch failed",
        },
        ...prev,
      ]);
    } finally {
      setRunning(null);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Manual cron trigger
        </h2>
        <span className="text-[10px] text-muted-foreground font-mono">
          stored in-memory, never sent to a third party
        </span>
      </div>

      <input
        type="password"
        placeholder="paste CRON_SECRET to enable buttons"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        className="w-full px-4 py-2 rounded-xl border border-border bg-card text-sm font-mono"
      />

      {error && <p className="text-xs text-rose-600 font-mono">{error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {JOBS.map((j) => (
          <button
            key={j.key}
            disabled={running === j.key || !secret}
            onClick={() => trigger(j.key)}
            className="text-left border border-border rounded-2xl p-3 bg-card hover:border-primary/40 disabled:opacity-50 transition-colors"
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Zap className="w-3.5 h-3.5 text-primary" />
              {j.label}
              {running === j.key && (
                <span className="ml-auto text-xs text-muted-foreground font-mono">running…</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{j.hint}</div>
          </button>
        ))}
      </div>

      {log.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Recent runs
          </h3>
          <ul className="space-y-2">
            {log.map((entry, i) => (
              <li
                key={i}
                className={`border rounded-2xl p-3 ${
                  entry.ok
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-rose-500/30 bg-rose-500/5"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5">
                    {entry.ok ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <XCircle className="w-3 h-3 text-rose-600" />
                    )}
                    {entry.job}
                  </span>
                  <span className="text-muted-foreground">{entry.ts}</span>
                </div>
                <pre className="text-[11px] font-mono mt-2 whitespace-pre-wrap break-all">
                  {entry.body}
                </pre>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
