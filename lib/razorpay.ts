// Razorpay client + helpers.
// Used for two completely different purposes:
//
//   1. Subscriptions (₹49 Care, ₹99 Pro) — standard Razorpay Subscriptions API.
//   2. Verifiable Parental Consent — DPDP Section 9 requires "verifiable" consent
//      before processing a child's data. The accepted Indian industry pattern
//      is a ₹1 (or smaller) authenticated payment from the parent's UPI/card,
//      because Razorpay enforces KYC on the funding instrument. We capture
//      then immediately refund. The Razorpay payment_id is the audit evidence
//      we store in ConsentRecord.evidenceRef.

import "server-only";

type RzpFetch = (path: string, init?: RequestInit) => Promise<Response>;

const KEY_ID = process.env.RAZORPAY_KEY_ID ?? "";
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? "";

// One-shot startup warnings. Surface missing config loudly so it's spotted
// during dev/deploy rather than at the moment of a paying user's webhook.
if (typeof process !== "undefined" && !process.env.RAZORPAY_KEY_ID) {
  console.warn(
    "[razorpay] RAZORPAY_KEY_ID is not set — checkout will fail. Set it in your environment.",
  );
}
if (typeof process !== "undefined" && !process.env.RAZORPAY_WEBHOOK_SECRET) {
  console.warn(
    "[razorpay] RAZORPAY_WEBHOOK_SECRET is not set — initial upgrades still work via client-side signature, but monthly auto-renewals will not be processed. Set it once webhooks are registered in the Razorpay dashboard.",
  );
}

function authHeader(): string {
  return "Basic " + Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");
}

const rzp: RzpFetch = (path, init = {}) =>
  fetch(`https://api.razorpay.com/v1${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      authorization: authHeader(),
      ...(init.headers ?? {}),
    },
  });

export interface CreatedOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

// ─────────────────────────────────────────────────────────────
// Verifiable parental consent — ₹1 auth + auto-refund
// ─────────────────────────────────────────────────────────────
export async function createParentalConsentOrder(opts: {
  parentUserId: string;
  dependentName: string;
}): Promise<CreatedOrder> {
  if (!KEY_ID) throw new Error("Razorpay not configured");
  const res = await rzp("/orders", {
    method: "POST",
    body: JSON.stringify({
      amount: 100, // 100 paise = ₹1
      currency: "INR",
      // Razorpay caps `receipt` at 40 chars. UUID alone is 36, so we slice it.
      receipt: `pc_${opts.parentUserId.slice(0, 8)}_${Date.now()}`,
      notes: {
        purpose: "PARENTAL_CONSENT",
        parent: opts.parentUserId,
        dependent: opts.dependentName,
      },
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Razorpay order failed: ${res.status} ${body.slice(0, 300)}`);
  }
  return (await res.json()) as CreatedOrder;
}

export async function refundPayment(paymentId: string): Promise<void> {
  if (!KEY_ID) throw new Error("Razorpay not configured");
  const res = await rzp(`/payments/${paymentId}/refund`, {
    method: "POST",
    body: JSON.stringify({ speed: "optimum" }),
  });
  if (!res.ok && res.status !== 400 /* already refunded */) {
    throw new Error(`Razorpay refund failed: ${res.status}`);
  }
}

// ─────────────────────────────────────────────────────────────
// Subscription orders for paid tiers
// ─────────────────────────────────────────────────────────────
export async function createSubscriptionOrder(opts: {
  userId: string;
  amountInPaise: number;
  notes?: Record<string, string>;
}): Promise<CreatedOrder> {
  if (!KEY_ID) throw new Error("Razorpay not configured");
  const requestBody = {
    amount: opts.amountInPaise,
    currency: "INR",
    // Razorpay caps `receipt` at 40 chars. UUID alone is 36, so we slice it.
    receipt: `sub_${opts.userId.slice(0, 8)}_${Date.now()}`,
    notes: { purpose: "SUBSCRIPTION", user: opts.userId, ...opts.notes },
  };
  const res = await rzp("/orders", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    // Full log goes to Vercel function logs so we can diagnose:
    //   - 400 with "BAD_REQUEST_ERROR" + "international cards not enabled" → KYC pending
    //   - 401 → wrong keys / test vs live mismatch
    //   - 400 with "amount" complaint → amount below Razorpay floor (₹1 = 100 paise)
    console.error(
      "[razorpay] order create failed",
      JSON.stringify({
        status: res.status,
        statusText: res.statusText,
        body: body.slice(0, 1000),
        request: {
          amount: requestBody.amount,
          currency: requestBody.currency,
          receipt: requestBody.receipt,
        },
        keyIdSuffix: KEY_ID.slice(-6),
      }),
    );
    throw new Error(`Razorpay order failed: ${res.status} ${body.slice(0, 300)}`);
  }
  return (await res.json()) as CreatedOrder;
}

// HMAC-SHA256 webhook signature verification.
// Razorpay sends the raw body + an `x-razorpay-signature` header.
import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string,
): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signatureHeader, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

// Verify a payment's signature (returned to client after successful auth)
export function verifyPaymentSignature(opts: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!KEY_SECRET) return false;
  const expected = createHmac("sha256", KEY_SECRET)
    .update(`${opts.orderId}|${opts.paymentId}`)
    .digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(opts.signature, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
