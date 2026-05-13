// Server-side feature guards. Call these at the top of any server action
// that should be gated by lifecycle, tier, or consent state.

import "server-only";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  ageFromDob,
  unlockFeatures,
  type UnlockedFeatures,
} from "@/lib/lifecycle";
import { tierAllows, tierLimit, type Tier, type TierFeature } from "@/lib/tiers";

export class GuardError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

export interface GuardContext {
  userId: string;
  age: number;
  tier: Tier;
  isStaff: boolean;
  features: UnlockedFeatures;
}

export async function requireUser(): Promise<GuardContext> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new GuardError("UNAUTHORIZED", "Please sign in.");

  const u = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      dob: true,
      lifeStage: true,
      cycleStage: true,
      tier: true,
      isStaff: true,
      termsAcceptedAt: true,
    },
  });
  if (!u) throw new GuardError("UNAUTHORIZED", "User not found.");
  if (!u.dob) throw new GuardError("ONBOARDING_REQUIRED", "Finish onboarding first.");
  if (!u.termsAcceptedAt) {
    throw new GuardError("CONSENT_REQUIRED", "Please accept terms to continue.");
  }

  const age = ageFromDob(u.dob);
  const features = unlockFeatures({
    age,
    isDependent: false,
    lifeStage: (u.lifeStage as Parameters<typeof unlockFeatures>[0]["lifeStage"]) ?? undefined,
    cycleStage: (u.cycleStage as Parameters<typeof unlockFeatures>[0]["cycleStage"]) ?? undefined,
  });

  return {
    userId: u.id,
    age,
    tier: (u.tier as Tier) ?? "FREE",
    isStaff: u.isStaff ?? false,
    features,
  };
}

export function requireFeature(ctx: GuardContext, feature: keyof UnlockedFeatures) {
  if (!ctx.features[feature]) {
    throw new GuardError(
      "FEATURE_LOCKED",
      "This feature is not available for your current life stage.",
    );
  }
}

export function requireTier(ctx: GuardContext, feature: TierFeature) {
  if (!tierAllows({ tier: ctx.tier, isStaff: ctx.isStaff }, feature)) {
    throw new GuardError(
      "TIER_UPGRADE_REQUIRED",
      "Upgrade to Care or Pro to use this.",
    );
  }
}

// Per-day / per-month usage check. Caller passes a counter callback so
// we don't bake a specific schema into the guard. Staff users bypass all
// usage caps (tierLimit returns Infinity for them).
export async function requireUsageBudget(
  ctx: GuardContext,
  feature: TierFeature,
  usedSoFar: number,
) {
  const limit = tierLimit({ tier: ctx.tier, isStaff: ctx.isStaff }, feature);
  if (limit === Infinity) return;
  if (usedSoFar >= limit) {
    throw new GuardError(
      "QUOTA_EXCEEDED",
      `You've reached your ${feature} limit for this period. Upgrade for more.`,
    );
  }
}
