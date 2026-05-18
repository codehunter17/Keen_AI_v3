"use server";

// Dependent-profile (minor) server actions.
// - A "dependent" is a child/teen under 18 managed by a parent User account.
// - No standalone login for minors — DPDP Act 2023 compliance.
// - Parent must provide name, DOB, relationship, and confirm parental consent.

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ageFromDob, ageBandFromAge } from "@/lib/lifecycle";
import { createParentalConsentOrder, refundPayment, verifyPaymentSignature } from "@/lib/razorpay";
import { z } from "zod";
import { revalidatePath } from "next/cache";

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

const consentFlowSchema = z.object({
  firstName: z.string().trim().min(1).max(50),
  dob: z.string().refine((s) => !isNaN(Date.parse(s)), "Invalid date"),
  relationship: z.enum(["DAUGHTER", "NIECE", "SISTER", "OTHER"]),
});

export async function startConsentFlow(
  input: z.infer<typeof consentFlowSchema>,
) {
  const session = await requireSession();
  const data = consentFlowSchema.parse(input);

  if (!process.env.RAZORPAY_KEY_ID) {
    return {
      ok: false as const,
      reason: "RAZORPAY_NOT_CONFIGURED",
      message:
        "Payments are not configured. Please contact support or try again later.",
    };
  }

  try {
    const order = await createParentalConsentOrder({
      parentUserId: session.user.id,
      dependentName: data.firstName,
    });

    return {
      ok: true as const,
      razorpayOrderId: order.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amountInPaise: order.amount,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[dependent] startConsentFlow failed:", msg);
    return {
      ok: false as const,
      reason: "RAZORPAY_ERROR",
      message:
        "We couldn't start the payment flow. Please try again in a moment.",
    };
  }
}

const confirmConsentSchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
  firstName: z.string().trim().min(1).max(50),
  dob: z.string().refine((s) => !isNaN(Date.parse(s)), "Invalid date"),
  relationship: z.enum(["DAUGHTER", "NIECE", "SISTER", "OTHER"]),
});

export async function confirmConsent(
  input: z.infer<typeof confirmConsentSchema>,
) {
  const session = await requireSession();
  const data = confirmConsentSchema.parse(input);

  const valid = verifyPaymentSignature({
    orderId: data.razorpayOrderId,
    paymentId: data.razorpayPaymentId,
    signature: data.razorpaySignature,
  });
  if (!valid) {
    return { ok: false as const, reason: "BAD_SIGNATURE", message: "Payment verification failed." };
  }

  try {
    await refundPayment(data.razorpayPaymentId);
  } catch (err) {
    console.error("[dependent] refund failed:", err);
    return {
      ok: false as const,
      reason: "REFUND_FAILED",
      message: "We were unable to refund the ₹1 payment. Please contact support.",
    };
  }

  const dob = new Date(data.dob);
  const age = ageFromDob(dob);
  const ageBand = ageBandFromAge(age);
  const h = await headers();

  const dependent = await prisma.$transaction(async (tx) => {
    const dep = await tx.dependentProfile.create({
      data: {
        parentId: session.user.id,
        firstName: data.firstName,
        dob,
        relationship: data.relationship,
        ageBand,
        hasMenarche: false,
        cycleTrackingEnabled: false,
      },
    });

    await tx.consentRecord.create({
      data: {
        userId: session.user.id,
        dependentId: dep.id,
        consentType: "PARENTAL_VERIFY",
        granted: true,
        method: "RAZORPAY_RE1",
        evidenceRef: data.razorpayPaymentId,
        ipAddress: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
        userAgent: h.get("user-agent") ?? null,
        policyVersion: "parental-consent-2026-05-17",
      },
    });

    return dep;
  });

  revalidatePath("/dashboard/family");
  return { ok: true as const, dependentId: dependent.id };
}

const createDependentSchema = z.object({
  firstName: z.string().trim().min(1).max(50),
  dob: z.string().refine((s) => !isNaN(Date.parse(s)), "Invalid date"),
  relationship: z.enum(["DAUGHTER", "NIECE", "SISTER", "OTHER"]),
  parentalConsentGiven: z.boolean().refine((v) => v === true, {
    message: "Parental consent is required",
  }),
});

export async function createDependentProfile(
  input: z.infer<typeof createDependentSchema>,
) {
  const session = await requireSession();
  const data = createDependentSchema.parse(input);

  const dob = new Date(data.dob);
  const age = ageFromDob(dob);
  const ageBand = ageBandFromAge(age);

  if (age >= 18) {
    return { ok: false, message: "Dependent profiles are only for users under 18." } as const;
  }
  if (age < 4) {
    return { ok: false, message: "NutriMama supports children from age 4." } as const;
  }

  const dependent = await prisma.dependentProfile.create({
    data: {
      parentId: session.user.id,
      firstName: data.firstName,
      dob,
      relationship: data.relationship,
      ageBand,
      hasMenarche: false,
      cycleTrackingEnabled: false,
    },
  });

  const h = await headers();
  await prisma.consentRecord.create({
    data: {
      userId: session.user.id,
      dependentId: dependent.id,
      consentType: "PARENTAL_VERIFY",
      granted: true,
      method: "CHECKBOX",
      policyVersion: "parental-consent-2026-05-17",
      ipAddress: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      userAgent: h.get("user-agent") ?? null,
    },
  });

  revalidatePath("/dashboard/family");
  return { ok: true, id: dependent.id } as const;
}

export async function listDependentProfiles() {
  const session = await requireSession();
  return prisma.dependentProfile.findMany({
    where: { parentId: session.user.id, deletedAt: null },
    orderBy: { dob: "asc" },
    select: {
      id: true,
      firstName: true,
      dob: true,
      relationship: true,
      ageBand: true,
      hasMenarche: true,
      cycleTrackingEnabled: true,
      consentRecord: { select: { granted: true } },
    },
  });
}

export async function getDependentProfile(id: string) {
  const session = await requireSession();
  return prisma.dependentProfile.findFirst({
    where: { id, parentId: session.user.id, deletedAt: null },
    include: { consentRecord: true },
  });
}

const setMenarcheSchema = z.object({
  dependentId: z.string().uuid(),
  menarcheDate: z.string().optional(),
  enableCycleTracking: z.boolean().default(true),
});

export async function setDependentMenarche(
  input: z.infer<typeof setMenarcheSchema>,
) {
  const session = await requireSession();
  const data = setMenarcheSchema.parse(input);

  const dep = await prisma.dependentProfile.findFirst({
    where: { id: data.dependentId, parentId: session.user.id, deletedAt: null },
  });
  if (!dep) return { ok: false, message: "Profile not found" } as const;

  await prisma.dependentProfile.update({
    where: { id: data.dependentId },
    data: {
      hasMenarche: true,
      menarcheDate: data.menarcheDate ? new Date(data.menarcheDate) : new Date(),
      cycleTrackingEnabled: data.enableCycleTracking,
    },
  });

  revalidatePath(`/dashboard/family/${data.dependentId}`);
  return { ok: true } as const;
}

export async function softDeleteDependentProfile(dependentId: string) {
  const session = await requireSession();
  const dep = await prisma.dependentProfile.findFirst({
    where: { id: dependentId, parentId: session.user.id, deletedAt: null },
  });
  if (!dep) return { ok: false, message: "Profile not found" } as const;

  await prisma.dependentProfile.update({
    where: { id: dependentId },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/dashboard/family");
  return { ok: true } as const;
}
