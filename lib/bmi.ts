// BMI + recommended ranges. Indian-specific cutoffs per ICMR-NIN 2020:
// the standard WHO BMI thresholds are slightly stricter for South Asians.
//
//   Underweight: < 18.5
//   Normal:      18.5 – 22.9      (vs WHO 18.5–24.9)
//   Overweight:  23.0 – 24.9      (vs WHO 25.0–29.9)
//   Obese I:     25.0 – 29.9
//   Obese II:    ≥ 30.0
//
// Pregnancy weight gain ranges per IOM (Institute of Medicine) 2009:
//   pre-pregnancy BMI < 18.5 →  12.5–18 kg
//   pre-pregnancy BMI 18.5–22.9 (Indian normal) → 11.5–16 kg
//   pre-pregnancy BMI 23–24.9 → 7–11.5 kg
//   pre-pregnancy BMI ≥ 25  →  5–9 kg

export type BmiCategory =
  | "UNDERWEIGHT"
  | "NORMAL"
  | "OVERWEIGHT"
  | "OBESE_I"
  | "OBESE_II";

export interface BmiResult {
  bmi: number;
  category: BmiCategory;
  label: string;
  healthyRangeKg: { low: number; high: number };
  message: string;
}

export function calcBmi(heightCm: number, weightKg: number): BmiResult {
  if (!heightCm || !weightKg || heightCm < 80 || weightKg < 25) {
    throw new Error("Invalid height or weight");
  }
  const m = heightCm / 100;
  const bmi = weightKg / (m * m);
  const category =
    bmi < 18.5
      ? "UNDERWEIGHT"
      : bmi < 23
        ? "NORMAL"
        : bmi < 25
          ? "OVERWEIGHT"
          : bmi < 30
            ? "OBESE_I"
            : "OBESE_II";

  const labels: Record<BmiCategory, string> = {
    UNDERWEIGHT: "Underweight",
    NORMAL: "Normal",
    OVERWEIGHT: "Overweight (Asian-Indian cutoff)",
    OBESE_I: "Obese – class I",
    OBESE_II: "Obese – class II",
  };

  // Healthy weight range for this height using ICMR-NIN normal range
  const healthyRangeKg = {
    low: round(18.5 * m * m),
    high: round(22.9 * m * m),
  };

  const messages: Record<BmiCategory, string> = {
    UNDERWEIGHT:
      "Your BMI is on the lower side. Make sure you're eating enough calories and protein. Persistent underweight can affect cycles and fertility.",
    NORMAL:
      "Your BMI is in the healthy range for your height. Keep it up.",
    OVERWEIGHT:
      "By the South-Asian cutoff (ICMR-NIN), your BMI is just above normal. Small consistent changes — daily walking, less fried/sugary food — usually reset this in a few months.",
    OBESE_I:
      "You're in the obese-I range. Talk to your doctor about a plan — even a 5-10% weight loss can meaningfully improve cycle regularity and reduce PCOS symptoms.",
    OBESE_II:
      "You're in the obese-II range. Please book a clinician visit to discuss a structured plan; this affects pregnancy and long-term health risk.",
  };

  return {
    bmi: round(bmi, 1),
    category,
    label: labels[category],
    healthyRangeKg,
    message: messages[category],
  };
}

function round(n: number, digits = 1): number {
  return Math.round(n * 10 ** digits) / 10 ** digits;
}

// Water target (ml) by weight + activity level + pregnancy.
// Base: 30 ml per kg body weight.
// Adjustments:
//   +400 ml if pregnant T2/T3
//   +700 ml if breastfeeding
//   +500 ml if Indian summer climate (May-Aug)
export function dailyWaterTargetMl(opts: {
  weightKg: number;
  pregnant?: boolean;
  postpartumNursing?: boolean;
  hot?: boolean;
}): number {
  let ml = Math.round(opts.weightKg * 30);
  if (opts.pregnant) ml += 400;
  if (opts.postpartumNursing) ml += 700;
  if (opts.hot) ml += 500;
  return ml;
}
