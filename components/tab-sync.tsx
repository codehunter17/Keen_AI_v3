"use client";

// Cross-tab sync helper. When a user signs in / signs out / updates their
// profile in one tab, other tabs were showing stale state because:
//   1) Better Auth's useSession() doesn't refetch on tab focus.
//   2) Next.js Server Components don't re-render until the route is
//      pushed or the page is reloaded.
//
// On `visibilitychange` (tab becomes visible again) and `storage`
// (Better Auth's session storage updated by another tab) we:
//   - Invalidate every TanStack Query so server data is re-fetched.
//   - Call router.refresh() so Server Components re-render with the
//     current session cookie.
//
// Mounted once inside the providers tree — safe in nested layouts.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export function TabSync() {
  const router = useRouter();
  const qc = useQueryClient();

  useEffect(() => {
    let lastSync = 0;
    const MIN_GAP_MS = 2_000; // don't thrash on every flick of focus

    const refresh = () => {
      const now = Date.now();
      if (now - lastSync < MIN_GAP_MS) return;
      lastSync = now;
      // Reset every cached query so server actions re-execute fresh.
      qc.invalidateQueries();
      // Re-render server components with the latest session cookie.
      router.refresh();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };

    // Sister tabs use localStorage to broadcast auth changes — listen for
    // any key change from Better Auth's storage area + our own.
    const onStorage = (e: StorageEvent) => {
      // Don't act on every tiny write — only auth-relevant keys.
      if (
        e.key &&
        (e.key.startsWith("better-auth") ||
          e.key.startsWith("nutrimama.") ||
          e.key === null)
      ) {
        refresh();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("storage", onStorage);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("storage", onStorage);
    };
  }, [router, qc]);

  return null;
}
