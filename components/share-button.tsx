"use client";

import { useState, useTransition } from "react";
import { getWeeklyShareText } from "@/lib/actions/share";
import { awardBadge } from "@/lib/actions/badges";
import { Button } from "@/components/ui/button";

// Web Share API where supported (most mobile browsers).
// Fallback: open wa.me/?text=... in a new tab — works everywhere.

export function ShareWeeklyButton() {
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const share = () =>
    startTransition(async () => {
      try {
        const { text, subject } = await getWeeklyShareText();

        // 1. Try native Web Share API
        if (typeof navigator !== "undefined" && "share" in navigator) {
          try {
            await navigator.share({ title: subject, text });
            awardBadge("ASHA_SHARED").catch(() => {});
            return;
          } catch {
            // user canceled — fall through is fine
          }
        }

        // 2. Fallback: WhatsApp deep link
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank", "noopener,noreferrer");
        awardBadge("ASHA_SHARED").catch(() => {});

        // Also copy to clipboard so user has it either way
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch {
          /* ignore */
        }
      } catch (e) {
        console.error("[share] failed", e);
        alert("Couldn't prepare your weekly update. Please try again.");
      }
    });

  return (
    <div className="rounded-2xl bg-card lift p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Share with family / ASHA worker
          </p>
          <p className="font-heading text-lg mt-1">Weekly update</p>
          <p className="mt-1 text-sm text-muted-foreground">
            A simple text summary in English + Hindi — readable by anyone, even
            on a basic phone.
          </p>
        </div>
        <span className="text-3xl">💬</span>
      </div>
      <Button onClick={share} disabled={pending} className="mt-4">
        {pending ? "Preparing…" : copied ? "Copied + opened WhatsApp ✓" : "Share via WhatsApp"}
      </Button>
    </div>
  );
}
