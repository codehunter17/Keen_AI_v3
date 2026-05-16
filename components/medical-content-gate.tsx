"use client";

// One-time consent gate for the medical conditions library. Stored in
// localStorage — fine for v1, since the content itself is generic
// reference material (not PHI). If the user clears storage they re-consent.
//
// Renders a full-screen modal on first visit. After "I understand", a
// compact sticky banner stays at the top of every conditions page.

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "nutrimama.medicalContent.consentedAt";

export function MedicalContentGate({ children }: { children: React.ReactNode }) {
  // Start in a loading state so SSR HTML doesn't flash either way.
  const [status, setStatus] = useState<"loading" | "needs-consent" | "ok">(
    "loading",
  );

  useEffect(() => {
    try {
      const ts = window.localStorage.getItem(STORAGE_KEY);
      if (ts) {
        setStatus("ok");
      } else {
        setStatus("needs-consent");
      }
    } catch {
      // Storage blocked — show the gate every time but allow dismissal.
      setStatus("needs-consent");
    }
  }, []);

  const handleAccept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      // ignore — user can still proceed for this session
    }
    setStatus("ok");
  };

  if (status === "loading") {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  if (status === "needs-consent") {
    return (
      <div className="fixed inset-0 z-[70] bg-foreground/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6">
        <div
          role="dialog"
          aria-labelledby="medgate-title"
          className="w-full sm:max-w-lg bg-card border-t sm:border border-border sm:rounded-3xl shadow-2xl p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-6 space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95"
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl" aria-hidden>🩺</div>
            <h2
              id="medgate-title"
              className="font-heading text-xl font-bold text-foreground"
            >
              Before you read on
            </h2>
          </div>
          <div className="space-y-3 text-sm text-foreground/85 leading-relaxed">
            <p>
              The remedies library has detailed information on 30 women&apos;s
              health conditions — including home remedies, Ayurvedic herbs with
              dosages, and modern medicines with brand names.
            </p>
            <p>
              <strong className="text-foreground">
                This is informational only — not medical advice.
              </strong>{" "}
              NutriMama does not prescribe medication. Always consult a
              qualified doctor or registered Vaidya before starting any
              treatment, especially during pregnancy or breastfeeding.
            </p>
            <p className="text-xs text-muted-foreground">
              By continuing you confirm you understand this and accept the{" "}
              <Link
                href="/legal/terms"
                className="underline hover:text-foreground"
                target="_blank"
              >
                Terms
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="button"
              onClick={handleAccept}
              className="h-12 px-6 rounded-full bg-primary text-white font-semibold hover:opacity-90 transition flex-1"
            >
              I understand — continue
            </button>
            <Link
              href="/dashboard"
              className="h-12 px-6 rounded-full border border-border text-foreground font-semibold inline-flex items-center justify-center hover:bg-muted transition"
            >
              Not now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function MedicalDisclaimerBanner() {
  return (
    <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 px-4 py-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
      <span className="text-base shrink-0" aria-hidden>⚠️</span>
      <p className="leading-relaxed">
        Informational only — not medical advice. NutriMama does not prescribe.
        Always consult a qualified doctor or Vaidya, especially during
        pregnancy. In an emergency, call <strong>108</strong>.
      </p>
    </div>
  );
}
