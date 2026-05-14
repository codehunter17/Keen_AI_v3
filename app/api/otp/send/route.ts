// POST /api/otp/send
// Body: { phone: string }
// Sends an OTP via Twilio Verify to the given phone number.

import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { sendOtp, toE164, isTwilioConfigured } from "@/lib/twilio";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isTwilioConfigured) {
    return NextResponse.json(
      { ok: false, reason: "PHONE_AUTH_DISABLED", message: "Phone sign-in is temporarily unavailable. Use email instead." },
      { status: 503 },
    );
  }

  // 3 sends per phone per 15 minutes to slow abuse + protect Twilio cost.
  // Keyed on IP + phone-prefix so a bad actor can't burn through credit.
  const ipKey = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = rateLimit(`otp:send:${ipKey}`, 6, 15 * 60 * 1000);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, reason: "RATE_LIMITED", message: "Too many requests. Try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: { phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "BAD_JSON" }, { status: 400 });
  }

  const phoneRaw = (body.phone ?? "").toString();
  const phoneE164 = toE164(phoneRaw);
  if (!phoneE164) {
    return NextResponse.json(
      { ok: false, reason: "INVALID_PHONE", message: "Please enter a valid phone number." },
      { status: 400 },
    );
  }

  const result = await sendOtp(phoneE164);
  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        reason: result.reason,
        message:
          result.reason === "INVALID_PHONE"
            ? "Please check your phone number — Twilio couldn't deliver to it."
            : result.reason === "RATE_LIMITED"
              ? "Too many OTP attempts. Wait 10 minutes and try again."
              : "Couldn't send the OTP. Try email sign-in instead.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, phone: phoneE164 });
}
