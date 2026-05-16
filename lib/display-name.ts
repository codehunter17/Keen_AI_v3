// Single source of truth for how NutriMama addresses a user.
//
// Rule: if the user has set a name, use it. Otherwise default to "Ma'am" —
// a respectful, lifecycle-neutral term that reads well in both rural and
// urban Indian contexts and across English / Hindi-medium users.
//
// Never hard-code another fallback ("friend", "there", "Mom-to-be") in the
// UI. Reach for these helpers instead.

const DEFAULT_FALLBACK = "Ma'am";

type NameLike =
  | string
  | null
  | undefined
  | { name?: string | null | undefined };

function pickName(input: NameLike): string {
  if (!input) return "";
  const raw = typeof input === "string" ? input : (input.name ?? "");
  const trimmed = raw.trim();
  // Phone OTP signup defaults the name field to the phone number. That's
  // an identifier, not a name — never greet a user as "+917070511022".
  // Treat phone-shaped strings as if no name were set so the rest of the
  // app falls back to "Ma'am" and the missing-name nudge shows.
  if (looksLikePhoneNumber(trimmed)) return "";
  // Also reject email-shaped strings (some auth flows populate name=email).
  if (trimmed.includes("@") && /\.[a-z]{2,}/i.test(trimmed)) return "";
  return trimmed;
}

function looksLikePhoneNumber(s: string): boolean {
  if (!s) return false;
  // Strip common phone glyphs (+ - space ( )) and see if what's left is
  // 7-15 digits — covers Indian (+91…) and international formats.
  const digitsOnly = s.replace(/[+\-\s()]/g, "");
  if (!/^\d{7,15}$/.test(digitsOnly)) return false;
  return true;
}

/**
 * True when the input is the phone-as-name default that phone-OTP signup
 * leaves on the user record. UI uses this to surface the name-capture nudge.
 */
export function isPlaceholderName(input: NameLike): boolean {
  if (!input) return false;
  const raw = typeof input === "string" ? input : (input.name ?? "");
  const trimmed = raw.trim();
  if (!trimmed) return false;
  return looksLikePhoneNumber(trimmed) || /@.+\.[a-z]{2,}/i.test(trimmed);
}

/**
 * Full display name. Returns "Ma'am" if the user hasn't set one.
 * Example: `<h1>Welcome, {displayName(user)}!</h1>`
 */
export function displayName(input: NameLike): string {
  const name = pickName(input);
  return name || DEFAULT_FALLBACK;
}

/**
 * First name only — for tight headlines.
 * Falls back to "Ma'am" so we never show "there" or "friend".
 * Example: `<h1>Hi {displayFirstName(user)}</h1>`
 */
export function displayFirstName(input: NameLike): string {
  const name = pickName(input);
  if (!name) return DEFAULT_FALLBACK;
  const first = name.split(/\s+/)[0];
  return first || DEFAULT_FALLBACK;
}

/**
 * First initial — for avatar placeholders.
 * Always uppercase, single letter. Defaults to "M" (matches "Ma'am").
 */
export function displayInitial(input: NameLike): string {
  const name = pickName(input);
  if (!name) return "M";
  return name.charAt(0).toUpperCase();
}

/**
 * True when the user has actually entered a name. Useful for showing a
 * "What should we call you?" nudge instead of just labelling them Ma'am.
 */
export function hasUserName(input: NameLike): boolean {
  return pickName(input).length > 0;
}

/**
 * Localized greeting — returns "Namaste {Name}" form so it reads warmly
 * for both rural and urban Indian users. Caller is responsible for
 * picking the verb if they prefer "Hi" / "Hello".
 */
export function namaste(input: NameLike): string {
  return `Namaste, ${displayFirstName(input)}`;
}
