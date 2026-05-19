/**
 * KEEN POLICY — the code-level firewall.
 *
 * Lists paths and table names Keen is NEVER allowed to touch, regardless of
 * approval tier. Both the Proposer (won't draft PRs against these) and the
 * Executor (rejects PRs whose diffs intersect these) consult this file.
 *
 * Even L4 (passphrase) approval cannot override these. The operator must edit
 * forbidden paths manually.
 */

export const KEEN_FORBIDDEN_PATHS = [
  // Payment logic
  "lib/razorpay.ts",
  "lib/payments/",
  "app/api/razorpay/",
  "app/api/payments/",
  "app/api/webhooks/razorpay/",
  "app/dashboard/billing/",
  "app/pricing/",

  // Auth
  "lib/auth.ts",
  "lib/auth-client.ts",
  "lib/auth-utils.ts",
  "app/api/auth/",
  "app/auth/",
  "middleware.ts",

  // DPDP consent records
  "lib/consent.ts",
  "lib/dpdp/",
  "app/api/consent/",

  // Emergency triage RED-path
  "lib/safety.ts",
  "lib/triage.ts",
  "lib/emergency/",
  "app/api/triage/",
];

export const KEEN_FORBIDDEN_TABLES = [
  "ConsentRecord",
  "Subscription",
  "Coupon",
  "WebhookEvent",
  "Account",
  "Session",
  "Verification",
];

export type ApprovalTier = "L1" | "L2" | "L3" | "L4";

export interface PolicyDecision {
  allowed: boolean;
  reason?: string;
  forbiddenMatches?: string[];
}

/**
 * Returns whether a candidate file path is forbidden. Match is prefix-based on
 * normalized paths so any file under a forbidden directory is also forbidden.
 */
export function isPathForbidden(candidatePath: string): boolean {
  const normalized = candidatePath.replace(/\\/g, "/").replace(/^\/+/, "");
  return KEEN_FORBIDDEN_PATHS.some((forbidden) => {
    const f = forbidden.replace(/^\/+/, "");
    if (f.endsWith("/")) return normalized.startsWith(f);
    return normalized === f || normalized.startsWith(f + "/");
  });
}

/**
 * Evaluates a set of candidate paths against the forbidden list.
 * Used by Proposer before drafting + Executor before merging.
 */
export function evaluatePaths(paths: string[]): PolicyDecision {
  const forbiddenMatches = paths.filter(isPathForbidden);
  if (forbiddenMatches.length > 0) {
    return {
      allowed: false,
      reason: "Diff touches one or more KEEN_FORBIDDEN_PATHS",
      forbiddenMatches,
    };
  }
  return { allowed: true };
}

/**
 * Evaluates a set of candidate table-name mutations against the forbidden table list.
 */
export function evaluateTables(tableNames: string[]): PolicyDecision {
  const forbiddenMatches = tableNames.filter((t) =>
    KEEN_FORBIDDEN_TABLES.includes(t),
  );
  if (forbiddenMatches.length > 0) {
    return {
      allowed: false,
      reason: "Mutation touches one or more KEEN_FORBIDDEN_TABLES",
      forbiddenMatches,
    };
  }
  return { allowed: true };
}
