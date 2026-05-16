import "server-only";

// Phone-OTP signup writes `name: phoneE164` ("+91…") into the user row
// because Better Auth's signUpEmail requires a name. The greeting helpers
// already reject phone-shaped strings at render time, but we should also
// wipe them from the DB so:
//   - chat memory + AI prompts don't keep saying "+91…"
//   - Razorpay prefill doesn't expose the phone where name is expected
//   - a future bug that bypasses displayName() can't reintroduce it
//
// This runs on every dashboard request via dashboard/layout.tsx but is
// cheap: one SELECT on a single field, optional UPDATE only when needed.
// Per-process memoization avoids hammering the DB for users we already
// cleaned in this Node process.

import { prisma } from "@/lib/prisma";

const cleanedUserIds = new Set<string>();
const MAX_CACHE_SIZE = 5_000;

function looksLikePhoneOrEmail(s: string): boolean {
  const t = s.trim();
  if (!t) return false;
  const digits = t.replace(/[+\-\s()]/g, "");
  if (/^\d{7,15}$/.test(digits)) return true;
  if (t.includes("@") && /\.[a-z]{2,}/i.test(t)) return true;
  return false;
}

/**
 * Ensure the user.name field doesn't contain a phone or email placeholder.
 * Idempotent + memoized per-process. Safe to call from a layout.
 */
export async function ensureRealName(userId: string): Promise<void> {
  if (!userId) return;
  if (cleanedUserIds.has(userId)) return;

  try {
    const row = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });
    if (!row) return;

    if (looksLikePhoneOrEmail(row.name ?? "")) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: "" }, // empty → UI falls back to "Ma'am"
      });
    }

    // Cap the cache so a long-running process doesn't grow forever.
    if (cleanedUserIds.size >= MAX_CACHE_SIZE) {
      cleanedUserIds.clear();
    }
    cleanedUserIds.add(userId);
  } catch (err) {
    // Don't break the page render if cleanup fails — just log.
    console.warn("[ensure-real-name] failed (will retry next request):", err);
  }
}
