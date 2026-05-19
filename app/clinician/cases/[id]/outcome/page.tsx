import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getClinician } from "@/lib/clinician-auth";
import { OutcomeForm } from "./outcome-form";

export const dynamic = "force-dynamic";

export default async function ClinicianOutcomePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const clinician = await getClinician();
  if (!clinician) return null;

  const { id } = await params;
  const c = await prisma.keenClinicalCase.findUnique({
    where: { id },
    select: { id: true, teacherId: true, occurredAt: true, decision: true },
  });
  if (!c || c.teacherId !== clinician.teacherId) notFound();

  const decision = c.decision as { type?: string; details?: string };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-heading font-bold">Log outcome</h1>
        <p className="text-sm text-muted-foreground">
          For: <strong>{decision.details ?? "—"}</strong> ·{" "}
          {c.occurredAt.toISOString().slice(0, 10)}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Outcomes are what turn this from a notebook into a learning system.
          Without outcomes, the brain knows what you decided but never knows if
          you were right.
        </p>
      </div>
      <OutcomeForm
        caseId={c.id}
        caseOccurredAt={c.occurredAt.toISOString().slice(0, 10)}
      />
    </div>
  );
}
