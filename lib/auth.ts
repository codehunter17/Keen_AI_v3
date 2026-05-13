import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

const isGoogleSocialConfigured = Boolean(
  googleClientId &&
  googleClientSecret &&
  googleClientId !== "your-google-client-id-here.apps.googleusercontent.com" &&
  googleClientSecret !== "your-google-client-secret-here"
);

if ((googleClientId && !googleClientSecret) || (!googleClientId && googleClientSecret)) {
  throw new Error(
    "Both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured together for Google social login.\n" +
    "Either set both in your .env file or leave both blank to disable Google social login."
  );
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  user: {
    additionalFields: {
      pregnancyStage: {
        type: "string",
        required: false,
      },
      dietaryPref: {
        type: "string",
        required: false,
      },
      regionalPref: {
        type: "string",
        required: false,
      },
      age: {
        type: "number",
        required: false,
      },
      pregnancyWeek: {
        type: "number",
        required: false,
      },
      dueDate: {
        type: "date",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: isGoogleSocialConfigured
    ? {
        google: {
          clientId: googleClientId!,
          clientSecret: googleClientSecret!,
        },
      }
    : undefined,
});
