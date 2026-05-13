// Client-side helpers for scheduling local notifications via the service worker.
// Zero-cost — no VAPID, no server. Limit: ~30 min from now.
//
// For longer cadences (daily reminders, cycle predictions), we set the next
// notification each time the user opens the app — so it's "best-effort" but
// reliable enough to feel real.

"use client";

export async function ensureNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export async function scheduleLocal(opts: {
  id: string;
  title: string;
  body?: string;
  delayMs: number;
  tag?: string;
  url?: string;
}): Promise<void> {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const reg = await navigator.serviceWorker.ready;
  reg.active?.postMessage({ type: "SCHEDULE_NOTIFICATION", ...opts });
}

export async function cancelLocal(id: string): Promise<void> {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  const reg = await navigator.serviceWorker.ready;
  reg.active?.postMessage({ type: "CANCEL_NOTIFICATION", id });
}

// Convenience presets used after specific user actions.
//   After meal logged → "drink nimbu pani in 1 hour"
export function scheduleAfterMealHydrationNudge() {
  return scheduleLocal({
    id: "after-meal-water",
    title: "Time for nimbu pani 🍋",
    body: "1 hour after your meal — boost iron absorption with vitamin C.",
    delayMs: 60 * 60_000,
    tag: "hydration",
    url: "/dashboard/wellness",
  });
}

//   After period logged → "we'll remind you near your fertile window"
export function schedulePeriodFollowupSoon() {
  return scheduleLocal({
    id: "period-followup",
    title: "Quick check-in 🌙",
    body: "How are cramps + flow today? 60 seconds to log.",
    delayMs: 24 * 60 * 60_000, // 24h — note: SW caps at 30 min reliably; this one fires only if app reopens
    tag: "cycle",
    url: "/dashboard/cycle",
  });
}
