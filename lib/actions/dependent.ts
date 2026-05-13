"use server";

// Dependent (minor) profile actions. DPDP §9 verifiable-parental-consent
// flow uses Razorpay's ₹1 auth-then-refund pattern. The flow is:
//
//   1. Parent fills out child's name + DOB → startConsentFlow() returns
//      a Razorpay order_id. Frontend opens Razorpay checkout.
//   2. Parent authenticates the ₹1 charge via UPI/card.
//   3. Frontend POSTs payment_id + signature to confirmConsent().
//   4. Server verifies the HMAC signature, creates the DependentProfile,
//      writes a ConsentRecord with method=RAZORPAY_RE1 + evidenceRef,
//      then refunds the ₹1 in the background.

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ageFromDob, ageBandFromAge } from "@/lib/lifecycle";
import {
  createParentalConsentOrder,
  verifyPaymentSignature,
  refundPayment,
} from "@/lib/razorpay";
import { z } from "zod";

const PRIVACY_VERSION = "privacy-2026-05-07";

async function requireAdult() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("UNAUTHORIZED");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, age: true, dob: true },
  });
  if (!user || !user.age || user.age < 18) {
    throw new Error("ADULT_REQUIRED");
  }
  return { session, user };
}

// ─── Step A: start the consent payment flow ─────────────────
const startConsentSchema = z.object({
  firstName: z.string().min(1).max(40),
  dob: z.string().refine((s) => !isNaN(Date.parse(s))),
  relationship: z.enum(["DAUGHTER", "NIECE", "SISTER", "OTHER"]),
});

export async function startConsentFlow(
  input: z.infer<typeof startConsentSchema>,
) {
  const { user } = await requireAdult();
  const data = startConsentSchema.parse(input);

  const dob = new Date(data.dob);
  const age = ageFromDob(dob);
  if (age >= 18) {
    return {
      ok: false,
      reason: "NOT_A_MINOR",
      message: "Dependent profiles are only for users under 18.",
    } as const;
  }
  if (age < 4) {
    return {
      ok: false,
      reason: "TOO_YOUNG",
      message:
        "Profiles for children under 4 are not supported. Children this young should not have personal app profiles.",
    } as const;
  }

  // Stash pending dependent details in the parent's session via a
  // short-lived row. We use ConsentRecord with granted=false as the
  // pending placeholder; confirmConsent flips it to true on success.
  const order = await createParentalConsentOrder({
    parentUserId: user.id,
    dependentName: data.firstName,
  });

  await prisma.consentRecord.create({
    data: {
      userId: user.id,
      consentType: "PARENTAL_VERIFY",
      granted: false,
      method: "RAZORPAY_RE1",
      policyVersion: PRIVACY_VERSION,
      evidenceRef: JSON.stringify({
        order_id: order.id,
        firstName: data.firstName,
        dob: data.dob,
        relationship: data.relationship,
        age,
        ageBand: ageBandFromAge(age),
      }),
    },
  });

  return {
    ok: true,
    razorpayOrderId: order.id,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID ?? "",
    amountInPaise: 100,
  } as const;
}

// ─── Step B: confirm the consent payment ─────────────────────
const confirmConsentSchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export async function confirmConsent(
  input: z.infer<typeof confirmConsentSchema>,
) {
  const { user } = await requireAdult();
  const data = confirmConsentSchema.parse(input);

  const ok = verifyPaymentSignature({
    orderId: data.razorpayOrderId,
    paymentId: data.razorpayPaymentId,
    signature: data.razorpaySignature,
  });
  if (!ok) {
    return { ok: false, reason: "BAD_SIGNATURE" } as const;
  }

  // Find the pending consent record we created at startConsentFlow.
  const pending = await prisma.consentRecord.findFirst({
    where: {
      userId: user.id,
      consentType: "PARENTAL_VERIFY",
      granted: false,
      evidenceRef: { contains: data.razorpayOrderId },
    },
    orderBy: { createdAt: "desc" },
  });
  if (!pending || !pending.evidenceRef) {
    return { ok: false, reason: "NO_PENDING_CONSENT" } as const;
  }

  type Pending = {
    order_id: string;
    firstName: string;
    dob: string;
    relationship: "DAUGHTER" | "NIECE" | "SISTER" | "OTHER";
    age: number;
    ageBand: string;
  };
  const pendingData = JSON.parse(pending.evidenceRef) as Pending;

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const ua = h.get("user-agent") ?? null;

  const dependent = await prisma.$transaction(async (tx) => {
    const dep = await tx.dependentProfile.create({
      data: {
        parentId: user.id,
        firstName: pendingData.firstName,
        dob: new Date(pendingData.dob),
        relationship: pendingData.relationship,
        ageBand: pendingData.ageBand,
      },
    });

    // Mark the pending row as granted + link the dependent for audit.
    await tx.consentRecord.update({
      where: { id: pending.id },
      data: {
        granted: true,
        dependentId: dep.id,
        evidenceRef: data.razorpayPaymentId, // overwrite with the final evidence
        ipAddress: ip,
        userAgent: ua,
      },
    });

    return dep;
  });

  // Refund the ₹1 — fire and forget, errors logged but not surfaced
  // to the user since the consent is already recorded.
  refundPayment(data.razorpayPaymentId).catch((err) => {
    console.error("[razorpay] refund failed", err);
  });

  return { ok: true, dependentId: dependent.id } as const;
}

// ─── Toggle cycle tracking AFTER menarche (parent confirms) ──
export async function setMenarche(input: {
  dependentId: string;
  menarcheDate: string;
}) {
  const { user } = await requireAdult();
  const dep = await prisma.dependentProfile.findFirst({
    where: { id: input.dependentId, parentId: user.id, deletedAt: null },
  });
  if (!dep) return { ok: false, reason: "NOT_FOUND" } as const;

  await prisma.dependentProfile.update({
    where: { id: dep.id },
    data: {
      hasMenarche: true,
      menarcheDate: new Date(input.menarcheDate),
      cycleTrackingEnabled: true,
    },
  });
  return { ok: true } as const;
}

// ─── Right to erasure for the dependent ──────────────────────
export async function deleteDependent(dependentId: string) {
  const { user } = await requireAdult();
  await prisma.dependentProfile.updateMany({
    where: { id: dependentId, parentId: user.id, deletedAt: null },
    data: { deletedAt: new Date() },
  });
  return { ok: true } as const;
}
