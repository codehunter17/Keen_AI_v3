"use client";

import { useEffect } from "react";

// Mounts once in dashboard layout. Registers the PWA service worker on
// production builds only — dev mode would cache stale Next.js HMR assets.
//
// Also wires an update flow: when a new SW version is found, we tell the
// waiting worker to skipWaiting and reload once it takes control. Without
// this, users get stuck on the old cached shell forever after a deploy.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        // If a worker is already waiting on first load, activate it.
        if (reg.waiting) {
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
        }

        reg.addEventListener("updatefound", () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            if (
              installing.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New version installed and an old one is active — swap in.
              installing.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });
      })
      .catch(() => {
        // swallow — offline is a nice-to-have, not a blocker
      });
  }, []);

  return null;
}
