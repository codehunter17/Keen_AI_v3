import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ageFromDob } from "@/lib/lifecycle";
import { getCycleHistory, predictNextCycle } from "@/lib/actions/cycle";
import { CycleTracker } from "./cycle-tracker";

export const metadata = { title: "Cycle · NutriMama" };

export default async function CyclePage() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: s.user.id },
    select: { dob: true, lifeStage: true, cycleStage: true },
  });
  if (!user?.dob) redirect("/onboarding");

  const age = ageFromDob(user.dob);
  if (age < 18) redirect("/dashboard");

  const [history, prediction] = await Promise.all([
    getCycleHistory({ limit: 12 }),
    predictNextCycle(),
  ]);

  return (
    <CycleTracker
      history={history.map((h) => ({
        id: h.id,
        startDate: h.startDate.toISOString(),
        endDate: h.endDate?.toISOString() ?? null,
        flow: h.flow,
        pain: h.pain,
        symptoms: (h.symptoms as string[] | null) ?? [],
        notes: h.notes,
      }))}
      prediction={{
        averageLengthDays: prediction.averageLengthDays,
        averagePeriodDays: prediction.averagePeriodDays,
        lastStart: prediction.lastStart?.toISOString() ?? null,
        nextPredictedStart: prediction.nextPredictedStart?.toISOString() ?? null,
        ovulationDate: prediction.ovulationDate?.toISOString() ?? null,
        fertileWindowStart: prediction.fertileWindowStart?.toISOString() ?? null,
        fertileWindowEnd: prediction.fertileWindowEnd?.toISOString() ?? null,
        confidence: prediction.confidence,
      }}
    />
  );
}
