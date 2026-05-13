"use client";

import { useEffect } from "react";

// Mounts once in dashboard layout. Registers the PWA service worker on
// production builds only — dev mode would cache stale Next.js HMR assets.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch(() => {
        // swallow — offline is a nice-to-have, not a blocker
      });
  }, []);

  return null;
}
