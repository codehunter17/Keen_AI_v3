import "server-only";
import { createHmac } from "node:crypto";

// Phone-OTP login wraps Better Auth's email/password flow with a
// synthetic email + a deterministic password so the rest of the app
// (sessions, tier checks, dashboards) keeps working without changes.
//
// For each phone user:
//   email    = "<phone>@phone.nutrimama.local"  (never sent / displayed)
//   password = HMAC-SHA256(phone, OTP_SECRET)   (deterministic, server-only)
//
// The password is recomputable from phone + OTP_SECRET, so we can sign
// the user in repeatedly without remembering a literal credential —
// proof of phone ownership comes from the Twilio OTP check before we
// ever call signIn.

const OTP_SECRET = process.env.OTP_SECRET?.trim() ?? "";

// Domain for synthetic emails. ".local" is not routable so these emails
// can never receive mail — that's by design.
const PHONE_EMAIL_DOMAIN = "phone.nutrimama.local";

export function syntheticEmailForPhone(phoneE164: string): string {
  // E.164 starts with "+"; strip it for a clean local-part.
  const local = phoneE164.replace(/^\+/, "");
  return `${local}@${PHONE_EMAIL_DOMAIN}`;
}

export function isSyntheticPhoneEmail(email: string): boolean {
  return email.toLowerCase().endsWith(`@${PHONE_EMAIL_DOMAIN}`);
}

/**
 * Deterministic password for phone-only users. Derived from phone +
 * server secret so we never store the literal password anywhere except
 * Better Auth's bcrypt hash. If OTP_SECRET ever changes, all phone
 * users would need to re-verify — keep it stable.
 */
export function derivePhonePassword(phoneE164: string): string {
  if (!OTP_SECRET) {
    throw new Error("OTP_SECRET is not configured — phone login disabled.");
  }
  return createHmac("sha256", OTP_SECRET).update(phoneE164).digest("hex");
}

/** Display label for a phone E.164 number (e.g. "+91 98765 43210"). */
export function formatPhoneDisplay(phoneE164: string): string {
  if (phoneE164.startsWith("+91") && phoneE164.length === 13) {
    const rest = phoneE164.slice(3);
    return `+91 ${rest.slice(0, 5)} ${rest.slice(5)}`;
  }
  return phoneE164;
}
