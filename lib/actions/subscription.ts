"use server";

// Razorpay subscription orchestration.
//   - createCheckoutOrder() returns an order_id the client opens via Razorpay Checkout.
//   - confirmPayment() verifies the signature and upgrades the user's tier.
//   - The webhook route (app/api/razorpay/webhook) handles renewals + failures.

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import {
  createSubscriptionOrder,
  verifyPaymentSignature,
} from "@/lib/razorpay";
import { TIER_PRICING, type Tier } from "@/lib/tiers";
import { addMonths } from "date-fns";

async function requireUser() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) throw new Error("UNAUTHORIZED");
  return s.user;
}

const checkoutSchema = z.object({
  tier: z.enum(["CARE_49", "PRO_99"]),
  couponCode: z.string().optional(),
});

// Discriminated-union return so we never reach React's production
// "An error occurred in the Server Components render" mask. Every error
// path tells the user (and the dev console) what actually happened.
export type CheckoutOrderResult =
  | {
      ok: true;
      razorpayOrderId: string;
      razorpayKeyId: string;
      amountInPaise: number;
      couponApplied: string | null;
    }
  | {
      ok: false;
      reason:
        | "UNAUTHORIZED"
        | "INVALID_INPUT"
        | "RAZORPAY_NOT_CONFIGURED"
        | "RAZORPAY_NOT_ACTIVATED"
        | "RAZORPAY_AUTH_FAILED"
        | "RAZORPAY_ERROR"
        | "DB_ERROR";
      message: string;
    };

export async function createCheckoutOrder(
  input: z.infer<typeof checkoutSchema>,
): Promise<CheckoutOrderResult> {
  // 1. Auth — gracefully return instead of throwing.
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) {
    return {
      ok: false,
      reason: "UNAUTHORIZED",
      message: "Please sign in to upgrade.",
    };
  }
  const user = s.user;

  // 2. Validate input.
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      reason: "INVALID_INPUT",
      message: "Invalid plan selection.",
    };
  }
  const data = parsed.data;

  let amount = TIER_PRICING[data.tier].priceInPaise;
  let coupon: { code: string; discount: number } | null = null;

  try {
    if (data.couponCode) {
      const c = await prisma.coupon.findUnique({
        where: { code: data.couponCode.toUpperCase() },
      });
      if (
        c &&
        c.active &&
        c.validFrom <= new Date() &&
        c.validUntil >= new Date() &&
        (!c.maxRedemptions || c.redeemedCount < c.maxRedemptions) &&
        (!c.appliesToTier || c.appliesToTier === data.tier)
      ) {
        const discount = c.percentOff
          ? Math.round((amount * c.percentOff) / 100)
          : c.amountOffPaise ?? 0;
        amount = Math.max(100, amount - discount); // never below ₹1
        coupon = { code: c.code, discount };
      }
    }
  } catch (err) {
    console.error("[checkout] coupon lookup failed:", err);
    return {
      ok: false,
      reason: "DB_ERROR",
      message: "Could not verify your coupon. Please try without it.",
    };
  }

  if (!process.env.RAZORPAY_KEY_ID) {
    return {
      ok: false,
      reason: "RAZORPAY_NOT_CONFIGURED",
      message:
        "Payments are not configured. Please use a coupon code instead, or contact support.",
    };
  }

  try {
    const order = await createSubscriptionOrder({
      userId: user.id,
      amountInPaise: amount,
      notes: {
        tier: data.tier,
        coupon: coupon?.code ?? "",
      },
    });
    return {
      ok: true,
      razorpayOrderId: order.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID ?? "",
      amountInPaise: amount,
      couponApplied: coupon?.code ?? null,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[checkout] Razorpay order create failed:", msg);

    // 401 = bad API key/secret pair. Most common cause is the env var was
    // overwritten with the wrong value (e.g., webhook secret got pasted
    // into KEY_SECRET) or the key was rotated in Razorpay dashboard but
    // Vercel still has the old value. Surface this distinctly from KYC.
    if (
      msg.includes(": 401") ||
      msg.toLowerCase().includes("authentication failed") ||
      msg.toLowerCase().includes("api key/secret")
    ) {
      return {
        ok: false,
        reason: "RAZORPAY_AUTH_FAILED",
        message:
          "Payment authentication failed. Our API keys are out of sync — please use a coupon code for now while we fix this.",
      };
    }

    // 400 with "not active" / "KYC" = account-level issue (KYC pending,
    // international not enabled, etc.). User can't fix this themselves;
    // we direct them to coupon path.
    if (
      msg.includes("not active") ||
      msg.includes(": 400") ||
      msg.includes("KYC")
    ) {
      return {
        ok: false,
        reason: "RAZORPAY_NOT_ACTIVATED",
        message:
          "Live payments aren't fully activated yet. Use a coupon code on this page to unlock Pro instantly, or try again later.",
      };
    }

    return {
      ok: false,
      reason: "RAZORPAY_ERROR",
      message:
        "We couldn't reach our payments provider. Please try again in a moment.",
    };
  }
}

const confirmSchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
  tier: z.enum(["CARE_49", "PRO_99"]),
  amountInPaise: z.number().int().positive(),
  couponCode: z.string().nullable().optional(),
});

export async function confirmPayment(input: z.infer<typeof confirmSchema>) {
  const user = await requireUser();
  const data = confirmSchema.parse(input);

  const valid = verifyPaymentSignature({
    orderId: data.razorpayOrderId,
    paymentId: data.razorpayPaymentId,
    signature: data.razorpaySignature,
  });
  if (!valid) return { ok: false as const, reason: "BAD_SIGNATURE" };

  const now = new Date();
  const periodEnd = addMonths(now, 1);

  await prisma.$transaction(async (tx) => {
    await tx.subscription.create({
      data: {
        userId: user.id,
        tier: data.tier,
        status: "ACTIVE",
        provider: "RAZORPAY",
        providerSubId: data.razorpayPaymentId,
        amountInPaise: data.amountInPaise,
        currency: "INR",
        startedAt: now,
        currentPeriodEnd: periodEnd,
        couponCode: data.couponCode ?? null,
      },
    });
    await tx.user.update({
      where: { id: user.id },
      data: {
        tier: data.tier as Tier,
        tierExpiresAt: periodEnd,
      },
    });
    if (data.couponCode) {
      await tx.coupon.update({
        where: { code: data.couponCode.toUpperCase() },
        data: { redeemedCount: { increment: 1 } },
      });
    }
  });

  return { ok: true as const, tier: data.tier, periodEnd };
}

export async function cancelSubscription() {
  const user = await requireUser();
  const sub = await prisma.subscription.findFirst({
    where: { userId: user.id, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });
  if (!sub) return { ok: false as const, reason: "NO_ACTIVE_SUBSCRIPTION" };

  await prisma.subscription.update({
    where: { id: sub.id },
    data: { status: "CANCELED", canceledAt: new Date() },
  });
  // Keep the tier active until currentPeriodEnd; nightly cron downgrades.
  return { ok: true as const, accessUntil: sub.currentPeriodEnd };
}

export async function getMyTier() {
  const user = await requireUser();
  const u = await prisma.user.findUnique({
    where: { id: user.id },
    select: { tier: true, tierExpiresAt: true },
  });
  return {
    tier: (u?.tier ?? "FREE") as Tier,
    expiresAt: u?.tierExpiresAt ?? null,
  };
}

export async function getMySubscription() {
  const user = await requireUser();
  return prisma.subscription.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

// Owner-only redemption: lets the founder/dev grant themselves (or anyone with
// the secret code) a Pro tier without going through Razorpay. Compares against
// OWNER_PRO_CODE env var; on match, sets tier=PRO_99 valid for 12 months.
const redeemSchema = z.object({
  code: z.string().min(1).max(64),
});

export async function redeemOwnerCode(input: z.infer<typeof redeemSchema>) {
  const user = await requireUser();
  const data = redeemSchema.parse(input);

  const ownerCode = process.env.OWNER_PRO_CODE?.trim();
  if (!ownerCode || ownerCode.length < 6) {
    return { ok: false as const, error: "Coupon redemption is not enabled." };
  }
  if (data.code.trim() !== ownerCode) {
    return { ok: false as const, error: "Invalid code." };
  }

  // Owner code redemption grants Pro + the staff bypass flag. Staff are
  // exempt from chat/day caps and feature gates entirely — meant for the
  // founder, devs, and invited beta testers.
  const expires = addMonths(new Date(), 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { tier: "PRO_99", tierExpiresAt: expires, isStaff: true },
  });

  return { ok: true as const, tier: "PRO_99" as Tier, expires };
}
