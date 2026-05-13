import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  computeBmi,
  getTodaysHydration,
  getStreak,
  getWeeklySummary,
  listEmergencyContacts,
} from "@/lib/actions/wellness";
import { WellnessClient } from "./wellness-client";

export const metadata = { title: "Wellness · NutriMama" };

export default async function WellnessPage() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) redirect("/auth/login");

  const [bmi, hydration, streak, weekly, contacts] = await Promise.all([
    computeBmi(),
    getTodaysHydration(),
    getStreak(),
    getWeeklySummary(),
    listEmergencyContacts(),
  ]);

  return (
    <WellnessClient
      bmi={bmi}
      hydration={hydration}
      streak={{
        currentDays: streak.currentDays,
        longestDays: streak.longestDays,
      }}
      weekly={weekly}
      contacts={contacts.map((c) => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        relation: c.relation as "PARTNER" | "PARENT" | "DOCTOR" | "FRIEND",
        priority: c.priority,
      }))}
    />
  );
}
