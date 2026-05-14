import "server-only";
import twilio from "twilio";

// Twilio Verify wrappers — used by /api/otp/send and /api/otp/verify.
// Verify is preferable to raw SMS because:
//   - Twilio generates + stores the code (we don't manage it)
//   - Built-in rate limiting + abuse protection
//   - One config (Service SID), no phone-number-rental needed
//
// Reuses the same Twilio account that powered keen-ai-two.vercel.app, so
// the trial credit / costs accrue against your existing project.

const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID?.trim();

const TWILIO_CONFIGURED = Boolean(accountSid && authToken && verifyServiceSid);

if (!TWILIO_CONFIGURED && process.env.NODE_ENV === "production") {
  console.warn(
    "[twilio] Not fully configured — phone OTP login will be unavailable. Email auth still works. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID on Vercel.",
  );
}

const client = TWILIO_CONFIGURED ? twilio(accountSid!, authToken!) : null;

export const isTwilioConfigured = TWILIO_CONFIGURED;

/**
 * Normalize phone input to E.164. Accepts:
 *   "9876543210"        → "+919876543210"   (default India)
 *   "+919876543210"     → "+919876543210"
 *   "+1 555 1234567"    → "+15551234567"
 *   "91-9876-54-3210"   → "+919876543210"
 */
export function toE164(raw: string, defaultCountry: "IN" = "IN"): string | null {
  const cleaned = raw.replace(/[\s\-()]/g, "");
  if (!cleaned) return null;
  if (cleaned.startsWith("+")) {
    // Validate basic E.164 shape (8-15 digits after +)
    if (!/^\+\d{8,15}$/.test(cleaned)) return null;
    return cleaned;
  }
  // No leading + → assume default country
  const digits = cleaned.replace(/\D/g, "");
  if (defaultCountry === "IN") {
    if (digits.length === 10 && /^[6-9]/.test(digits)) return `+91${digits}`;
    if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  }
  return null;
}

/** Send an OTP via Twilio Verify. Returns true if the SMS was queued. */
export async function sendOtp(phoneE164: string): Promise<{ ok: boolean; reason?: string }> {
  if (!client) return { ok: false, reason: "TWILIO_NOT_CONFIGURED" };
  try {
    const v = await client.verify.v2
      .services(verifyServiceSid!)
      .verifications.create({ to: phoneE164, channel: "sms" });
    if (v.status === "pending" || v.status === "approved") return { ok: true };
    return { ok: false, reason: `unexpected_status:${v.status}` };
  } catch (err) {
    const e = err as { code?: number; message?: string };
    // Twilio error code 60200 = invalid parameter (bad phone format)
    // Twilio error code 60203 = max send attempts reached
    if (e.code === 60200) return { ok: false, reason: "INVALID_PHONE" };
    if (e.code === 60203) return { ok: false, reason: "RATE_LIMITED" };
    console.error("[twilio] sendOtp failed:", e);
    return { ok: false, reason: e.message ?? "SEND_FAILED" };
  }
}

/** Verify an OTP via Twilio Verify. Returns true if approved. */
export async function verifyOtp(
  phoneE164: string,
  code: string,
): Promise<{ ok: boolean; reason?: string }> {
  if (!client) return { ok: false, reason: "TWILIO_NOT_CONFIGURED" };
  try {
    const check = await client.verify.v2
      .services(verifyServiceSid!)
      .verificationChecks.create({ to: phoneE164, code });
    if (check.status === "approved") return { ok: true };
    return { ok: false, reason: check.status ?? "INVALID_CODE" };
  } catch (err) {
    const e = err as { code?: number; message?: string };
    // Twilio error code 20404 = no verification in progress
    if (e.code === 20404) return { ok: false, reason: "EXPIRED_OR_NO_PENDING" };
    console.error("[twilio] verifyOtp failed:", e);
    return { ok: false, reason: e.message ?? "VERIFY_FAILED" };
  }
}
