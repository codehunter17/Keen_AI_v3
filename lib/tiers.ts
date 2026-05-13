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
//
// Tier strategy (locked in 2026-05-14):
//   FREE:     basics only — 5 AI chats/day, cycle + daily-log, curated content
//   CARE_49:  more depth — 10 chats/day, report analysis, PCOS screen, ML risk, meal plans, PDF
//   PRO_99:   full access — 15 chats/day, unlimited everything else, partner access, priority support
//   isStaff:  unlimited everything (admin/dev bypass, set via OWNER_PRO_CODE)
export const TIER_LIMITS = {
  FREE: {
    aiChatsPerDay: 5,
    reportAnalysesPerMonth: 0,          // not available — must upgrade
    nutritionPlanPerMonth: 0,           // not available
    cycleTracking: true,
    dailyWellnessLog: true,             // sleep / mood / water / movement
    curatedContent: true,               // blog, learn, remedies (read-only)
    pcosScreening: false,
    riskPrediction: false,
    mealPlans: false,
    reportAnalysis: false,
    partnerAccess: false,
    exportPdf: false,
    prioritySupport: false,
  },
  CARE_49: {
    aiChatsPerDay: 10,
    reportAnalysesPerMonth: 5,
    nutritionPlanPerMonth: 4,           // weekly regeneration
    cycleTracking: true,
    dailyWellnessLog: true,
    curatedContent: true,
    pcosScreening: true,
    riskPrediction: true,
    mealPlans: true,
    reportAnalysis: true,
    partnerAccess: false,
    exportPdf: true,
    prioritySupport: false,
  },
  PRO_99: {
    aiChatsPerDay: 15,
    reportAnalysesPerMonth: Infinity,
    nutritionPlanPerMonth: Infinity,
    cycleTracking: true,
    dailyWellnessLog: true,
    curatedContent: true,
    pcosScreening: true,
    riskPrediction: true,
    mealPlans: true,
    reportAnalysis: true,
    partnerAccess: true,
    exportPdf: true,
    prioritySupport: true,
  },
} as const satisfies Record<Tier, Record<string, number | boolean>>;

export type TierFeature = keyof (typeof TIER_LIMITS)["FREE"];

// Identity for tier checks. `isStaff` is the founder/dev bypass — staff
// always pass every gate and have effectively unlimited quotas.
export interface TierIdentity {
  tier: Tier;
  isStaff?: boolean;
}

export function tierAllows(
  tierOrId: Tier | TierIdentity,
  feature: TierFeature,
): boolean {
  const id = typeof tierOrId === "string" ? { tier: tierOrId } : tierOrId;
  if (id.isStaff) return true;
  const v = TIER_LIMITS[id.tier][feature];
  return typeof v === "boolean" ? v : v > 0;
}

export function tierLimit(
  tierOrId: Tier | TierIdentity,
  feature: TierFeature,
): number {
  const id = typeof tierOrId === "string" ? { tier: tierOrId } : tierOrId;
  if (id.isStaff) return Infinity;
  const v = TIER_LIMITS[id.tier][feature];
  return typeof v === "number" ? v : v ? Infinity : 0;
}

export function formatPrice(tier: Tier): string {
  const p = TIER_PRICING[tier];
  if (p.priceInPaise === 0) return "Free";
  return `₹${(p.priceInPaise / 100).toFixed(0)}/mo`;
}
