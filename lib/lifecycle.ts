// Lifecycle / age-band logic — the spine of age-appropriate feature gating.
// Used by both adult users and dependent (minor) profiles.
//
// India-specific notes baked in:
// - Under 18 = "child" under DPDP Act 2023 → must be a DependentProfile,
//   never a standalone User account.
// - All under-18 features require a verified ConsentRecord of type
//   PARENTAL_VERIFY before unlocking.
// - We never run open-ended LLM generation for minors. They only see
//   curated ContentItem rows; AI may rank/recommend but not author.

export type AgeBand =
  | "BAND_4_7"
  | "BAND_8_10"
  | "BAND_11_13"
  | "BAND_14_17"
  | "ADULT";

export type LifeStage =
  | "CHILD_4_7"
  | "CHILD_8_10"
  | "TEEN_11_13"
  | "TEEN_14_17"
  | "ADULT_MENSTRUATING"
  | "TRYING_TO_CONCEIVE"
  | "PREGNANT"
  | "POSTPARTUM"
  | "PERIMENOPAUSE"
  | "MENOPAUSE";

export type CycleStage =
  | "PRE_MENARCHE"
  | "MENSTRUATING"
  | "PCOS_SUSPECTED"
  | "PCOS_DIAGNOSED";

// ─────────────────────────────────────────────────────────────
// Age helpers
// ─────────────────────────────────────────────────────────────
export function ageFromDob(dob: Date | string, now: Date = new Date()): number {
  const d = typeof dob === "string" ? new Date(dob) : dob;
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

export function ageBandFromAge(age: number): AgeBand {
  if (age < 4) return "BAND_4_7";   // we don't formally support <4 but bucket safely
  if (age <= 7) return "BAND_4_7";
  if (age <= 10) return "BAND_8_10";
  if (age <= 13) return "BAND_11_13";
  if (age <= 17) return "BAND_14_17";
  return "ADULT";
}

export function isMinor(age: number): boolean {
  return age < 18;
}

// ─────────────────────────────────────────────────────────────
// Feature unlocking — the "age is the best factor" idea.
// Returns an object describing what UI surfaces to show.
// ─────────────────────────────────────────────────────────────
export interface UnlockedFeatures {
  // Educational content modules
  safetyEducation: boolean;       // bad-touch / good-touch awareness (parent co-watch)
  pubertyEducation: boolean;      // age 8+ — what's coming
  periodEducation: boolean;       // first-period awareness
  pcosAwareness: boolean;         // 13+
  pregnancyEducation: boolean;    // adult only
  menopauseEducation: boolean;    // 40+

  // Interactive trackers
  cycleTracker: boolean;          // requires menarche=true (or adult)
  pcosScreening: boolean;
  pregnancyMode: boolean;
  fertilityWindow: boolean;
  postpartumCare: boolean;

  // AI surfaces
  curatedContentRecs: boolean;    // ranks ContentItem rows; safe for minors
  freeFormAiChat: boolean;        // Gemini free-form — ADULTS ONLY
  reportAnalysis: boolean;        // ADULTS ONLY
  riskPrediction: boolean;        // ADULTS ONLY (pregnancy or actively trying)

  // Safety
  emergencyContacts: boolean;
}

const NONE: UnlockedFeatures = {
  safetyEducation: false,
  pubertyEducation: false,
  periodEducation: false,
  pcosAwareness: false,
  pregnancyEducation: false,
  menopauseEducation: false,
  cycleTracker: false,
  pcosScreening: false,
  pregnancyMode: false,
  fertilityWindow: false,
  postpartumCare: false,
  curatedContentRecs: false,
  freeFormAiChat: false,
  reportAnalysis: false,
  riskPrediction: false,
  emergencyContacts: false,
};

export interface UnlockInputs {
  age: number;
  isDependent: boolean;            // true if this is a minor under a parent
  hasParentalConsent?: boolean;    // required for any minor feature
  hasMenarche?: boolean;
  lifeStage?: LifeStage;
  cycleStage?: CycleStage;
}

export function unlockFeatures(input: UnlockInputs): UnlockedFeatures {
  const { age, isDependent, hasParentalConsent } = input;

  // A minor with no parental consent gets nothing. Show consent screen instead.
  if (isDependent && !hasParentalConsent) return NONE;

  const f: UnlockedFeatures = { ...NONE };

  // Curated content always on for any signed-in user (parental gate aside)
  f.curatedContentRecs = true;

  // ── Minor branches (all content-only, no free-form AI) ─────
  if (isDependent) {
    // BAND_4_7: bad-touch / personal-safety awareness, parent co-watch
    if (age >= 4 && age <= 7) {
      f.safetyEducation = true;
    }
    // BAND_8_10: still safety + start puberty/period awareness
    if (age >= 8 && age <= 10) {
      f.safetyEducation = true;
      f.pubertyEducation = true;
      f.periodEducation = true;
    }
    // BAND_11_13: full period education + PCOS awareness; tracker if menarche
    if (age >= 11 && age <= 13) {
      f.pubertyEducation = true;
      f.periodEducation = true;
      f.pcosAwareness = true;
      f.cycleTracker = !!input.hasMenarche;
    }
    // BAND_14_17: tracker, PCOS screening (parent reviews results)
    if (age >= 14 && age <= 17) {
      f.periodEducation = true;
      f.pcosAwareness = true;
      f.cycleTracker = !!input.hasMenarche;
      f.pcosScreening = !!input.hasMenarche;
    }
    // Minors NEVER get: freeFormAiChat, reportAnalysis, riskPrediction.
    return f;
  }

  // ── Adult branches ─────────────────────────────────────────
  f.freeFormAiChat = true;
  f.reportAnalysis = true;
  f.cycleTracker = true;
  f.pcosScreening = true;
  f.pcosAwareness = true;
  f.periodEducation = true;
  f.pubertyEducation = true;
  f.emergencyContacts = true;

  switch (input.lifeStage) {
    case "TRYING_TO_CONCEIVE":
      f.fertilityWindow = true;
      break;
    case "PREGNANT":
      f.pregnancyMode = true;
      f.pregnancyEducation = true;
      f.riskPrediction = true;
      break;
    case "POSTPARTUM":
      f.postpartumCare = true;
      f.pregnancyEducation = true;
      break;
    case "PERIMENOPAUSE":
    case "MENOPAUSE":
      f.menopauseEducation = true;
      break;
  }

  return f;
}

// Convenience: which content topics should the recommender draw from?
export function contentTopicsForUser(input: UnlockInputs): string[] {
  const f = unlockFeatures(input);
  const topics: string[] = [];
  if (f.safetyEducation) topics.push("safety");
  if (f.pubertyEducation) topics.push("puberty");
  if (f.periodEducation) topics.push("period");
  if (f.pcosAwareness) topics.push("pcos");
  if (f.pregnancyEducation) topics.push("pregnancy");
  if (f.fertilityWindow) topics.push("fertility");
  if (f.postpartumCare) topics.push("postpartum");
  if (f.menopauseEducation) topics.push("menopause");
  topics.push("nutrition", "mentalhealth"); // universal
  return topics;
}
