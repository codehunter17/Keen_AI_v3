import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SettingsClient } from "./settings-client";

export const metadata = { title: "Settings · NutriMama" };

export default async function SettingsPage() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) redirect("/auth/sign-in");

  const [user, sub] = await Promise.all([
    prisma.user.findUnique({
      where: { id: s.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        tier: true,
        tierExpiresAt: true,
        allowModelTraining: true,
        languagePref: true,
        age: true,
        pregnancyStage: true,
        pregnancyWeek: true,
      },
    }),
    prisma.subscription.findFirst({
      where: { userId: s.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  if (!user) redirect("/auth/sign-in");

  return (
    <SettingsClient
      user={user}
      activeSub={
        sub
          ? {
              id: sub.id,
              tier: sub.tier,
              status: sub.status,
              currentPeriodEnd: sub.currentPeriodEnd.toISOString(),
              amountInPaise: sub.amountInPaise,
            }
          : null
      }
      // Provider status surface kept available behind a dev-only query
      // param so we can debug without showing it to end users.
      providersSlot={null}
    />
  );
}
