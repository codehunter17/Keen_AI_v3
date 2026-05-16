"use client";

// Settings row → modal picker. Lets a user change their app language
// after onboarding. Languages are pulled from the central registry so we
// only have to add a new one in one place.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Globe, Check, X, Loader2 } from "lucide-react";
import { LANGUAGES, nativeLabel, type LanguageCode } from "@/lib/languages";
import { setLanguagePreference } from "@/lib/actions/user-prefs";

export function LanguagePicker({
  currentCode,
}: {
  currentCode: string | null | undefined;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [pendingCode, setPendingCode] = useState<LanguageCode | null>(null);

  const select = (code: LanguageCode) => {
    if (code === currentCode) {
      setOpen(false);
      return;
    }
    setPendingCode(code);
    startTransition(async () => {
      const res = await setLanguagePreference(code);
      setPendingCode(null);
      if (res.ok) {
        setOpen(false);
        router.refresh();
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/40 transition"
        aria-haspopup="dialog"
      >
        <span
          className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center"
          aria-hidden
        >
          <Globe className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
        </span>
        <span className="flex-1 text-left text-sm font-medium text-foreground">
          Language
        </span>
        <span className="text-sm text-foreground/70 truncate">
          {nativeLabel(currentCode)}
        </span>
        <svg
          className="w-4 h-4 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] bg-foreground/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div
            role="dialog"
            aria-labelledby="lang-title"
            className="w-full sm:max-w-md bg-card border-t sm:border border-border sm:rounded-3xl shadow-2xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:pb-5 space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95"
          >
            <div className="flex items-center justify-between">
              <h2 id="lang-title" className="font-heading text-lg font-bold">
                Choose your language
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground -mt-2">
              Pick the language you read most easily.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map((l) => {
                const active = l.code === currentCode;
                const busy = pendingCode === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    disabled={pending}
                    onClick={() => select(l.code)}
                    className={`h-12 px-4 rounded-2xl border text-base font-semibold transition-all flex items-center justify-between gap-2 ${
                      active
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-card text-foreground border-border hover:border-primary/40"
                    }`}
                    aria-pressed={active}
                  >
                    <span className="truncate">{l.native}</span>
                    {busy ? (
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    ) : active ? (
                      <Check className="w-4 h-4 shrink-0" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
