// Shared helpers for classifying server-action errors on the client.
//
// All tier / quota errors raised in lib/actions/* follow a consistent
// wording pattern — these matchers let any page detect them cheaply
// without hardcoding the exact strings everywhere.

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    const m = (err as { message?: unknown }).message;
    return typeof m === "string" ? m : "";
  }
  return "";
}

/** Tier-locked: the feature isn't available on the user's current plan. */
export function isTierLockError(err: unknown): boolean {
  const m = getErrorMessage(err).toLowerCase();
  return (
    m.includes("care/pro feature") ||
    m.includes("upgrade to unlock") ||
    m.includes("upgrade for") ||
    m.includes("upgrade to pro")
  );
}

/** Quota-exceeded: feature is allowed but the user hit their monthly cap. */
export function isQuotaError(err: unknown): boolean {
  const m = getErrorMessage(err).toLowerCase();
  return (
    m.includes("reached your") ||
    (m.includes("used your") && m.includes("month")) ||
    (m.includes("used your") && m.includes("for this month"))
  );
}

/** Either kind of paywall — bundle for "show upgrade UI" branching. */
export function isPaywallError(err: unknown): boolean {
  return isTierLockError(err) || isQuotaError(err);
}
