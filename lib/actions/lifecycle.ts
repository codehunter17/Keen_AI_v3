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

// ─── Step 1: capture DOB — open to all ages ──────────────────
// NutriMama serves users from birth to old age. Age determines which
// features unlock, not whether you can sign up.
// Under-18: requires a parental-consent checkbox in the UI (DPDP § 9).
// Strip phone-shaped values so we never persist "+91…" as a name.
function isPhoneShaped(s: string): boolean {
  const d = s.replace(/[+\-\s()]/g, "");
  return /^\d{7,15}$/.test(d);
}

const setBasicsSchema = z.object({
  dob: z.string().refine((s) => !isNaN(Date.parse(s)), "Invalid date"),
  countryCode: z.string().length(2).default("IN"),
  languagePref: z.enum(["en", "hi", "ta", "te", "bn", "mr"]).default("en"),
  name: z
    .string()
    .trim()
    .max(60, "Name is too long")
    .optional()
    .transform((v) => (v && !isPhoneShaped(v) ? v : undefined)),
  // Under-18 users must have parental/guardian consent (DPDP Act 2023 § 9).
  // Adults pass this as undefined / true — it is only validated when age < 18.
  parentalConsent: z.boolean().optional(),
});

export async function setBasics(input: z.infer<typeof setBasicsSchema>) {
  const session = await requireSession();
  const data = setBasicsSchema.parse(input);

  const dob = new Date(data.dob);
  const age = ageFromDob(dob);
  const ageBand = ageBandFromAge(age);

  // Under-18: parental consent is mandatory (DPDP Act 2023 § 9).
  if (age < 18 && !data.parentalConsent) {
    return {
      ok: false,
      reason: "PARENTAL_CONSENT_REQUIRED",
      message:
        "A parent or guardian must give consent before a user under 18 can create an account (DPDP Act 2023).",
    } as const;
  }

  // Minimum supported age: 4. Below that we can't serve meaningful content.
  if (age < 4) {
    return {
      ok: false,
      reason: "TOO_YOUNG",
      message: "NutriMama is designed for users aged 4 and above.",
    } as const;
  }

  // Auto-derive lifeStage for children/teens so they never see the adult
  // life-stage picker (which would be confusing / inappropriate).
  let autoLifeStage: LifeStage | null = null;
  if (age >= 4 && age <= 7)  autoLifeStage = "CHILD_4_7";
  if (age >= 8 && age <= 10) autoLifeStage = "CHILD_8_10";
  if (age >= 11 && age <= 13) autoLifeStage = "TEEN_11_13";
  if (age >= 14 && age <= 17) autoLifeStage = "TEEN_14_17";

  // Only write name if the user actually typed one.
  const currentName = (await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  }))?.name?.trim() ?? "";
  const nameToWrite =
    data.name && data.name.length > 0
      ? data.name
      : isPhoneShaped(currentName)
        ? ""
        : undefined;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      dob,
      age,
      countryCode: data.countryCode,
      languagePref: data.languagePref,
      ...(nameToWrite !== undefined ? { name: nameToWrite } : {}),
      // Auto-set life stage for children/teens — skips the step-1 picker.
      ...(autoLifeStage ? { lifeStage: autoLifeStage as LifeStage } : {}),
    },
  });

  return { ok: true, age, ageBand, autoLifeStage } as const;
}

// ─── Step 2: pick life stage + cycle stage ───────────────────
// Accepts all life stages including child/teen — adults pick their own,
// children have theirs auto-set by setBasics() and skip this step.
const setLifeStageSchema = z.object({
  lifeStage: z.enum([
    "CHILD_4_7",
    "CHILD_8_10",
    "TEEN_11_13",
    "TEEN_14_17",
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
  weight: z.number().min(12).max(250).optional(), // 12 kg covers a 4-yr-old child
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
