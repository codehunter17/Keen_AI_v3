import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { sendEmail, verificationEmail } from "@/lib/email";
import { isDisposableEmail, looksFake } from "@/lib/email-blocklist";

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
      // Phone number for phone-OTP users — surfaced so the client can
      // distinguish phone-only signups (whose email is synthetic) and
      // display the phone instead of "+91…@phone.nutrimama.local".
      phoneNumber: {
        type: "string",
        required: false,
      },
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
    // Block sign-in until the email is verified. Prevents fake / typo /
    // throwaway email signups from reaching the dashboard.
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      // Block disposable / obviously-fake addresses before sending. Better
      // Auth has already created the user row at this point — they'll just
      // never receive an email and never be able to verify, which is fine.
      if (isDisposableEmail(user.email) || looksFake(user.email)) {
        console.warn(`[auth] refused to send verification to suspicious address: ${user.email}`);
        return;
      }
      const tmpl = verificationEmail({ name: user.name, verifyUrl: url });
      await sendEmail({ ...tmpl, to: user.email });
    },
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
