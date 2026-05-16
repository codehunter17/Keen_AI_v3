// Single source of truth for how NutriMama displays a user's contact line.
//
// Phone-OTP users get a synthetic email of the form
//   "<digits>@phone.nutrimama.local"
// which is great for Better Auth's email/password machinery but TERRIBLE
// to surface anywhere visible — Razorpay would show it on the payment
// modal, the chat avatar tooltip would leak it, etc.
//
// Rule: if the email is synthetic, hide it. Surface a formatted phone
// number if we have one, otherwise an empty string. Real emails pass
// through unchanged.

// Inlined from lib/phone-auth.ts so this helper stays usable from client
// components. The server-only file imports node:crypto and OTP_SECRET so
// pulling anything from it forces a server-only bundle.
const PHONE_EMAIL_DOMAIN = "phone.nutrimama.local";

function isSyntheticPhoneEmail(email: string): boolean {
  return email.toLowerCase().endsWith(`@${PHONE_EMAIL_DOMAIN}`);
}

function formatPhoneDisplay(phoneE164: string): string {
  if (phoneE164.startsWith("+91") && phoneE164.length === 13) {
    const rest = phoneE164.slice(3);
    return `+91 ${rest.slice(0, 5)} ${rest.slice(5)}`;
  }
  return phoneE164;
}

type ContactLike = {
  email?: string | null;
  phoneNumber?: string | null;
};

/**
 * Display the user's primary contact line.
 * - Real email → returns the email
 * - Synthetic phone email + phoneNumber known → returns formatted phone
 * - Anything else → "" (caller decides whether to render or hide)
 */
export function displayEmail(user: ContactLike | null | undefined): string {
  if (!user) return "";
  const email = (user.email ?? "").trim();
  if (email && !isSyntheticPhoneEmail(email)) return email;
  if (user.phoneNumber) return formatPhoneDisplay(user.phoneNumber);
  return "";
}

/**
 * Email we can hand to a third party (Razorpay, email send, etc.).
 * Returns "" for synthetic phone emails so we don't leak the
 * @phone.nutrimama.local handle into payment receipts.
 */
export function safeContactEmail(user: ContactLike | null | undefined): string {
  if (!user) return "";
  const email = (user.email ?? "").trim();
  if (!email) return "";
  if (isSyntheticPhoneEmail(email)) return "";
  return email;
}

/**
 * True if the user signed up via phone OTP and has no real email yet.
 * Useful to hide the email row entirely or to nudge them to add one.
 */
export function isPhoneOnlyUser(user: ContactLike | null | undefined): boolean {
  if (!user) return false;
  const email = (user.email ?? "").trim();
  return !!email && isSyntheticPhoneEmail(email);
}
