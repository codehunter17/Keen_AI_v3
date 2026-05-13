// Subscription tiers — Indian market, monthly only for v1.
// Razorpay primary. Stripe later for international.

export type Tier = "FREE" | "CARE_49" | "PRO_99";

export const TIER_PRICING: Record<
  Tier,
  { label: string; priceInPaise: number; currency: "INR"; tagline: string }
> = {
  FREE: {
    label: "Free",
    priceInPaise: 0,
    currency: "INR",
    tagline: "Get started — track your cycle, learn your body.",
  },
  CARE_49: {
    label: "Care",
    priceInPaise: 4900,
    currency: "INR",
    tagline: "Daily AI care — chat, reports, meal plans.",
  },
  PRO_99: {
    label: "Pro",
    priceInPaise: 9900,
    currency: "INR",
    tagline: "Everything unlimited + partner access.",
  },
};

// Daily / monthly limits enforced server-side. Reset windows handled in
// lib/usage.ts (FREE = per-day reset; paid = per-month reset).
export const TIER_LIMITS = {
  FREE: {
    aiChatsPerDay: 3,
    reportAnalysesPerMonth: 1,
    nutritionPlanPerMonth: 0,           // not available
    cycleTracking: true,
    pcosScreening: false,
    riskPrediction: false,
    partnerAccess: false,
    exportPdf: false,
    prioritySupport: false,
  },
  CARE_49: {
    aiChatsPerDay: 30,
    reportAnalysesPerMonth: 10,
    nutritionPlanPerMonth: 4,           // weekly regeneration
    cycleTracking: true,
    pcosScreening: true,
    riskPrediction: true,
    partnerAccess: false,
    exportPdf: true,
    prioritySupport: false,
  },
  PRO_99: {
    aiChatsPerDay: Infinity,
    reportAnalysesPerMonth: Infinity,
    nutritionPlanPerMonth: Infinity,
    cycleTracking: true,
    pcosScreening: true,
    riskPrediction: true,
    partnerAccess: true,
    exportPdf: true,
    prioritySupport: true,
  },
} as const satisfies Record<Tier, Record<string, number | boolean>>;

export type TierFeature = keyof (typeof TIER_LIMITS)["FREE"];

export function tierAllows(tier: Tier, feature: TierFeature): boolean {
  const v = TIER_LIMITS[tier][feature];
  return typeof v === "boolean" ? v : v > 0;
}

export function tierLimit(tier: Tier, feature: TierFeature): number {
  const v = TIER_LIMITS[tier][feature];
  return typeof v === "number" ? v : v ? Infinity : 0;
}

export function formatPrice(tier: Tier): string {
  const p = TIER_PRICING[tier];
  if (p.priceInPaise === 0) return "Free";
  return `₹${(p.priceInPaise / 100).toFixed(0)}/mo`;
}
