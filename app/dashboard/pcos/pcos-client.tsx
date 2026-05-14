"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitPcosScreen } from "@/lib/actions/cycle";
import { isPaywallError, getErrorMessage } from "@/lib/errors";

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
  const [paywall, setPaywall] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const allAnswered = QUESTIONS.every((q) => answers[q.key] !== null);

  const submit = () =>
    startTransition(async () => {
      setError(null);
      setPaywall(null);
      const payload = Object.fromEntries(
        QUESTIONS.map((q) => [q.key, answers[q.key] ?? false]),
      );
      try {
        const res = await submitPcosScreen(payload as Record<Key, boolean>);
        setResult(res);
      } catch (e) {
        // PCOS screening is a Care/Pro feature. Free users see paywall
        // instead of an uncaught exception that breaks the page.
        if (isPaywallError(e)) {
          setPaywall(getErrorMessage(e));
        } else {
          setError(getErrorMessage(e) || "Could not submit your answers. Please try again.");
        }
      }
    });

  if (paywall) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-secondary/5 to-gold/5 p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-2xl text-foreground">
            PCOS screening
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            A 9-question Rotterdam-criteria-based screen with personalised
            insight. It&apos;s a Care/Pro feature — Care from ₹49/mo unlocks
            this plus medical-report analysis, meal plans, and risk prediction.
          </p>
          <Link
            href="/pricing"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:scale-[1.02] transition shadow-lg"
          >
            View plans →
          </Link>
        </div>
      </div>
    );
  }

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

      {error && (
        <div className="mt-3 rounded-xl bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

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
