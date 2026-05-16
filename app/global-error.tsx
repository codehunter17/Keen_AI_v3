"use client";

// Last-resort error boundary — fires when the root layout itself errors.
// Must include its own <html> and <body> because the regular layout
// isn't rendered when this catches.

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global:error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
          fontFamily: "system-ui, sans-serif",
          background: "#FDFCFB",
          color: "#14201C",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌱</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
            NutriMama hit a snag
          </h1>
          <p style={{ fontSize: 14, color: "#5b6660", marginBottom: 24 }}>
            We&apos;re sorry — please refresh the page. Your data is safe.
          </p>
          {error?.digest && (
            <p
              style={{
                fontSize: 11,
                color: "#8a948f",
                fontFamily: "ui-monospace, monospace",
                marginBottom: 16,
              }}
            >
              ref: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              minHeight: 48,
              padding: "0 24px",
              borderRadius: 999,
              background: "#3F8F6F",
              color: "white",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
