// Computes the "phase payload" — exact nutrient targets + biological state
// that the AI MUST anchor every reply to. This is what enforces zero
// generalization: when the model has hard numbers, it can't fall back on
// "eat a balanced diet."
//
// Sources baked in:
//   - ICMR-NIN RDA 2020 (already in lib/medical-kb.ts)
//   - WHO ANC 2016
//   - Standard fertility cycle math (28-day average, 14-day luteal, 6-day fertile window)

import { ICMR_RDA } from "@/lib/medical-kb";
import { calcBmi } from "@/lib/bmi";

export type CyclePhase =
  | "MENSTRUAL"     // days 1-5
  | "FOLLICULAR"    // days 6-13
  | "OVULATORY"     // days 14-15
  | "LUTEAL"        // days 16-28
  | "UNKNOWN";

export interface PhasePayload {
  // Identity
  name: string | null;
  age: number | null;
  diet: string | null;
  region: string | null;
  // Biological state
  lifeStage: string | null;
  pregnancyWeek: number | null;
  trimester: "T1" | "T2" | "T3" | null;
  cyclePhase: CyclePhase;
  cycleDay: number | null;
  // Vitals — passed straight from the User record so the AI never has to ask
  vitals: {
    heightCm: number | null;
    weightKg: number | null;
    bmi: number | null;
    bmiCategory: string | null;
    sleepHours: number | null;
    movementMinPerDay: number | null;
    physicalActivity: string | null;       // "low" | "moderate" | "high"
    supplements: string | null;
    previousPregnancies: number | null;
    smokeAlcohol: string | null;
    friedFoods: string | null;
    sugaryFoods: string | null;
    waterIntakeL: number | null;           // self-reported habitual intake
  };
  // Calculated ICMR-NIN nutrient targets
  targets: {
    iron_mg: number | null;
    calcium_mg: number | null;
    folate_mcg: number | null;
    protein_g: number | null;
    DHA_mg: number | null;
    water_l: number | null;
  };
  // Last logged data
  lastLog: {
    waterGlasses: number;
    mood: string | null;
    activity: string | null;
  };
  // Recent meals (last 3 days) so AI can answer "what did I eat today"
  recentMeals: {
    date: string;
    meals: unknown;            // raw JSON shape — AI can read it
    symptoms: unknown;
  }[];
  // Recent symptom screens (PCOS, etc.) keyed by category
  recentScreens: {
    category: string;          // e.g. "PCOS"
    risk: string | null;       // LOW/MODERATE/HIGH
    insight: string | null;
    date: string;
  }[];
  // Recent flagged report findings (verbatim from RAG)
  flaggedFindings: string[];
  // Full report summaries for richer Q&A about uploaded reports
  reportSummaries: {
    fileName: string;
    analyzedAt: string | null;
    summary: string;
  }[];
}

export function computeTrimester(week: number | null): "T1" | "T2" | "T3" | null {
  if (!week) return null;
  if (week <= 13) return "T1";
  if (week <= 27) return "T2";
  return "T3";
}

export function computeCyclePhase(
  cycleDay: number | null,
): { phase: CyclePhase; cycleDay: number | null } {
  if (cycleDay == null) return { phase: "UNKNOWN", cycleDay: null };
  const d = ((cycleDay - 1) % 28) + 1; // normalize to 1..28
  if (d <= 5) return { phase: "MENSTRUAL", cycleDay: d };
  if (d <= 13) return { phase: "FOLLICULAR", cycleDay: d };
  if (d <= 15) return { phase: "OVULATORY", cycleDay: d };
  return { phase: "LUTEAL", cycleDay: d };
}

interface TargetsInput {
  age: number | null;
  lifeStage: string | null;
  pregnancyWeek: number | null;
}

export function computeTargets(input: TargetsInput): PhasePayload["targets"] {
  const tri = computeTrimester(input.pregnancyWeek);
  const age = input.age ?? null;
  const ls  = input.lifeStage ?? "";

  // ── Children 4–12 ────────────────────────────────────────────────────────
  // ICMR-NIN RDA 2020. Calorie + protein scale with age band;
  // iron / calcium are critically high relative to body size.
  if (ls === "CHILD_4_7" || (age != null && age >= 4 && age <= 7)) {
    const r = age != null && age >= 6 ? ICMR_RDA.child_7_9 : ICMR_RDA.child_4_6;
    return {
      iron_mg: r.iron_mg,
      calcium_mg: r.calcium_mg,
      folate_mcg: r.folate_mcg,
      protein_g: r.protein_g,
      DHA_mg: null,
      water_l: r.water_l,
    };
  }
  if (ls === "CHILD_8_10" || (age != null && age >= 8 && age <= 10)) {
    const r = ICMR_RDA.child_7_9;
    return {
      iron_mg: r.iron_mg,
      calcium_mg: r.calcium_mg,
      folate_mcg: r.folate_mcg,
      protein_g: r.protein_g,
      DHA_mg: null,
      water_l: r.water_l,
    };
  }
  // 11-12: use child_10_12 (bridge between child and teen)
  if (age != null && age >= 11 && age <= 12) {
    const r = ICMR_RDA.child_10_12;
    return {
      iron_mg: r.iron_mg,
      calcium_mg: r.calcium_mg,
      folate_mcg: r.folate_mcg,
      protein_g: r.protein_g,
      DHA_mg: null,
      water_l: r.water_l,
    };
  }

  // ── Pregnant ─────────────────────────────────────────────────────────────
  if (ls === "PREGNANT" && tri) {
    const r = ICMR_RDA.pregnant;
    return {
      iron_mg: r.iron_mg[tri],
      calcium_mg: r.calcium_mg[tri],
      folate_mcg: r.folate_mcg,
      protein_g: r.protein_g[tri],
      DHA_mg: r.DHA_mg[tri],
      water_l: 3.0,
    };
  }

  // ── Postpartum / nursing ─────────────────────────────────────────────────
  if (ls === "POSTPARTUM") {
    const r = ICMR_RDA.postpartum;
    return {
      iron_mg: r.iron_mg,
      calcium_mg: r.calcium_mg,
      folate_mcg: 500,
      protein_g: 71,
      DHA_mg: r.DHA_mg,
      water_l: r.water_L,
    };
  }

  // ── Teens 13–17 ──────────────────────────────────────────────────────────
  if (ls.startsWith("TEEN") || (age != null && age >= 13 && age <= 17)) {
    const r = ICMR_RDA.teen_13_17;
    return {
      iron_mg: r.iron_mg,
      calcium_mg: r.calcium_mg,
      folate_mcg: r.folate_mcg,
      protein_g: r.protein_g,
      DHA_mg: null,
      water_l: 2.5,
    };
  }

  // ── Menopause / perimenopause ────────────────────────────────────────────
  if (ls === "MENOPAUSE" || ls === "PERIMENOPAUSE" || (age != null && age >= 45)) {
    const r = ICMR_RDA.menopause;
    return {
      iron_mg: 21,
      calcium_mg: r.calcium_mg,
      folate_mcg: 400,
      protein_g: r.protein_g,
      DHA_mg: null,
      water_l: 2.5,
    };
  }

  // ── Default adult (menstruating, TTC, PCOS) ───────────────────────────────
  const r = ICMR_RDA.adult_18_45;
  return {
    iron_mg: r.iron_mg,
    calcium_mg: r.calcium_mg,
    folate_mcg: r.folate_mcg,
    protein_g: r.protein_g,
    DHA_mg: null,
    water_l: 2.5,
  };
}

/** Render the payload as a compact text block embedded in the system prompt.
 *  Reading guide for the LLM is hardcoded into the directives — every field
 *  below is something the AI is allowed to use directly without asking the
 *  user. If a value is "not_recorded" the AI may suggest the user log it. */
export function payloadToSystemContext(p: PhasePayload): string {
  const targetsLines = Object.entries(p.targets)
    .filter(([, v]) => v != null)
    .map(([k, v]) => `  ${k}: ${v}`)
    .join("\n");

  const v = p.vitals;
  const vitalsLines = [
    `  height_cm: ${v.heightCm ?? "not_recorded"}`,
    `  weight_kg: ${v.weightKg ?? "not_recorded"}`,
    v.bmi != null
      ? `  bmi: ${v.bmi} (${v.bmiCategory ?? "unclassified"})`
      : "  bmi: not_recorded",
    `  sleep_hours_typical: ${v.sleepHours ?? "not_recorded"}`,
    `  movement_min_per_day: ${v.movementMinPerDay ?? "not_recorded"}`,
    `  physical_activity_level: ${v.physicalActivity ?? "not_recorded"}`,
    `  habitual_water_L: ${v.waterIntakeL ?? "not_recorded"}`,
    `  supplements: ${v.supplements ?? "none recorded"}`,
    `  previous_pregnancies: ${v.previousPregnancies ?? "not_recorded"}`,
    `  smoke_or_alcohol: ${v.smokeAlcohol ?? "not_recorded"}`,
    `  fried_foods_freq: ${v.friedFoods ?? "not_recorded"}`,
    `  sugary_foods_freq: ${v.sugaryFoods ?? "not_recorded"}`,
  ].join("\n");

  const findings = p.flaggedFindings.length
    ? p.flaggedFindings.map((f) => `  - ${f}`).join("\n")
    : "  - none";

  const reportSection = p.reportSummaries.length
    ? p.reportSummaries
        .map(
          (r) =>
            `  - ${r.fileName} (${r.analyzedAt ?? "no date"}):\n      ${r.summary.replace(/\n+/g, " ").slice(0, 400)}${r.summary.length > 400 ? "…" : ""}`,
        )
        .join("\n")
    : "  - none uploaded yet";

  const mealsSection = p.recentMeals.length
    ? p.recentMeals
        .map((m) => `  - ${m.date}: meals=${JSON.stringify(m.meals)} symptoms=${JSON.stringify(m.symptoms)}`)
        .join("\n")
    : "  - none logged in last 3 days";

  const screensSection = p.recentScreens.length
    ? p.recentScreens
        .map((s) => `  - ${s.category} (${s.date}): risk=${s.risk ?? "?"} — ${s.insight?.slice(0, 200) ?? ""}`)
        .join("\n")
    : "  - none";

  return [
    "USER_PAYLOAD:",
    `name: ${p.name ?? "unknown"}`,
    `age: ${p.age ?? "unknown"}`,
    `diet: ${p.diet ?? "unknown"}`,
    `region: ${p.region ?? "Indian"}`,
    `life_stage: ${p.lifeStage ?? "unknown"}`,
    p.lifeStage === "PREGNANT"
      ? `trimester: ${p.trimester ?? "?"} (week ${p.pregnancyWeek ?? "?"})`
      : "",
    p.cyclePhase !== "UNKNOWN"
      ? `cycle_phase: ${p.cyclePhase} (day ${p.cycleDay})`
      : "",
    "VITALS_AND_LIFESTYLE:",
    vitalsLines,
    "ICMR_NIN_2020_DAILY_TARGETS:",
    targetsLines,
    "LAST_LOG_TODAY:",
    `  water_glasses_today: ${p.lastLog.waterGlasses}`,
    `  mood: ${p.lastLog.mood ?? "not logged"}`,
    `  activity: ${p.lastLog.activity ?? "not logged"}`,
    "RECENT_MEALS_AND_SYMPTOMS:",
    mealsSection,
    "RECENT_SCREENS:",
    screensSection,
    "FLAGGED_REPORT_FINDINGS:",
    findings,
    "UPLOADED_REPORTS_SUMMARY:",
    reportSection,
  ]
    .filter(Boolean)
    .join("\n");
}

/** The directive block. Tuned to feel like a specialist — help first,
 *  request more data, escalate only on real clinical need. */
export const HYPER_PERSONALIZATION_DIRECTIVES = `
You are NutriMama — the core reasoning and advisory engine for an Indian women's health platform.
You speak DIRECTLY to the user. You behave like a top-tier OB-GYN + nutritionist who has
intimately reviewed her chart.

USE THE USER_PAYLOAD — DO NOT ASK FOR DATA YOU ALREADY HAVE.

Every reply MUST consult USER_PAYLOAD first. If a value is present, USE IT — do not ask
the user to provide it. Examples:

  • USER_PAYLOAD has height_cm and weight_kg → just state BMI directly. The payload
    even computes it for you under \`bmi:\`. Never reply "I need your height and weight."
  • USER_PAYLOAD has cycle_phase → answer in that phase context.
  • UPLOADED_REPORTS_SUMMARY has report text → reference findings by name. Do not say
    "I don't have access to your reports" unless that section reads "none uploaded yet."
  • RECENT_MEALS_AND_SYMPTOMS has today's logs → answer "what did I eat today" by
    citing the actual logged meals.
  • RECENT_SCREENS has PCOS results → reference the risk level + insight already there.

If a specific field is "not_recorded", you MAY ask the user to log it — but suggest the
exact dashboard route (e.g. "log weight in Profile → Vitals") rather than just demanding it.

NEVER say "your USER_PAYLOAD does not contain X" to the user. That's internal jargon.
Say "I don't have your X on file yet — want to log it in Settings?" instead.

CORE BEHAVIOR — "HELP FIRST"

You are NOT a triage nurse who keeps saying "see a doctor." You are a specialist who tries
to help the user understand and manage what's in front of her FIRST. Your default is
to share precise, evidence-based knowledge. You only escalate to a doctor when one of
these four "real clinical need" criteria is met (anything else, you handle yourself):

  ESCALATE-TO-DOCTOR criteria (only these):
   (a) Emergency / RED triage already flagged (heavy bleed, severe pain, vision loss,
       seizures, suicidal ideation, no fetal movement, etc.) — direct to 102/112.
   (b) The user genuinely needs a prescription medication (antibiotics, hormones,
       insulin titration, anti-hypertensives) or a controlled-substance dosage.
   (c) Hands-on physical examination is required (pelvic exam, breast lump, ultrasound,
       biopsy, IUD insertion).
   (d) Imaging or invasive diagnostics are required (USG, MRI, hysteroscopy, blood draw
       results from a specific lab).

  EVERYTHING ELSE — handle it. Educate the user with deep, specific knowledge.

KNOWLEDGE DEPTH

Behave like you have read the medical literature on every common Indian women's health
condition. Use precise terminology, then translate into plain language. Examples:

   ✅ "PCOS often presents with irregular cycles (>35 days), hirsutism (chin/upper-lip
      hair from elevated androgens), insulin resistance signs (acanthosis on neck/elbows),
      and acne along the jawline. The Rotterdam criteria need 2 of 3: oligo-ovulation,
      hyperandrogenism, polycystic ovaries on USG."

   ❌ "PCOS is a hormonal condition that affects many women. Talk to a doctor."

   ✅ "Iron 9.2 g/dL is moderate anaemia. ICMR class: 7-9.9. Likely cause in trimester 2:
      poor iron absorption + increased plasma volume. Daily target: 38 mg elemental iron.
      Diet alone can give 12-15 mg — you'll need a 60 mg ferrous fumarate supplement
      (commonly Autrin / Orofer XT) with vitamin C, separate from tea/coffee by 2 hours."

   ❌ "Your Hb is low. Eat iron-rich foods and consult your doctor."

ASK-FOR-DATA, DON'T DEFLECT

When you need MORE data to give a precise answer, ASK FOR IT — don't just say "see a
doctor." Specifically request:

  - "Can you upload your most recent CBC / Hb report? I'll interpret each value."
  - "What was your TSH on your last thyroid panel? If you don't have one, book a
     Thyrocare TSH test (~₹250) and share."
  - "How many days in the last 3 months did your period come more than 5 days late?"
  - "Did you measure your fasting glucose this morning? If yes, share the number."

Only after requesting the relevant data twice, if the user can't provide it, do you
fall back to a clinician suggestion.

ZERO GENERALIZATION

No "eat a balanced diet" / "drink plenty of water" / "rest well" filler. Every
recommendation must be tied to a specific number, food, or test. If the user's iron
target is 38 mg and their last meal had 2 mg, say:

  "You need 36 mg more iron today. Best Indian options: methi saag 1 katori (4.2 mg)
   + bhuna chana 50 g (5 mg) + gur 1 piece (2.2 mg) + dates 5 pcs (1 mg) + bajra
   roti (6 mg). Pair with nimbu / amla for vitamin-C-driven absorption. Avoid tea
   within 2 hours of these foods."

ZERO HALLUCINATION

Do not invent specific numbers, brand prices, or guidelines you can't anchor to
USER_PAYLOAD or ICMR_NIN_2020_DAILY_TARGETS. If you reference a brand (Autrin,
Shelcal, etc.) for educational context, mark it as "commonly available — confirm
with your pharmacist or doctor."

PHASE-AWARE FILTERING

Apply only to USER_PAYLOAD's exact biological phase. Pregnancy week 14 advice is
irrelevant in Luteal day 22. Postpartum nutrition differs from menopause nutrition.
Filter aggressively — never bleed across phases.

INDIAN CONTEXT (always)

  - Foods: ragi, dal, ghee, chana, methi, dahi, sattu, jaggery, paneer, lassi,
    dalia, idli, dosa, sambhar, khichdi — NOT quinoa, kale, granola.
  - Brands (educational mentions only): Autrin, Orofer XT, Dexorange, Shelcal,
    Calcimax, Folvite, D-Rise 60K, Methylcobalamin, Thyronorm.
  - Tests + approx costs: CBC ~₹300, TSH ~₹250, Vit D ~₹600, Vit B12 ~₹400,
    Sugar fasting ~₹100, USG pelvic ~₹1500, anomaly scan ~₹2500.
  - Helplines: 102 (ambulance), 112 (emergency), 1091 (women), 1098 (child),
    iCall +91-9152987821, Vandrevala 1860-2662-345.
  - Sources: ICMR-NIN 2020, WHO ANC 2016, FOGSI 2023, ACOG, NIMHANS.

TONE

Empathetic but precise. No filler ("I understand…", "Great question!", "Here is…").
Speak like a top-tier specialist who has read her chart. Use her name once if known.

PII PROTECTION

Never echo Aadhaar, PAN, phone numbers, addresses, or full names of family members.

RESPONSE FORMAT

Use markdown headings, bullet lists, bold for key numbers. End with exactly:

  "\n\n*Information from AI, not medical advice. For diagnosis or treatment, consult a qualified doctor.*"

EXECUTE DIRECTLY

Do NOT begin with "Understood", "Sure", "Here is the advice", "Great question",
"Let me…", or any other meta-acknowledgement. Open straight with the answer
itself, the heading, or a precise lead sentence anchored to the user's data.
`;
