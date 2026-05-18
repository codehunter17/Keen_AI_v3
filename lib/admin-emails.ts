// ─── Admin email-based access control ────────────────────────────────────────
// Admin access is granted by listing email addresses in the ADMIN_EMAILS
// environment variable (comma-separated). No SQL, no DB flag to set manually.
//
// Usage in Vercel / .env:
//   ADMIN_EMAILS=kenekrishna11@gmail.com,other@example.com
//
// How it works:
//   - isAdminEmail(email) → true if the email is in the list
//   - requireAdmin(email) → throws FORBIDDEN if not admin
//   - Any admin email automatically gets isStaff = true in the DB on first
//     admin action (via ensureStaffFlag). This keeps Better Auth sessions
//     consistent without requiring manual SQL.

import { prisma } from "@/lib/prisma";

/** Parse and normalize the ADMIN_EMAILS env var. Cached at module load. */
const ADMIN_SET: Set<string> = new Set(
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

/**
 * Returns true if the given email has admin access.
 * Works both server-side (Node) and edge runtime (checks the env var).
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_SET.has(email.trim().toLowerCase());
}

/**
 * Throws a FORBIDDEN error if the user is not an admin.
 * Use this at the top of every admin server action.
 */
export function requireAdmin(email: string | null | undefined): void {
  if (!isAdminEmail(email)) {
    throw new Error("FORBIDDEN");
  }
}

/**
 * Ensures the user row in the DB has isStaff = true.
 * Call this lazily (fire-and-forget) after admin email is confirmed.
 * Idempotent — safe to call on every request.
 */
export async function ensureStaffFlag(userId: string): Promise<void> {
  await prisma.user.updateMany({
    where: { id: userId, isStaff: { not: true } },
    data: { isStaff: true },
  });
}
