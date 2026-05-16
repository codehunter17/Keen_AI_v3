import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MealLogger } from "@/components/meal-logger";
import { TodayMealsSummary } from "@/components/today-meals-summary";
import { CustomFoodForm } from "@/components/custom-food-form";
import { VoiceMic } from "@/components/voice-mic";
import { MealsTabsClient } from "./meals-tabs-client";
import { MealsStatsPanel } from "./meals-stats";
import { MealsInsightsPanel } from "./meals-insights";

export const metadata = { title: "Meals · NutriMama" };

// Meals tracker — 4 tabs (Today / Add / Stats / Insights).
// Server component shell; all four panels are rendered at once and
// toggled via CSS by the client wrapper so in-form state survives
// tab switches (e.g., a half-typed custom food).
export default async function MealsPage() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) redirect("/auth/sign-in");

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-5 w-full">
      <header>
        <h1 className="font-heading text-3xl text-primary">Today&apos;s plate</h1>
        <p className="text-sm text-muted-foreground">
          Log meals · track macros + key micros · works offline.
        </p>
      </header>

      <MealsTabsClient
        today={<TodayMealsSummary />}
        add={
          <div className="space-y-4">
            <VoiceMic />
            <MealLogger />
            <CustomFoodForm />
          </div>
        }
        stats={<MealsStatsPanel />}
        insights={<MealsInsightsPanel />}
      />
    </div>
  );
}
