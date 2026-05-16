"use client";

// Custom in-app PWA install prompt.
//
// Chrome only fires its native "Add to Home Screen" banner after the user
// has engaged with the site twice + ~30s of interaction. For first-time
// visitors that means they never see the banner. We bypass this by:
//
//   1. Capturing the `beforeinstallprompt` event ourselves (prevents Chrome
//      from showing its own banner so we can render a styled one instead).
//   2. Showing a bottom-pinned "Install NutriMama" bar after the user has
//      been on the page for 12+ seconds AND hasn't dismissed it before.
//   3. On tap, calling event.prompt() — that fires the native confirm-
//      install dialog which actually installs the app.
//
// iOS Safari (no beforeinstallprompt support): we show a one-liner with
// the Add-to-Home-Screen instructions because iOS has no programmatic
// install API.

import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_STORAGE_KEY = "nutrimama.pwa.installDismissedAt";
const DISMISS_COOLDOWN_DAYS = 7;
const SHOW_DELAY_MS = 12_000;

export function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [show, setShow] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    // Already installed? Don't show.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      return;
    }
    // Recently dismissed? Honour the cooldown.
    try {
      const dismissedAt = window.localStorage.getItem(DISMISS_STORAGE_KEY);
      if (dismissedAt) {
        const ago = Date.now() - Number(dismissedAt);
        if (ago < DISMISS_COOLDOWN_DAYS * 86_400_000) return;
      }
    } catch {
      // Storage blocked — show anyway, dismissal will just not persist.
    }

    const onBefore = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      // Don't show immediately — let the user start interacting first.
      const t = setTimeout(() => setShow(true), SHOW_DELAY_MS);
      return () => clearTimeout(t);
    };

    window.addEventListener("beforeinstallprompt", onBefore);

    // iOS Safari fallback — no beforeinstallprompt, so detect by UA + show
    // a hint after a similar delay.
    const ua = navigator.userAgent.toLowerCase();
    const isIos =
      /iphone|ipad|ipod/.test(ua) && !/crios|fxios/.test(ua);
    if (isIos) {
      const t = setTimeout(() => setIosHint(true), SHOW_DELAY_MS);
      return () => {
        clearTimeout(t);
        window.removeEventListener("beforeinstallprompt", onBefore);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", onBefore);
  }, []);

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_STORAGE_KEY, String(Date.now()));
    } catch {
      // ignore
    }
    setShow(false);
    setIosHint(false);
  };

  const install = async () => {
    if (!deferred) return;
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        setShow(false);
        try {
          window.localStorage.setItem(
            DISMISS_STORAGE_KEY,
            String(Date.now() + DISMISS_COOLDOWN_DAYS * 86_400_000 * 100),
          );
        } catch {
          // ignore
        }
      } else {
        dismiss();
      }
    } catch (err) {
      console.warn("[pwa-install] prompt failed", err);
      dismiss();
    }
  };

  if (!show && !iosHint) return null;

  // iOS hint card — no programmatic install.
  if (iosHint) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-[80] no-print p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pointer-events-none">
        <div className="mx-auto max-w-md bg-card border border-border shadow-2xl rounded-2xl p-4 pointer-events-auto flex items-start gap-3 animate-in slide-in-from-bottom">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Share className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Install NutriMama on your iPhone
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Tap the <strong>Share</strong> icon below, scroll, then choose{" "}
              <strong>Add to Home Screen</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss install prompt"
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Android / desktop Chromium install bar.
  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] no-print p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pointer-events-none">
      <div className="mx-auto max-w-md bg-card border border-border shadow-2xl rounded-2xl p-3 pointer-events-auto flex items-center gap-3 animate-in slide-in-from-bottom">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Download className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight">
            Install NutriMama
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Works offline · no Play Store · 1-tap from home
          </p>
        </div>
        <button
          type="button"
          onClick={install}
          className="h-10 px-4 rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90 transition shrink-0"
        >
          Install
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="p-1.5 rounded-full hover:bg-muted text-muted-foreground shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
