"use client";

// App-level error boundary — catches any unhandled error in server actions,
// pages, or client components. Replaces Next.js's default scary stack-trace
// page with a friendly recovery UI.

import { useEffect } from "react";
import Link from "next/link";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app:error]", error);
  }, [error]);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6 py-12 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-5xl">🌱</div>
        <h1 className="text-2xl font-heading font-bold text-foreground">
          Something went sideways
        </h1>
        <p className="text-sm text-muted-foreground">
          We hit an unexpected error. Your data is safe — give it another try.
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
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
