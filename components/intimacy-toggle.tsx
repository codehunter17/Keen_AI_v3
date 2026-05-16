"use client";

// Discreet intercourse-log toggle for the Cycle Today tab.
// Designed to be unobtrusive — collapsed by default, opens on tap.
// Privacy badge is loud + the action is a single tap.

import { useState, useTransition } from "react";
import { Lock, Heart, Check, Loader2 } from "lucide-react";
import { logIntimacyToday } from "@/lib/actions/intimacy";

export function IntimacyToggle({
  initialLogged,
}: {
  initialLogged: boolean;
}) {
  const [logged, setLogged] = useState(initialLogged);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const toggle = (next: boolean) => {
    setLogged(next); // optimistic
    startTransition(async () => {
      const res = await logIntimacyToday(next);
      if (!res.ok) {
        setLogged(!next); // revert
      }
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border border-dashed border-border bg-card/40 hover:bg-card/60 transition px-4 py-3 flex items-center gap-3 text-left"
        aria-expanded={false}
      >
        <span className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center shrink-0">
          <Heart className="w-4 h-4 text-rose-600 dark:text-rose-300" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">
            Log intercourse{" "}
            {logged && (
              <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-300 ml-1">
                · ✓ today
              </span>
            )}
          </p>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <Lock className="w-3 h-3" />
            Private — never shared with AI or partners
          </p>
        </div>
      </button>
    );
  }

  return (
    <section className="rounded-2xl border border-rose-200 dark:border-rose-800/50 bg-rose-50/60 dark:bg-rose-950/20 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <span className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center shrink-0">
          <Heart className="w-4 h-4 text-rose-600 dark:text-rose-300" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">
            Did you have intercourse today?
          </p>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
            <Lock className="w-3 h-3" />
            Logged privately. Used only to improve fertility-window
            predictions. Never sent to chat AI, never shared.
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => toggle(true)}
          disabled={pending}
          className={`flex-1 h-11 rounded-2xl text-sm font-semibold transition flex items-center justify-center gap-1.5 ${
            logged
              ? "bg-rose-500 text-white"
              : "bg-card border border-border hover:border-rose-300 text-foreground"
          }`}
          aria-pressed={logged}
        >
          {pending && logged ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : logged ? (
            <Check className="w-4 h-4" />
          ) : null}
          Yes
        </button>
        <button
          type="button"
          onClick={() => toggle(false)}
          disabled={pending}
          className={`flex-1 h-11 rounded-2xl text-sm font-semibold transition flex items-center justify-center gap-1.5 ${
            !logged
              ? "bg-foreground text-background"
              : "bg-card border border-border hover:border-muted-foreground text-foreground"
          }`}
          aria-pressed={!logged}
        >
          {pending && !logged ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : null}
          No
        </button>
      </div>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="w-full text-[11px] text-muted-foreground hover:text-foreground transition"
      >
        Collapse
      </button>
    </section>
  );
}
