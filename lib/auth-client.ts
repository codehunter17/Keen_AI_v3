import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  user: {
    additionalFields: {
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
