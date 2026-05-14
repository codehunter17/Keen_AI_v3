import "server-only";
import { Resend } from "resend";

// Email helper for transactional sends (verification, password reset, etc).
// Uses Resend (3000/mo free tier — enough for early launch).
//
// Setup once you have an API key:
//   1. Sign up at https://resend.com (2 min)
//   2. Copy your API key → set RESEND_API_KEY in .env / Vercel
//   3. For production: verify your domain at resend.com/domains and set
//      EMAIL_FROM to "NutriMama <hello@yourdomain.com>"
//   4. For dev: leave EMAIL_FROM unset to use the Resend onboarding sender
//
// If RESEND_API_KEY isn't set, every send is logged to the server console
// instead of actually mailing — handy for local dev, and means production
// won't crash if the key is missing (it just locks new signups out, which
// is the safer failure mode than letting them through unverified).

const apiKey = process.env.RESEND_API_KEY?.trim();
const fromAddress = (process.env.EMAIL_FROM ?? "NutriMama <onboarding@resend.dev>").trim();

const resend = apiKey ? new Resend(apiKey) : null;

if (!apiKey && process.env.NODE_ENV === "production") {
  console.warn(
    "[email] RESEND_API_KEY is not set in production — verification emails will NOT be sent and new sign-ups will be blocked from sign-in. Set the key on Vercel to enable.",
  );
}

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(input: SendEmailInput): Promise<{ ok: boolean; reason?: string }> {
  if (!resend) {
    // Dev-mode preview: log instead of send so you can copy the verification
    // link out of the terminal while building locally.
    console.log("[email · dev preview]", {
      to: input.to,
      subject: input.subject,
      preview: input.text?.slice(0, 200) ?? input.html.slice(0, 200),
    });
    return { ok: false, reason: "RESEND_NOT_CONFIGURED" };
  }

  try {
    const result = await resend.emails.send({
      from: fromAddress,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text ?? input.html.replace(/<[^>]+>/g, " "),
    });
    if (result.error) {
      console.error("[email] Resend rejected the send:", result.error);
      return { ok: false, reason: result.error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] Unexpected send failure:", err);
    return { ok: false, reason: err instanceof Error ? err.message : "UNKNOWN" };
  }
}

// ─────────────────────────────────────────────────────────────────────
// Verification email template — short, branded, India-tone.
// ─────────────────────────────────────────────────────────────────────

export function verificationEmail(opts: { name: string; verifyUrl: string }): SendEmailInput {
  const safeName = (opts.name || "there").replace(/[<>&"]/g, "");
  return {
    to: "", // caller fills in
    subject: "Verify your email · NutriMama",
    text: `Hi ${safeName},\n\nWelcome to NutriMama. Please verify your email by clicking the link below — this confirms you own the address and unlocks your account.\n\n${opts.verifyUrl}\n\nIf you didn't sign up, you can safely ignore this email.\n\n— Team NutriMama\nNot medical advice. Always consult a qualified doctor for medical concerns.`,
    html: `<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#1c1c1c;background:#fafaf7;">
  <div style="text-align:center;margin-bottom:32px;">
    <h1 style="font-family:Georgia,serif;font-size:28px;color:#1d5d3a;margin:0;">NutriMama</h1>
  </div>
  <h2 style="font-size:20px;margin:0 0 16px;">Hi ${safeName}, welcome 🌱</h2>
  <p style="font-size:15px;line-height:1.6;color:#444;margin:0 0 24px;">
    One quick step to keep your account secure: please verify the email address
    you signed up with. This confirms you own it and unlocks your dashboard.
  </p>
  <div style="text-align:center;margin:32px 0;">
    <a href="${opts.verifyUrl}"
       style="background:#1d5d3a;color:#fff;text-decoration:none;padding:14px 28px;border-radius:999px;font-weight:600;display:inline-block;font-size:15px;">
      Verify my email →
    </a>
  </div>
  <p style="font-size:13px;line-height:1.6;color:#666;margin:24px 0 0;">
    If the button doesn't work, paste this link into your browser:<br>
    <span style="word-break:break-all;color:#1d5d3a;">${opts.verifyUrl}</span>
  </p>
  <p style="font-size:12px;color:#999;margin:32px 0 0;text-align:center;">
    Didn't sign up? You can safely ignore this — no account will be created.
  </p>
  <hr style="border:0;border-top:1px solid #e5e5e0;margin:32px 0 16px;">
  <p style="font-size:11px;color:#999;text-align:center;line-height:1.5;">
    NutriMama · Made for India · DPDP Act 2023 compliant<br>
    Not medical advice. Always consult a qualified doctor for medical concerns.
  </p>
</body></html>`,
  };
}
