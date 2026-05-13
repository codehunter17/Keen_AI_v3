// Standardized result shape for server actions.
// Use this instead of throwing strings — gives the client a typed
// `{ ok, code, message }` to render error states cleanly.

import { ZodError } from "zod";
import { GuardError } from "@/lib/guards";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: string; message: string; fields?: Record<string, string> };

/** Wrap a server action body. All thrown errors become ActionResult.failure. */
export async function runAction<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (err) {
    if (err instanceof GuardError) {
      return { ok: false, code: err.code, message: err.message };
    }
    if (err instanceof ZodError) {
      const fields: Record<string, string> = {};
      for (const issue of err.issues) {
        const key = issue.path.join(".") || "_";
        if (!fields[key]) fields[key] = issue.message;
      }
      return {
        ok: false,
        code: "INVALID_INPUT",
        message: "Some fields are invalid.",
        fields,
      };
    }
    if (err instanceof Error) {
      // Recognize a few well-known string codes thrown by older actions
      const known: Record<string, [string, string]> = {
        UNAUTHORIZED: ["UNAUTHORIZED", "Please sign in."],
        ADULT_REQUIRED: ["ADULT_REQUIRED", "This action requires an adult account."],
        ONBOARDING_REQUIRED: ["ONBOARDING_REQUIRED", "Please finish onboarding first."],
        DEPENDENT_NOT_FOUND: ["NOT_FOUND", "Dependent profile not found."],
      };
      const k = known[err.message];
      if (k) return { ok: false, code: k[0], message: k[1] };
      return { ok: false, code: "INTERNAL_ERROR", message: err.message };
    }
    return { ok: false, code: "INTERNAL_ERROR", message: String(err) };
  }
}

/** Tiny helper for client code — throws if not ok, returns data if ok. */
export function unwrap<T>(r: ActionResult<T>): T {
  if (!r.ok) throw new Error(`${r.code}: ${r.message}`);
  return r.data;
}
