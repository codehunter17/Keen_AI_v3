import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getClinician } from "@/lib/clinician-auth";
import { EditCaseForm } from "./edit-case-form";

export const dynamic = "force-dynamic";

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

export default async function ClinicianEditCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const clinician = await getClinician();
  if (!clinician) return null;

  const { id } = await params;
  const c = await prisma.keenClinicalCase.findUnique({ where: { id } });
  if (!c || c.teacherId !== clinician.teacherId) notFound();
  if (c.withdrawnAt) redirect(`/clinician/cases/${c.id}`);

  const elapsed = Date.now() - c.createdAt.getTime();
  if (elapsed > EDIT_WINDOW_MS) {
    redirect(`/clinician/cases/${c.id}`);
  }

  const decision = c.decision as { type?: string; details?: string };
  const inputs = c.inputs as {
    ageBand?: string;
    lifeStage?: string;
    symptoms?: string[];
    labs?: Record<string, number | string>;
    history?: string;
  };
  const differential = (c.differential as string[] | null) ?? [];
  const labsJson =
    inputs.labs && Object.keys(inputs.labs).length > 0
      ? typeof inputs.labs.notes === "string" &&
        Object.keys(inputs.labs).length === 1
        ? inputs.labs.notes
        : JSON.stringify(inputs.labs)
      : "";

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-heading font-bold">Edit case</h1>
        <p className="text-sm text-muted-foreground">
          Changes are allowed within 24 hours of submission. After that the case
          is locked.
        </p>
      </div>
      <EditCaseForm
        defaults={{
          caseId: c.id,
          occurredAt: c.occurredAt.toISOString().slice(0, 10),
          ageBand: inputs.ageBand ?? "",
          lifeStage: inputs.lifeStage ?? "",
          symptoms: (inputs.symptoms ?? []).join(", "),
          history: inputs.history ?? "",
          labsJson,
          decisionType: decision.type ?? "other",
          decisionDetails: decision.details ?? "",
          differential: differential.join(", "),
          reasoning: c.reasoning ?? "",
        }}
      />
    </div>
  );
}
