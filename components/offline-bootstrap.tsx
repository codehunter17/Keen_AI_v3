"use client";

import { useEffect, useState } from "react";
import { ensureFoodsLoaded } from "@/lib/offline-db";
import { installAutoDrain, drainQueue } from "@/lib/sync-orchestrator";

// Mounts once in dashboard layout. Loads the food DB into IndexedDB on first
// boot, installs auto-sync handlers, and shows a tiny offline indicator.

export function OfflineBootstrap() {
  const [online, setOnline] = useState(true);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setOnline(navigator.onLine);

    ensureFoodsLoaded().catch(() => {});
    installAutoDrain();

    const onOnline = () => {
      setOnline(true);
      drainQueue().then((r) => setPending(0)).catch(() => {});
    };
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-1/2 -translate-x-1/2 z-40 rounded-full bg-foreground text-background px-4 py-1.5 text-xs font-semibold shadow-lg">
      📴 Offline · meals will sync when you reconnect{pending > 0 ? ` (${pending} pending)` : ""}
    </div>
  );
}
