// Landing page — server component shell that injects a server-rendered
// stats strip into the otherwise-client landing UI. The strip itself
// uses ISR (revalidate = 1h) so it updates throughout the day without
// hammering the database on every visit.

import LandingPageClient from "./landing-client";
import { LiveStatsStrip } from "@/components/live-stats-strip";

export default function LandingPage() {
  return <LandingPageClient statsSlot={<LiveStatsStrip />} />;
}
