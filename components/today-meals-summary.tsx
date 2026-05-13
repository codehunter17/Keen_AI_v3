// Server component — today's logged meals + nutrition progress.

import { getTodayNutritionSummary } from "@/lib/actions/nutrition-summary";
import { TodayMealsClient } from "./today-meals-client";

export async function TodayMealsSummary() {
  const summary = await getTodayNutritionSummary();
  if (!summary) return null;
  return <TodayMealsClient summary={summary} />;
}
