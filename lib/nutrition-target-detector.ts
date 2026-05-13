// Detects whether a user's daily ICMR-NIN nutrition targets were hit
// based on the meals they logged. Used by:
//   - Nutrition streak (separate from generic activity streak)
//   - Badges (IRON_HIT, CALCIUM_HIT, FOLATE_HIT, TRIPLE_TARGET, HYDRATION_CHAMPION)
//   - PregnancyVisualizer (vibrant when goals hit, grey otherwise)

import { FOOD_DB } from "@/lib/food-db";
import { computeTargets } from "@/lib/phase-payload";
import type { LifeStage } from "@/lib/lifecycle";

export interface DailyIntake {
  iron_mg: number;
  calcium_mg: number;
  folate_mcg: number;
  protein_g: number;
  kcal: number;
  waterMl: number;
}

export interface TargetHits {
  iron: boolean;
  calcium: boolean;
  folate: boolean;
  protein: boolean;
  water: boolean;
  /** true iff iron + calcium + folate are all hit. Triggers TRIPLE_TARGET badge. */
  tripleNutrient: boolean;
}

/**
 * Sum macros + key micros from logged meal labels. The DailyLog stores meal
 * labels like "1 katori dal" or "2x roti" — we map those to FOOD_DB rows.
 */
export function intakeFromMealLabels(mealsByType: Record<string, string[]>, waterGlasses: number): DailyIntake {
  const totals: DailyIntake = {
    iron_mg: 0,
    calcium_mg: 0,
    folate_mcg: 0,
    protein_g: 0,
    kcal: 0,
    waterMl: waterGlasses * 250,
  };

  for (const items of Object.values(mealsByType)) {
    if (!Array.isArray(items)) continue;
    for (const raw of items) {
      const { servings, foodLabel } = parseLabel(raw);
      const food = matchFood(foodLabel);
      if (!food) continue;
      totals.iron_mg += food.iron_mg * servings;
      totals.calcium_mg += food.calcium_mg * servings;
      totals.folate_mcg += (food.folate_mcg ?? 0) * servings;
      totals.protein_g += food.protein_g * servings;
      totals.kcal += food.kcal * servings;
    }
  }

  return totals;
}

/** Parse "2x ragi roti" / "1.5x dal" / "ragi roti" → { servings, foodLabel }. */
function parseLabel(label: string): { servings: number; foodLabel: string } {
  const m = /^([\d.]+)x\s+(.+)$/i.exec(label.trim());
  if (m) return { servings: parseFloat(m[1]) || 1, foodLabel: m[2] };
  return { servings: 1, foodLabel: label.trim() };
}

/** Best-effort fuzzy match — exact name, then alias, then partial. */
function matchFood(label: string) {
  const q = label.toLowerCase().trim();
  // Exact name or hi
  for (const f of FOOD_DB) {
    if (f.name.toLowerCase() === q) return f;
    if (f.hi && f.hi === label.trim()) return f;
  }
  // Alias exact
  for (const f of FOOD_DB) {
    if (f.aliases?.some((a) => a.toLowerCase() === q)) return f;
  }
  // Partial — name contains query OR query contains name
  for (const f of FOOD_DB) {
    if (f.name.toLowerCase().includes(q) || q.includes(f.name.toLowerCase())) return f;
  }
  return null;
}

/** Did the user hit their phase-aware targets today? */
export function checkTargets(
  intake: DailyIntake,
  ctx: { age: number | null; lifeStage: LifeStage | null; pregnancyWeek: number | null; weightKg?: number | null },
): TargetHits {
  const targets = computeTargets({
    age: ctx.age,
    lifeStage: ctx.lifeStage,
    pregnancyWeek: ctx.pregnancyWeek,
  });

  const ironTarget = targets.iron_mg ?? 21;
  const calciumTarget = targets.calcium_mg ?? 600;
  const folateTarget = targets.folate_mcg ?? 400;
  const proteinTarget = targets.protein_g ?? 55;
  const waterTarget = (targets.water_l ?? 2.5) * 1000;

  const iron = intake.iron_mg >= ironTarget * 0.85; // 85% — realistic floor
  const calcium = intake.calcium_mg >= calciumTarget * 0.85;
  const folate = intake.folate_mcg >= folateTarget * 0.85;
  const protein = intake.protein_g >= proteinTarget * 0.85;
  const water = intake.waterMl >= waterTarget;

  return {
    iron,
    calcium,
    folate,
    protein,
    water,
    tripleNutrient: iron && calcium && folate,
  };
}
