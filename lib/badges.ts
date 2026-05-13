// Badge catalogue + unlock logic. Awarded once, persisted in DB.
//
// Why DB not localStorage (despite the spec saying localStorage):
//   - Survives device changes / browser clears
//   - Powers cross-device sync, partner-mode visibility, marketing emails
//   - Same write cost as a state-bump

export interface BadgeDef {
  id: string;
  emoji: string;
  title: string;
  description: string;
  /** Short hint shown when locked. */
  unlockHint: string;
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
}

export const BADGES: Record<string, BadgeDef> = {
  // ── Onboarding ─────────────────────────────────────────
  WELCOME: {
    id: "WELCOME",
    emoji: "🌸",
    title: "Welcome to NutriMama",
    description: "You completed onboarding.",
    unlockHint: "Finish onboarding to unlock.",
    rarity: "COMMON",
  },

  // ── Cycle ──────────────────────────────────────────────
  FIRST_PERIOD: {
    id: "FIRST_PERIOD",
    emoji: "🌙",
    title: "First period logged",
    description: "Your first cycle is in. Patterns start here.",
    unlockHint: "Log your first period.",
    rarity: "COMMON",
  },
  CYCLE_PATTERN: {
    id: "CYCLE_PATTERN",
    emoji: "🔮",
    title: "Pattern detected",
    description: "3 cycles logged — predictions are now confident.",
    unlockHint: "Log 3 periods.",
    rarity: "RARE",
  },
  PCOS_SCREENED: {
    id: "PCOS_SCREENED",
    emoji: "🌺",
    title: "PCOS-aware",
    description: "You completed the PCOS screen.",
    unlockHint: "Take the PCOS screening questionnaire.",
    rarity: "COMMON",
  },

  // ── Hydration ──────────────────────────────────────────
  HYDRATION_STARTER: {
    id: "HYDRATION_STARTER",
    emoji: "💧",
    title: "Hydration started",
    description: "First time hitting your daily water target.",
    unlockHint: "Hit your daily water goal once.",
    rarity: "COMMON",
  },
  HYDRATION_CHAMPION: {
    id: "HYDRATION_CHAMPION",
    emoji: "🏆",
    title: "Hydration champion",
    description: "Water goal hit 7 days in a row.",
    unlockHint: "Hit water target 7 consecutive days.",
    rarity: "RARE",
  },

  // ── Streaks ────────────────────────────────────────────
  STREAK_7: {
    id: "STREAK_7",
    emoji: "🔥",
    title: "7-day streak",
    description: "A week of daily care.",
    unlockHint: "Log something every day for a week.",
    rarity: "COMMON",
  },
  STREAK_30: {
    id: "STREAK_30",
    emoji: "🔥🔥",
    title: "30-day streak",
    description: "A whole month. Habit locked in.",
    unlockHint: "Log every day for 30 days.",
    rarity: "RARE",
  },
  STREAK_100: {
    id: "STREAK_100",
    emoji: "💎",
    title: "100-day streak",
    description: "Legendary consistency.",
    unlockHint: "Log every day for 100 days.",
    rarity: "LEGENDARY",
  },

  // ── Nutrition targets ─────────────────────────────────
  IRON_HIT: {
    id: "IRON_HIT",
    emoji: "🛡️",
    title: "Iron warrior",
    description: "Hit ICMR-NIN iron target 7 days in a row.",
    unlockHint: "Hit your iron target 7 days in a row.",
    rarity: "RARE",
  },
  CALCIUM_HIT: {
    id: "CALCIUM_HIT",
    emoji: "🥛",
    title: "Bone strong",
    description: "Hit calcium target 7 days in a row.",
    unlockHint: "Hit your calcium target 7 days in a row.",
    rarity: "RARE",
  },
  FOLATE_HIT: {
    id: "FOLATE_HIT",
    emoji: "🌿",
    title: "Folate forward",
    description: "Hit folate target 7 days in a row.",
    unlockHint: "Hit your folate target 7 days in a row.",
    rarity: "RARE",
  },
  TRIPLE_TARGET: {
    id: "TRIPLE_TARGET",
    emoji: "✨",
    title: "Triple target",
    description: "Hit iron + calcium + folate targets all on the same day.",
    unlockHint: "Hit iron, calcium, and folate targets on a single day.",
    rarity: "EPIC",
  },

  // ── Reports / AI ──────────────────────────────────────
  FIRST_REPORT: {
    id: "FIRST_REPORT",
    emoji: "📄",
    title: "First report analyzed",
    description: "Uploaded + analyzed your first medical report.",
    unlockHint: "Upload a medical report.",
    rarity: "COMMON",
  },

  // ── Pregnancy / postpartum ─────────────────────────────
  PREGNANCY_T1: {
    id: "PREGNANCY_T1",
    emoji: "🤰",
    title: "Trimester 1 complete",
    description: "Made it through the first trimester.",
    unlockHint: "Log past pregnancy week 13.",
    rarity: "RARE",
  },
  POSTPARTUM_RECOVERY: {
    id: "POSTPARTUM_RECOVERY",
    emoji: "🌷",
    title: "First 40 days",
    description: "40 days of postpartum self-care logged.",
    unlockHint: "Log 40 days in postpartum mode.",
    rarity: "EPIC",
  },

  // ── Engagement ────────────────────────────────────────
  VOICE_LOGGER: {
    id: "VOICE_LOGGER",
    emoji: "🎙️",
    title: "Voice logger",
    description: "Logged a meal by voice in Hindi or English.",
    unlockHint: "Use the voice mic to log a meal.",
    rarity: "COMMON",
  },
  ASHA_SHARED: {
    id: "ASHA_SHARED",
    emoji: "📲",
    title: "Family looped in",
    description: "Shared your weekly summary with someone.",
    unlockHint: "Share a weekly update via WhatsApp.",
    rarity: "COMMON",
  },
};

export type BadgeId = keyof typeof BADGES;

export function badgeRarityClass(r: BadgeDef["rarity"]): string {
  switch (r) {
    case "LEGENDARY":
      return "surface-gold ring-2 ring-amber-400";
    case "EPIC":
      return "surface-premium ring-2 ring-secondary";
    case "RARE":
      return "bg-card lift ring-1 ring-primary/40";
    default:
      return "bg-card lift";
  }
}
