// Server wrapper for QuickActionsPanel — fetches today's mood + glasses
// then hands off to the client island. Mounted in the dashboard root.

import { getTodayQuickState } from "@/lib/actions/quick-log";
import { QuickActionsPanel } from "./quick-actions-panel";

export async function QuickActionsSection() {
  const state = await getTodayQuickState();
  return (
    <QuickActionsPanel
      initialMood={state.mood}
      initialWaterGlasses={state.waterGlasses}
    />
  );
}
