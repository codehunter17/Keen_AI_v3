"use client";

// Bridges the IndexedDB queue to the server. On reconnect (or when the page
// is visible), drains pending meals to the server in one batch. Idempotent —
// safe to call repeatedly. Marks rows as synced so they don't replay.

import { getPendingMeals, markMealsSynced } from "@/lib/offline-db";
import { syncMealBatch } from "@/lib/actions/meals";

let _draining = false;

export async function drainQueue(): Promise<{ pushed: number; ok: boolean }> {
  if (_draining) return { pushed: 0, ok: true };
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return { pushed: 0, ok: false };
  }
  _draining = true;
  try {
    const pending = await getPendingMeals();
    if (pending.length === 0) return { pushed: 0, ok: true };

    const meals = pending.map((m) => ({
      type: m.type,
      foodId: m.foodId,
      foodName: m.foodName,
      servings: m.servings,
      loggedAt: m.loggedAt,
    }));
    const res = await syncMealBatch({ meals });
    if (!res.ok) return { pushed: 0, ok: false };

    await markMealsSynced(pending.map((p) => p.id!).filter((id): id is number => typeof id === "number"));
    return { pushed: pending.length, ok: true };
  } catch (err) {
    console.warn("[sync] drain failed", err);
    return { pushed: 0, ok: false };
  } finally {
    _draining = false;
  }
}

// Auto-drain on online + visibility events. Mount once at app root.
export function installAutoDrain() {
  if (typeof window === "undefined") return;
  const fire = () => {
    drainQueue().catch(() => {});
  };
  window.addEventListener("online", fire);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") fire();
  });
  // First-paint kick after 2s
  setTimeout(fire, 2000);
}
