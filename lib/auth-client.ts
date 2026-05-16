import { createAuthClient } from "better-auth/react";

// In the browser an empty baseURL makes Better Auth use the current origin
// (correct on Vercel previews, prod, and local dev — no env required).
// On the server we require an explicit URL in prod, falling back to localhost
// only during `next dev` so previews/prod never silently call localhost.
const resolvedBaseURL = (() => {
  if (typeof window !== "undefined") return "";
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.NODE_ENV === "production") {
    // Vercel sets VERCEL_URL automatically for previews; use it as a safety net.
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
})();

export const authClient = createAuthClient({
  baseURL: resolvedBaseURL,
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
      },
      pregnancyStage: {
        type: "string",
      },
      dietaryPref: {
        type: "string",
      },
      regionalPref: {
        type: "string",
      },
      age: {
        type: "number",
      },
      pregnancyWeek: {
        type: "number",
      },
      dueDate: {
        type: "date",
      },
    },
  },
});

export const isGithubSocialEnabled = process.env.NEXT_PUBLIC_GITHUB_SOCIAL_ENABLED === "true";
export const isGoogleSocialEnabled = process.env.NEXT_PUBLIC_GOOGLE_SOCIAL_ENABLED === "true";
export const { signIn, signUp, signOut, useSession } = authClient;
