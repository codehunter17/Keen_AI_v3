"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { submitPcosScreen } from "@/lib/actions/cycle";

const QUESTIONS = [
  { key: "irregularPeriods", q: "Are your periods irregular (cycles longer than 35 days, or skipping months)?" },
  { key: "excessHair", q: "Have you noticed excess hair growth (chin, upper lip, abdomen, back)?" },
  { key: "acne", q: "Do you have persistent adult acne, especially along the jaw or chin?" },
  { key: "weightGain", q: "Have you gained significant weight, especially around the abdomen, that's hard to lose?" },
  { key: "hairLossOnHead", q: "Have you noticed hair thinning or loss on your head?" },
  { key: "difficultyConceiving", q: "If trying to conceive, has it taken longer than expected?" },
  { key: "fatigue", q: "Are you experiencing persistent fatigue?" },
  { key: "moodChanges", q: "Have you experienced mood swings, anxiety, or low mood lately?" },
  { key: "familyHistory", q: "Does anyone in your immediate family have PCOS or diabetes?" },
] as const;

type Key = (typeof QUESTIONS)[number]["key"];

export function PcosScreenClient() {
  const [pending, startTransition] = useTransition();
  const [answers, setAnswers] = useState<Record<Key, boolean | null>>(
    Object.fromEntries(QUESTIONS.map((q) => [q.key, null])) as Record<Key, boolean | null>,
  );
  const [result, setResult] = useState<null | {
    trueCount: number;
    risk: "LOW" | "MODERATE" | "HIGH";
    insight: string;
  }>(null);

  const allAnswered = QUESTIONS.every((q) => answers[q.key] !== null);

  const submit = () =>
    startTransition(async () => {
      const payload = Object.fromEntries(
        QUESTIONS.map((q) => [q.key, answers[q.key] ?? false]),
      );
      const res = await submitPcosScreen(payload as Record<Key, boolean>);
      setResult(res);
    });

  if (result) {
    const colorClass =
      result.risk === "HIGH"
        ? "border-destructive bg-destructive/10"
        : result.risk === "MODERATE"
          ? "border-secondary bg-secondary/20"
          : "border-primary bg-primary/10";
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className={`rounded-2xl border-2 ${colorClass} lift p-6`}>
          <span className="chip">{result.risk} risk</span>
          <h1 className="font-heading text-2xl text-primary mt-2">
            Your screen result
          </h1>
          <p className="mt-2 text-sm">
            {result.trueCount} of 9 indicators flagged.
          </p>
          <p className="mt-4">{result.insight}</p>
          <p className="mt-4 text-xs text-muted-foreground">
            This is a screening tool, not a diagnosis. PCOS requires a clinical
            evaluation including ultrasound and hormone panel.
          </p>
        </div>
        <div className="mt-4 flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setResult(null)}>
            Take it again
          </Button>
          <a
            href="/dashboard/cycle"
            className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm"
          >
            Track my cycle
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <header className="mb-5">
        <h1 className="font-heading text-3xl text-primary">PCOS screen</h1>
        <p className="text-sm text-muted-foreground">
          Nine quick questions. Takes about 60 seconds. Results are private.
        </p>
      </header>

      <div className="rounded-2xl bg-card lift p-6 space-y-4">
        {QUESTIONS.map((q, i) => (
          <div key={q.key}>
            <p className="text-sm font-medium">
              {i + 1}. {q.q}
            </p>
            <div className="mt-1.5 flex gap-2">
              {[
                { label: "Yes", v: true },
                { label: "No", v: false },
              ].map((opt) => {
                const active = answers[q.key] === opt.v;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() =>
                      setAnswers((a) => ({ ...a, [q.key]: opt.v }))
                    }
                    className={`chip cursor-pointer ${active ? "chip-active" : ""}`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={submit} disabled={!allAnswered || pending}>
          {pending ? "Analyzing…" : "Get my result"}
        </Button>
      </div>

      <p className="mt-3 text-xs text-muted-foreground text-center">
        Not medical advice. For a diagnosis, consult a gynecologist.
      </p>
    </div>
  );
}
