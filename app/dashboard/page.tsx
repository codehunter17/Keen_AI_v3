import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ChildOverview } from "./child-overview";
import { TeenOverview } from "./teen-overview";
import OverviewClient from "./overview-client";
import { DailyPlan } from "@/components/daily-plan";
import { CycleRing } from "@/components/cycle-ring";
import { BmiCard } from "@/components/bmi-card";
import { StreakWidget } from "@/components/streak-widget";
import { PregnancyVisualizer } from "@/components/pregnancy-visualizer";
import { ShareWeeklyButton } from "@/components/share-button";
import { VoiceMic } from "@/components/voice-mic";
import { NotificationPrompt } from "@/components/notification-prompt";
import { BadgeShelf } from "@/components/badge-shelf";
import { QuickActionsFab } from "@/components/quick-actions-fab";
import { QuickActionsSection } from "@/components/quick-actions-section";
import { ModeSwitcherSection } from "@/components/mode-switcher-section";

export default async function DashboardRoot() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/sign-in");

  const lifeStage = (session.user as any).lifeStage as string | undefined;
  const name = session.user.name ?? "";

  // ── Under-12: body safety + nutrition only ────────────────────────────
  if (lifeStage?.startsWith("CHILD_")) {
    return <ChildOverview name={name} />;
  }

  // ── Teens 12–17: cycle + nutrition + wellness, no AI ─────────────────
  if (lifeStage?.startsWith("TEEN_")) {
    return <TeenOverview name={name} lifeStage={lifeStage} />;
  }

  // ── Adults 18+: full dashboard ────────────────────────────────────────
  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <NotificationPrompt />

      {/* Hero */}
      <Suspense fallback={null}>
        <DailyPlan />
      </Suspense>

      {/* One-tap quick log */}
      <Suspense fallback={null}>
        <QuickActionsSection />
      </Suspense>

      {/* Mode switcher — Cycle / Nutrition / Pregnancy */}
      <Suspense fallback={null}>
        <ModeSwitcherSection />
      </Suspense>

      {/* Pregnancy visualizer (shows only if pregnant) */}
      <Suspense fallback={null}>
        <PregnancyVisualizer />
      </Suspense>

      {/* Cycle ring + BMI card */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Suspense fallback={null}>
          <CycleRing />
        </Suspense>
        <Suspense fallback={null}>
          <BmiCard />
        </Suspense>
      </div>

      {/* Voice mic */}
      <VoiceMic />

      {/* Streak + share */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Suspense fallback={null}>
          <StreakWidget />
        </Suspense>
        <ShareWeeklyButton />
      </div>

      {/* Achievements */}
      <Suspense fallback={null}>
        <BadgeShelf />
      </Suspense>

      {/* Legacy overview widgets */}
      <OverviewClient />

      {/* Floating quick-action button */}
      <QuickActionsFab />
    </div>
  );
}
