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
  if (typeof input === "string") return input.trim();
  return (input.name ?? "").trim();
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
