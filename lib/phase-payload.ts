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
  // Recent flagged report findings (verbatim from RAG)
  flaggedFindings: string[];
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

  if (input.lifeStage === "PREGNANT" && tri) {
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
  if (input.lifeStage === "POSTPARTUM") {
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
  if ((input.lifeStage ?? "").startsWith("TEEN") || (input.age != null && input.age <= 17)) {
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
  if (input.lifeStage === "MENOPAUSE" || (input.age != null && input.age >= 45)) {
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
  // Default adult menstruating
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

/** Render the payload as a compact JSON block embedded in the system prompt. */
export function payloadToSystemContext(p: PhasePayload): string {
  const targetsLines = Object.entries(p.targets)
    .filter(([, v]) => v != null)
    .map(([k, v]) => `  ${k}: ${v}`)
    .join("\n");

  const findings = p.flaggedFindings.length
    ? p.flaggedFindings.map((f) => `  - ${f}`).join("\n")
    : "  - none";

  return [
    "USER_PAYLOAD:",
    `name: ${p.name ?? "unknown"}`,
    `age: ${p.age ?? "unknown"}`,
    `diet: ${p.diet ?? "unknown"}`,
    `region: ${p.region ?? "Indian"}`,
    `life_stage: ${p.lifeStage ?? "unknown"}`,
    p.lifeStage === "PREGNANT" ? `trimester: ${p.trimester ?? "?"} (week ${p.pregnancyWeek ?? "?"})` : "",
    p.cyclePhase !== "UNKNOWN" ? `cycle_phase: ${p.cyclePhase} (day ${p.cycleDay})` : "",
    "ICMR_NIN_2020_DAILY_TARGETS:",
    targetsLines,
    "LAST_LOG:",
    `  water_glasses_today: ${p.lastLog.waterGlasses}`,
    `  mood: ${p.lastLog.mood ?? "not logged"}`,
    `  activity: ${p.lastLog.activity ?? "not logged"}`,
    "FLAGGED_REPORT_FINDINGS:",
    findings,
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
