"use client";

// Dashboard-scoped error boundary — keeps the shell out of the way and
// gives users a clear path back. Triggered by any unhandled error in a
// dashboard server action or page render.

import { useEffect } from "react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[dashboard:error]", error);
  }, [error]);

  return (
    <div className="w-full flex items-center justify-center py-16">
      <div className="max-w-md w-full text-center space-y-5 px-4">
        <div className="text-4xl">🌱</div>
        <h2 className="text-xl font-heading font-bold text-foreground">
          That page couldn&apos;t load
        </h2>
        <p className="text-sm text-muted-foreground">
          A temporary glitch — your data is safe. Try again, or head back to
          your dashboard.
        </p>
        {error?.digest && (
          <p className="text-[11px] text-muted-foreground/70 font-mono">
            ref: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="h-12 px-6 rounded-full bg-primary text-white font-semibold hover:opacity-90 transition"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="h-12 px-6 rounded-full border border-border text-foreground font-semibold inline-flex items-center justify-center hover:bg-muted transition"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
