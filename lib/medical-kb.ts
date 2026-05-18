// Indian medical knowledge base — verified, citable nutrient values used to
// ground the AI. Ported from the legacy Keen_AI medical_kb.py.
//
// Sources (every value here is citable to one of these):
//   - ICMR-NIN Recommended Dietary Allowances 2020
//   - WHO Antenatal Care Guidelines 2016
//   - FOGSI Clinical Practice Guidelines 2023
//   - ACOG Practice Bulletins
//   - CDSCO India — Drug Safety
//   - NIMHANS Mental Health Guidelines

export const ICMR_RDA = {
  // ── Children — ICMR-NIN RDA 2020 ──────────────────────────────────────────
  child_4_6: {
    iron_mg: 13,
    calcium_mg: 600,
    folate_mcg: 200,
    protein_g: 20,
    kcal: 1350,
    water_l: 1.3,
    source: "ICMR-NIN RDA 2020",
  },
  child_7_9: {
    iron_mg: 16,
    calcium_mg: 600,
    folate_mcg: 200,
    protein_g: 29,
    kcal: 1690,
    water_l: 1.7,
    source: "ICMR-NIN RDA 2020",
  },
  child_10_12: {
    iron_mg: 21,
    calcium_mg: 800,
    folate_mcg: 300,
    protein_g: 36,
    kcal: 2010,
    water_l: 2.0,
    source: "ICMR-NIN RDA 2020",
  },
  pregnant: {
    iron_mg: { T1: 27, T2: 30, T3: 38, general: 35 },
    calcium_mg: { T1: 1000, T2: 1200, T3: 1200 },
    folate_mcg: 500,
    protein_g: { T1: 55, T2: 78, T3: 100 },
    DHA_mg: { T1: 200, T2: 300, T3: 300 },
    iodine_mcg: 220,
    zinc_mg: 12,
    vitD_IU: 600,
    vitC_mg: 80,
    B12_mcg: 2.6,
    source: "ICMR-NIN RDA 2020",
  },
  teen_13_17: {
    iron_mg: 28,
    calcium_mg: 800,
    folate_mcg: 400,
    protein_g: 55,
    source: "ICMR-NIN RDA 2020",
  },
  adult_18_45: {
    iron_mg: 21,
    calcium_mg: 600,
    folate_mcg: 400,
    protein_g: 55,
    source: "ICMR-NIN RDA 2020",
  },
  postpartum: {
    iron_mg: 21,
    calcium_mg: 1000,
    DHA_mg: 200,
    extra_cal: 500,
    water_L: 3.5,
    source: "ICMR-NIN RDA 2020",
  },
  menopause: {
    calcium_mg: 1200,
    vitD_IU: 1000,
    protein_g: 60,
    source: "ICMR-NIN RDA 2020",
  },
} as const;

// ─── Three-layer deficiency remedies (Indian context) ──────────
// gharelu = traditional home remedies
// ayurveda = OTC ayurvedic preparations
// medicine = allopathic / pharma options (informational only — not a prescription)
// doctor = when to escalate

export interface RemedyEntry {
  name: string;
  gharelu: string[];
  ayurveda: string[];
  medicine: string[];
  doctor: string;
}

export const DEFICIENCY_REMEDIES: Record<string, RemedyEntry> = {
  iron: {
    name: "Iron",
    gharelu: [
      "Gur + bhuna chana daily snack (≈5 mg iron)",
      "Beetroot + amla juice in the morning (iron + Vitamin C)",
      "Cook in an iron kadhai (adds 1–2 mg per meal)",
      "Methi saag with a squeeze of nimbu (4.2 mg iron + better absorption)",
      "5 dates daily (≈1 mg iron + steady energy)",
    ],
    ayurveda: [
      "Punarnava (Himalaya)",
      "Lohasava — iron tonic (Dabur)",
      "Navayasa Churna (Baidyanath)",
      "Dhatri Lauh (Dhootapapeshwar)",
    ],
    medicine: [
      "Autrin capsule — iron 100 mg",
      "Dexorange syrup — iron + B12 + folic",
      "Orofer XT — iron 100 mg + folic",
    ],
    doctor:
      "If Hb < 8 g/dL, see a doctor immediately. IV iron may be needed.",
  },
  calcium: {
    name: "Calcium",
    gharelu: [
      "Ragi roti daily (~344 mg per roti)",
      "Til ladoo / chikki (~176 mg per serving)",
      "1 katori dahi (~300 mg)",
      "Nachni / ragi satva (~340 mg per serving)",
      "Sprinkle sesame seeds on food",
    ],
    ayurveda: ["Praval Pishti (coral calcium)", "Godanti Bhasma", "Mukta Shukti Bhasma"],
    medicine: ["Shelcal 500", "CCM tablet", "Calcimax", "Gemcal sachet"],
    doctor:
      "Severe cramps, numbness, or tooth issues → ask for a Serum Calcium + Vitamin D test.",
  },
  folate: {
    name: "Folic Acid",
    gharelu: [
      "Daily palak / spinach (~140 mcg per serving)",
      "1 katori sprouts (~80 mcg)",
      "Methi saag (~120 mcg)",
      "Chana / chole (85–95 mcg)",
      "Beetroot (~110 mcg)",
    ],
    ayurveda: ["Shatavari powder (natural folate)", "Moringa (sahjan) powder"],
    medicine: ["Folvite 5 mg", "Folinext-D", "Standard prenatal vitamins cover folate"],
    doctor:
      "In pregnancy, 500 mcg daily is essential. Ideally start before conception.",
  },
  protein: {
    name: "Protein",
    gharelu: [
      "2 moong dal chilla (~14 g)",
      "Sattu sherbet (~12 g)",
      "Extra katori dal (8–10 g)",
      "100 g paneer (~18 g)",
      "2 eggs (~13 g)",
      "1 katori sprouts (~7 g)",
      "Handful of peanuts (~8 g)",
    ],
    ayurveda: ["Shatavari (supports protein metabolism)", "Ashwagandha (muscle strength)"],
    medicine: ["Protinex (mama variant)", "Resource Protein"],
    doctor:
      "T2 needs 78 g/day, T3 needs 100 g/day. Persistent low intake → see a dietitian.",
  },
  vitaminD: {
    name: "Vitamin D",
    gharelu: [
      "15–20 min morning sunlight (10 AM–12 PM)",
      "Mushrooms (only veg source)",
      "Fortified milk",
    ],
    ayurveda: ["Cod liver oil capsule (traditional)"],
    medicine: ["D-Rise 60K weekly sachet", "Calcirol granules", "Arachitol injection (doctor only)"],
    doctor:
      "About 70% of Indian women are deficient. Ask for a 25-OH Vitamin D test.",
  },
  b12: {
    name: "Vitamin B12",
    gharelu: [
      "Daily dahi (~0.8 mcg)",
      "2 glasses milk (~2.2 mcg)",
      "Eggs if non-veg (~1.1 mcg each)",
      "Paneer (~0.6 mcg)",
    ],
    ayurveda: ["Ashwagandha (absorption support)", "Brahmi (nerve health)"],
    medicine: ["Methylcobalamin 1500 mcg (Nurokind)", "Mecobalamin injection (doctor only)"],
    doctor:
      "40–60% of vegetarians are deficient. Ask for a Serum B12 test. Numbness or tingling = urgent.",
  },
};

// ─── Regional meal suggestions per nutrient × Indian region ────
// This is the secret sauce — hyper-localized to how women actually eat
// across India, not Pinterest-style "smoothie bowls".

export type Region =
  | "north"
  | "south"
  | "east"
  | "west"
  | "northeast"
  | "gujarat"
  | "maharashtra"
  | "bengal"
  | "rajasthan"
  | "punjab"
  | "odisha";

export const REGIONAL_MEALS: Record<string, Partial<Record<Region, string>>> = {
  iron: {
    gujarat: "Methi thepla + gur + chaas — about 6 mg iron",
    north: "Sarson saag + makki roti + gur chana — about 7 mg iron",
    south: "Ragi mudde + drumstick sambhar + rasam (vitamin C boost) — about 7 mg iron",
    maharashtra: "Thalipeeth + usal + gur — about 7 mg iron",
    bengal: "Palak dal + parwal sabzi + amla chutney for absorption",
    rajasthan: "Bajra roti + sangri sabzi + gur — highest iron meal",
    punjab: "Sarson ka saag + makki roti + lassi + gur",
    northeast: "Black rice + fish curry + bamboo shoot",
    odisha: "Dalma + pakhala + saag bhaja — about 7 mg iron",
  },
  calcium: {
    gujarat: "Ragi rotla + dahi + til chikki — ~820 mg",
    north: "Paneer paratha + lassi + til — ~560 mg",
    south: "Ragi dosa + curd rice + coconut chutney — ~624 mg",
    maharashtra: "Nachni satva + dahi + til ladoo — ~816 mg",
    bengal: "Dahi rice + paneer bhaji — ~530 mg",
    rajasthan: "Bajra roti + raab + chaas + til — ~270 mg+",
    punjab: "Paneer + lassi + ragi paratha — ~560 mg+",
    northeast: "Soybean curry + milk + sesame — ~400 mg+",
    odisha: "Ragi ambil + dahi — ~644 mg",
  },
  protein: {
    gujarat: "Moong dal chilla + sattu sherbet + extra dal — ~34 g",
    north: "Rajma chawal + paneer + dahi — ~37 g",
    south: "Egg dosa + sambhar + curd + peanuts — ~33 g",
    maharashtra: "Misal pav + egg bhurji + dahi — ~33 g",
    bengal: "Fish curry + dal + egg — ~53 g",
    rajasthan: "Dal baati + sattu + chaas — ~28 g+",
    punjab: "Chole + paneer + lassi — ~34 g",
    northeast: "Fish + dal + soybean — ~52 g",
    odisha: "Dalma + fish + sprouts — ~49 g",
  },
};

// ─── Rule-based nutrition risk scoring (Hb, BMI, BP) ────────────
export interface NutritionRiskInput {
  hbGdl?: number;
  weightKg?: number;
  heightCm?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
}

export interface NutritionRiskDetail {
  param: string;
  value: string;
  status: "normal" | "mild" | "moderate" | "severe" | "elevated" | "high" | "underweight" | "overweight" | "obese";
  note?: string;
}

export function nutritionRisk(input: NutritionRiskInput): {
  score: number;
  details: NutritionRiskDetail[];
  level: "LOW" | "MEDIUM" | "HIGH";
} {
  let score = 0;
  const details: NutritionRiskDetail[] = [];

  if (input.hbGdl != null && input.hbGdl > 0) {
    const hb = input.hbGdl;
    if (hb >= 11)
      details.push({ param: "Haemoglobin", value: `${hb} g/dL`, status: "normal" });
    else if (hb >= 10) {
      score += 1;
      details.push({ param: "Haemoglobin", value: `${hb} g/dL`, status: "mild", note: "Mild anaemia — increase iron-rich foods" });
    } else if (hb >= 7) {
      score += 3;
      details.push({ param: "Haemoglobin", value: `${hb} g/dL`, status: "moderate", note: "Moderate anaemia — supplements + see doctor" });
    } else {
      score += 5;
      details.push({ param: "Haemoglobin", value: `${hb} g/dL`, status: "severe", note: "Severe anaemia — see a doctor immediately" });
    }
  }

  if (input.weightKg && input.heightCm) {
    const m = input.heightCm / 100;
    const bmi = +(input.weightKg / (m * m)).toFixed(1);
    if (bmi < 18.5) {
      score += 2;
      details.push({ param: "BMI", value: String(bmi), status: "underweight" });
    } else if (bmi < 23) {
      details.push({ param: "BMI", value: String(bmi), status: "normal" });
    } else if (bmi < 25) {
      score += 1;
      details.push({ param: "BMI", value: String(bmi), status: "overweight" });
    } else {
      score += 2;
      details.push({ param: "BMI", value: String(bmi), status: "obese" });
    }
  }

  if (input.bpSystolic && input.bpSystolic > 0) {
    const sys = input.bpSystolic;
    const dia = input.bpDiastolic ?? "?";
    if (sys > 140) {
      score += 3;
      details.push({ param: "BP", value: `${sys}/${dia}`, status: "high" });
    } else if (sys > 130) {
      score += 1;
      details.push({ param: "BP", value: `${sys}/${dia}`, status: "elevated" });
    } else {
      details.push({ param: "BP", value: `${sys}/${dia}`, status: "normal" });
    }
  }

  const level: "LOW" | "MEDIUM" | "HIGH" = score >= 5 ? "HIGH" : score >= 2 ? "MEDIUM" : "LOW";
  return { score, details, level };
}
