"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { ensureNotificationPermission } from "@/lib/notifications-client";

// Small banner that asks for notification permission once.
// Auto-hides if user has already granted or denied. Stores a localStorage
// flag so we don't pester them every visit.

const DISMISS_KEY = "nm-notif-prompt-dismissed";

export function NotificationPrompt() {
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "default") return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;
    setShow(true);
  }, []);

  if (!show) return null;

  const enable = async () => {
    setBusy(true);
    const ok = await ensureNotificationPermission();
    setBusy(false);
    if (ok) setShow(false);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setShow(false);
  };

  return (
    <div className="rounded-2xl bg-card lift p-4 sm:p-5 flex items-start gap-3">
      <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
        <Bell className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1">
        <p className="font-medium">Get gentle reminders</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          We'll remind you about water after meals, period predictions, and
          appointments. Local-only — nothing leaves your phone.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={enable}
            disabled={busy}
            className="rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
          >
            {busy ? "…" : "Enable"}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <BellOff className="inline w-3 h-3 mr-1" /> Not now
          </button>
        </div>
      </div>
    </div>
  );
}
