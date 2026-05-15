// BMI calculator — visual port of keen-ai's BMI page using v3's existing
// Indian Asian-specific calc logic from lib/bmi.ts. Prefills from the
// user's stored vitals so they don't have to retype.

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BMIClient } from "./bmi-client";

export const metadata = { title: "BMI Calculator · NutriMama" };

export default async function BMIPage() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) redirect("/auth/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: s.user.id },
    select: { height: true, weight: true },
  });

  return (
    <BMIClient
      initialHeightCm={user?.height ?? null}
      initialWeightKg={user?.weight ?? null}
    />
  );
}
