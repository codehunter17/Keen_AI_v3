/**
 * PII anonymization for Keen.
 *
 * Keen never sees raw user IDs, emails, names, phone numbers, Aadhaar, PAN,
 * voter ID, ABHA, or bank account numbers. All signals are scrubbed at the
 * adapter boundary before being persisted as RawSignal rows.
 */

import { createHash } from "node:crypto";

/** Hash a userId into a stable pseudonym Keen can use without exposing identity. */
export function pseudonymize(userId: string, salt = "keen-v1"): string {
  return createHash("sha256")
    .update(salt + ":" + userId)
    .digest("hex")
    .slice(0, 16);
}

const PATTERNS: Array<[RegExp, string]> = [
  [/\b\d{4}\s?\d{4}\s?\d{4}\b/g, "[AADHAAR]"],
  [/\b[A-Z]{5}\d{4}[A-Z]\b/g, "[PAN]"],
  [/\b\+?91[\s-]?\d{10}\b/g, "[PHONE]"],
  [/\b\d{10}\b/g, "[PHONE]"],
  [/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[EMAIL]"],
  [/\b\d{14}\b/g, "[ABHA]"],
  [/\b[A-Z]{3}\d{7}\b/g, "[VOTER_ID]"],
  [/\b\d{9,18}\b/g, "[BANK_ACC]"],
];

/** Strip Indian PII from a freeform string. */
export function scrubText(input: string): string {
  let out = input;
  for (const [pattern, replacement] of PATTERNS) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

/** Recursively scrub PII from any JSON-shaped payload. */
export function scrubPayload<T>(payload: T): T {
  if (typeof payload === "string") return scrubText(payload) as T;
  if (Array.isArray(payload)) return payload.map(scrubPayload) as T;
  if (payload && typeof payload === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(payload as Record<string, unknown>)) {
      // Drop common identity keys outright.
      if (
        ["userId", "email", "phone", "name", "aadhaar", "pan", "abha"].includes(
          k,
        )
      ) {
        continue;
      }
      out[k] = scrubPayload(v);
    }
    return out as T;
  }
  return payload;
}
