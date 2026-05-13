"use server";

// Lifecycle server actions — DOB capture, life-stage selection, consent
// recording. The new generic onboarding flow lives here so the legacy
// pregnancy-specific submitOnboarding() can be retired in Week 3.

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ageFromDob, ageBandFromAge, type LifeStage, type CycleStage } from "@/lib/lifecycle";
import { z } from "zod";

const PRIVACY_POLICY_VERSION = "privacy-2026-05-07";
const TERMS_VERSION = "terms-2026-05-07";
const MEDICAL_DISCLAIMER_VERSION = "medical-2026-05-07";

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

// ─── Step 1: capture DOB and confirm 18+ ─────────────────────
const setBasicsSchema = z.object({
  dob: z.string().refine((s) => !isNaN(Date.parse(s)), "Invalid date"),
  countryCode: z.string().length(2).default("IN"),
  languagePref: z.enum(["en", "hi", "ta", "te", "bn", "mr"]).default("en"),
});

export async function setBasics(input: z.infer<typeof setBasicsSchema>) {
  const session = await requireSession();
  const data = setBasicsSchema.parse(input);

  const dob = new Date(data.dob);
  const age = ageFromDob(dob);

  // Hard guard: under-18 can't open a standalone account.
  if (age < 18) {
    return {
      ok: false,
      reason: "MINOR_NOT_ALLOWED",
      message:
        "NutriMama accounts are for users 18 and over. If you are under 18, ask a parent to add you as a dependent profile.",
    } as const;
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      dob,
      age,
      countryCode: data.countryCode,
      languagePref: data.languagePref,
    },
  });

  return { ok: true, age, ageBand: ageBandFromAge(age) } as const;
}

// ─── Step 2: pick life stage + cycle stage ───────────────────
const setLifeStageSchema = z.object({
  lifeStage: z.enum([
    "ADULT_MENSTRUATING",
    "TRYING_TO_CONCEIVE",
    "PREGNANT",
    "POSTPARTUM",
    "PERIMENOPAUSE",
    "MENOPAUSE",
  ]),
  cycleStage: z
    .enum(["MENSTRUATING", "PCOS_SUSPECTED", "PCOS_DIAGNOSED"])
    .optional(),
  // Pregnancy-only
  pregnancyWeek: z.number().int().min(1).max(45).optional(),
  dueDate: z.string().optional(),
});

export async function setLifeStage(input: z.infer<typeof setLifeStageSchema>) {
  const session = await requireSession();
  const data = setLifeStageSchema.parse(input);

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      lifeStage: data.lifeStage as LifeStage,
      cycleStage: (data.cycleStage as CycleStage) ?? null,
      pregnancyStage:
        data.lifeStage === "PREGNANT"
          ? "PREGNANT"
          : data.lifeStage === "POSTPARTUM"
            ? "POST_PARTUM"
            : "PRE_PREGNANT",
      pregnancyWeek: data.pregnancyWeek ?? null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    },
  });

  return { ok: true } as const;
}

// ─── Step 3: optional vitals (used by ML risk model later) ───
const setVitalsSchema = z.object({
  height: z.number().min(80).max(230).optional(),
  weight: z.number().min(25).max(250).optional(),
  dietaryPref: z.enum(["VEGETARIAN", "VEGAN", "NON_VEG"]).optional(),
  regionalPref: z.enum(["INDIAN", "WESTERN", "ASIAN"]).optional(),
});

export async function setVitals(input: z.infer<typeof setVitalsSchema>) {
  const session = await requireSession();
  const data = setVitalsSchema.parse(input);

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      height: data.height,
      weight: data.weight,
      dietaryPref: data.dietaryPref,
      regionalPref: data.regionalPref,
    },
  });
  return { ok: true } as const;
}

// ─── Step 4: consents (DPDP audit trail) ─────────────────────
const acceptConsentsSchema = z.object({
  acceptedTerms: z.literal(true),
  acceptedPrivacy: z.literal(true),
  acceptedMedicalDisclaimer: z.literal(true),
  allowModelTraining: z.boolean(),
});

export async function acceptConsents(
  input: z.infer<typeof acceptConsentsSchema>,
) {
  const session = await requireSession();
  const data = acceptConsentsSchema.parse(input);

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const ua = h.get("user-agent") ?? null;
  const now = new Date();

  // Single transaction so the User flags + audit rows commit together.
  await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: {
        termsAcceptedAt: now,
        privacyAcceptedAt: now,
        medicalDisclaimerAt: now,
        allowModelTraining: data.allowModelTraining,
        allowModelTrainingAt: data.allowModelTraining ? now : null,
      },
    }),
    prisma.consentRecord.create({
      data: {
        userId: session.user.id,
        consentType: "TERMS",
        granted: true,
        method: "CHECKBOX",
        policyVersion: TERMS_VERSION,
        ipAddress: ip,
        userAgent: ua,
      },
    }),
    prisma.consentRecord.create({
      data: {
        userId: session.user.id,
        consentType: "PRIVACY",
        granted: true,
        method: "CHECKBOX",
        policyVersion: PRIVACY_POLICY_VERSION,
        ipAddress: ip,
        userAgent: ua,
      },
    }),
    prisma.consentRecord.create({
      data: {
        userId: session.user.id,
        consentType: "MEDICAL_DISCLAIMER",
        granted: true,
        method: "CHECKBOX",
        policyVersion: MEDICAL_DISCLAIMER_VERSION,
        ipAddress: ip,
        userAgent: ua,
      },
    }),
    prisma.consentRecord.create({
      data: {
        userId: session.user.id,
        consentType: "DATA_TRAINING",
        granted: data.allowModelTraining,
        method: "CHECKBOX",
        policyVersion: PRIVACY_POLICY_VERSION,
        ipAddress: ip,
        userAgent: ua,
      },
    }),
  ]);

  // Award the WELCOME badge once onboarding is complete
  const { awardBadge } = await import("./badges");
  awardBadge("WELCOME").catch(() => {});

  return { ok: true } as const;
}

// ─── Toggle: anonymized data for AI training (DPDP § 7) ──────
// Lets the user withdraw or re-grant the model-training consent
// from Settings. Audit row written each time for DPDP compliance.
export async function setAllowModelTraining(granted: boolean) {
  const session = await requireSession();
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const ua = h.get("user-agent") ?? null;
  const now = new Date();

  await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: {
        allowModelTraining: granted,
        allowModelTrainingAt: granted ? now : null,
      },
    }),
    prisma.consentRecord.create({
      data: {
        userId: session.user.id,
        consentType: "DATA_TRAINING",
        granted,
        method: "TOGGLE",
        policyVersion: PRIVACY_POLICY_VERSION,
        ipAddress: ip,
        userAgent: ua,
        revokedAt: granted ? null : now,
      },
    }),
  ]);

  return { ok: true } as const;
}

// ─── Right-to-erasure (DPDP § 12) ────────────────────────────
// Soft-delete now, hard-purge cron job sweeps after 7 days.
export async function requestAccountDeletion(reason?: string) {
  const session = await requireSession();
  const h = await headers();
  await prisma.consentRecord.create({
    data: {
      userId: session.user.id,
      consentType: "PRIVACY",
      granted: false,
      method: "CHECKBOX",
      policyVersion: PRIVACY_POLICY_VERSION,
      ipAddress: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      userAgent: h.get("user-agent") ?? null,
      revokedAt: new Date(),
      evidenceRef: reason ?? null,
    },
  });
  // TODO: trigger purge job. For v1, mark a deletedAt-style flag on
  // dependents and queue a background cleanup. Wire this in Week 3.
  return { ok: true } as const;
}
