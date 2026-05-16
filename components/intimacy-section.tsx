// Server wrapper around IntimacyToggle that fetches today's value.

import { getIntimacyToday } from "@/lib/actions/intimacy";
import { IntimacyToggle } from "./intimacy-toggle";

export async function IntimacySection() {
  const logged = await getIntimacyToday();
  return <IntimacyToggle initialLogged={logged} />;
}
