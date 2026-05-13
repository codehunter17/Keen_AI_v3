"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

// Shown once on first sign-in. Records consent (caller is responsible for
// persisting acceptance via a server action that writes a ConsentRecord).
export function DisclaimerModal({
  open,
  onAccept,
  onDecline,
}: {
  open: boolean;
  onAccept: () => Promise<void> | void;
  onDecline?: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedMedical, setAcceptedMedical] = useState(false);
  const [allowTraining, setAllowTraining] = useState(false);

  useEffect(() => {
    if (!open) {
      setAcceptedTerms(false);
      setAcceptedMedical(false);
      setAllowTraining(false);
      setBusy(false);
    }
  }, [open]);

  if (!open) return null;

  const canAccept = acceptedTerms && acceptedMedical;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-2xl ring-1 ring-border">
        <h2 className="text-xl font-semibold mb-1">Welcome to NutriMama</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Before you start, a few important things you should know.
        </p>

        <div className="space-y-4 text-sm">
          <div className="rounded-2xl bg-muted/50 p-4">
            <p className="font-medium mb-1">This is not medical advice.</p>
            <p className="text-muted-foreground">
              NutriMama is a wellness companion. Our AI provides general
              information and personalized suggestions, but it is{" "}
              <strong>not</strong> a doctor and cannot diagnose, prescribe, or
              replace professional medical care. Always consult a qualified
              healthcare provider for medical concerns.
            </p>
          </div>

          <div className="rounded-2xl bg-muted/50 p-4">
            <p className="font-medium mb-1">Your data, under your control.</p>
            <p className="text-muted-foreground">
              We follow India&apos;s DPDP Act 2023. Your health data is
              encrypted, never sold, and you can delete it any time from
              Settings → Privacy. Read our{" "}
              <a href="/legal/privacy" className="underline" target="_blank">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="/legal/terms" className="underline" target="_blank">
                Terms
              </a>
              .
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border"
            />
            <span>
              I have read and accept the{" "}
              <a href="/legal/terms" target="_blank" className="underline">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="/legal/privacy" target="_blank" className="underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedMedical}
              onChange={(e) => setAcceptedMedical(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border"
            />
            <span>
              I understand NutriMama is <strong>not a substitute for a doctor</strong>{" "}
              and is for wellness support only.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={allowTraining}
              onChange={(e) => setAllowTraining(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border"
            />
            <span className="text-muted-foreground">
              <strong>(Optional)</strong> Help improve NutriMama by allowing
              anonymized data to train our AI models. You can revoke this any
              time.
            </span>
          </label>
        </div>

        <div className="mt-6 flex gap-2 justify-end">
          {onDecline && (
            <Button variant="ghost" onClick={onDecline} disabled={busy}>
              Cancel
            </Button>
          )}
          <Button
            disabled={!canAccept || busy}
            onClick={async () => {
              setBusy(true);
              try {
                await onAccept();
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Saving…" : "I agree — let's start"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Compact disclaimer pill that appears under every AI-generated message.
export function AiResponseDisclaimer() {
  return (
    <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
      Information from AI, not medical advice. For diagnosis or treatment,
      consult a qualified doctor.
    </p>
  );
}
