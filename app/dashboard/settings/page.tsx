import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SettingsClient } from "./settings-client";
import { ProvidersStatus } from "./providers-status";

export const metadata = { title: "Settings · NutriMama" };

export default async function SettingsPage() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) redirect("/auth/login");

  const [user, sub, dependents] = await Promise.all([
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
      },
    }),
    prisma.subscription.findFirst({
      where: { userId: s.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.dependentProfile.findMany({
      where: { parentId: s.user.id, deletedAt: null },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  if (!user) redirect("/auth/login");

  return (
    <SettingsClient
      providersSlot={<ProvidersStatus />}
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
      dependents={dependents.map((d) => ({
        id: d.id,
        firstName: d.firstName,
        ageBand: d.ageBand,
        relationship: d.relationship,
        hasMenarche: d.hasMenarche,
        cycleTrackingEnabled: d.cycleTrackingEnabled,
      }))}
    />
  );
}
