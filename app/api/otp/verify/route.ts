// POST /api/otp/verify
// Body: { phone: string, code: string }
//
// Checks the OTP against Twilio Verify. On success:
//   1. Find or create a User row with this phone number
//   2. Sign them in via Better Auth (synthetic email + deterministic
//      password under the hood — see lib/phone-auth.ts)
//   3. Set the better-auth session cookie on the response
//   4. Tell the client where to go next (onboarding vs dashboard)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { verifyOtp, toE164, isTwilioConfigured } from "@/lib/twilio";
import {
  syntheticEmailForPhone,
  derivePhonePassword,
} from "@/lib/phone-auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isTwilioConfigured) {
    return NextResponse.json(
      { ok: false, reason: "PHONE_AUTH_DISABLED" },
      { status: 503 },
    );
  }

  // Aggressive rate-limit on verify — brute-force protection.
  const ipKey = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = rateLimit(`otp:verify:${ipKey}`, 10, 15 * 60 * 1000);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, reason: "RATE_LIMITED", message: "Too many attempts. Wait 15 minutes." },
      { status: 429 },
    );
  }

  let body: { phone?: string; code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "BAD_JSON" }, { status: 400 });
  }

  const phoneE164 = toE164((body.phone ?? "").toString());
  const code = (body.code ?? "").toString().trim();
  if (!phoneE164 || !/^\d{4,8}$/.test(code)) {
    return NextResponse.json(
      { ok: false, reason: "INVALID_INPUT" },
      { status: 400 },
    );
  }

  // 1. Verify the OTP with Twilio.
  const check = await verifyOtp(phoneE164, code);
  if (!check.ok) {
    return NextResponse.json(
      {
        ok: false,
        reason: check.reason,
        message:
          check.reason === "EXPIRED_OR_NO_PENDING"
            ? "This code expired. Send a new one and try again."
            : "Wrong code. Check the SMS and try once more.",
      },
      { status: 401 },
    );
  }

  // 2. Find or create the user. Two cases:
  //    (a) Existing email user adds phone — phoneNumber matches existing row
  //    (b) Brand-new phone-only user — create synthetic-email row
  const synthEmail = syntheticEmailForPhone(phoneE164);
  const password = derivePhonePassword(phoneE164);

  let user = await prisma.user.findFirst({
    where: { phoneNumber: phoneE164 },
    select: { id: true, email: true, dob: true, lifeStage: true, termsAcceptedAt: true },
  });

  let isNewSignup = false;

  if (!user) {
    // Brand-new phone signup. Create the user via Better Auth so the
    // password is bcrypt-hashed and the auth machinery is happy.
    // The synthetic email is never displayed to the user — it's just
    // a stable handle for Better Auth's email/password flow internally.
    try {
      await auth.api.signUpEmail({
        body: {
          email: synthEmail,
          password,
          name: phoneE164, // temp; user can update in onboarding
        },
      });
    } catch (err) {
      // If signup fails because the row already exists (race), fall through
      // to find-then-update below.
      console.warn("[otp/verify] signUpEmail bounce:", (err as Error).message);
    }
    user = await prisma.user.findFirst({
      where: { OR: [{ phoneNumber: phoneE164 }, { email: synthEmail }] },
      select: { id: true, email: true, dob: true, lifeStage: true, termsAcceptedAt: true },
    });
    if (!user) {
      return NextResponse.json(
        { ok: false, reason: "USER_CREATE_FAILED" },
        { status: 500 },
      );
    }
    // Attach phone fields. emailVerified=true because Twilio confirmed
    // they own the phone — this also unblocks Better Auth's
    // requireEmailVerification gate for this synthetic email row.
    await prisma.user.update({
      where: { id: user.id },
      data: {
        phoneNumber: phoneE164,
        phoneVerified: true,
        phoneVerifiedAt: new Date(),
        emailVerified: true,
      },
    });
    isNewSignup = true;
  } else {
    // Existing user signing in via phone — refresh the verification stamp.
    await prisma.user.update({
      where: { id: user.id },
      data: { phoneVerified: true, phoneVerifiedAt: new Date() },
    });
  }

  // 3. Issue a Better Auth session. signInEmail returns a Set-Cookie
  // header on the underlying response; we forward it on ours.
  const signInResult = await auth.api.signInEmail({
    body: { email: user.email, password },
    returnHeaders: true,
  });

  const res = NextResponse.json({
    ok: true,
    isNewSignup,
    needsOnboarding: !user.dob || !user.lifeStage || !user.termsAcceptedAt,
  });

  // Forward the auth cookie. Better Auth wraps the response in a Headers
  // object on `returnHeaders: true`.
  const cookieHeader = signInResult.headers.get("set-cookie");
  if (cookieHeader) res.headers.append("set-cookie", cookieHeader);

  return res;
}
