import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MealLogger } from "@/components/meal-logger";
import { TodayMealsSummary } from "@/components/today-meals-summary";
import { CustomFoodForm } from "@/components/custom-food-form";
import { VoiceMic } from "@/components/voice-mic";

export const metadata = { title: "Log a meal · NutriMama" };

export default async function MealsPage() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) redirect("/auth/login");

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-5 w-full">
      <header>
        <h1 className="font-heading text-3xl text-primary">Today&apos;s plate</h1>
        <p className="text-sm text-muted-foreground">
          Log meals · track macros + key micros · works offline.
        </p>
      </header>

      {/* Today's logged meals + ICMR target progress bars */}
      <TodayMealsSummary />

      {/* Voice — fastest way to log on mobile, esp. in Hindi */}
      <VoiceMic />

      {/* Search the 110-food DB (offline-capable) */}
      <MealLogger />

      {/* Custom food — AI fetches macros */}
      <CustomFoodForm />
    </div>
  );
}
