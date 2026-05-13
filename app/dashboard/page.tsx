import { Suspense } from "react";
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

export default function DashboardRoot() {
  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <NotificationPrompt />

      {/* Hero */}
      <Suspense fallback={null}>
        <DailyPlan />
      </Suspense>

      {/* Pregnancy mode (renders only if user is pregnant) */}
      <Suspense fallback={null}>
        <PregnancyVisualizer />
      </Suspense>

      {/* Cycle ring + BMI card side by side */}
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

      {/* Existing overview (legacy widgets) */}
      <OverviewClient />

      {/* Always-visible quick action FAB */}
      <QuickActionsFab />
    </div>
  );
}
