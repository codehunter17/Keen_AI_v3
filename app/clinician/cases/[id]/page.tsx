import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getClinician } from "@/lib/clinician-auth";
import { DeleteButton } from "./delete-button";

export const dynamic = "force-dynamic";

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

function timeRemaining(createdAt: Date): { open: boolean; label: string } {
  const elapsed = Date.now() - createdAt.getTime();
  const remaining = EDIT_WINDOW_MS - elapsed;
  if (remaining <= 0) return { open: false, label: "Edit window closed" };
  const h = Math.floor(remaining / (60 * 60 * 1000));
  const m = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  return { open: true, label: `${h}h ${m}m left` };
}

export default async function ClinicianCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const clinician = await getClinician();
  if (!clinician) return null;

  const { id } = await params;
  const c = await prisma.keenClinicalCase.findUnique({
    where: { id },
    include: { outcomes: { orderBy: { checkpointAt: "asc" } } },
  });
  if (!c || c.teacherId !== clinician.teacherId) notFound();

  const decision = c.decision as { type?: string; details?: string };
  const inputs = c.inputs as {
    ageBand?: string;
    lifeStage?: string;
    symptoms?: string[];
    labs?: Record<string, number | string>;
    history?: string;
  };
  const differential = (c.differential as string[] | null) ?? [];
  const editWindow = timeRemaining(c.createdAt);

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-baseline justify-between">
        <div>
          <Link
            href="/clinician/cases"
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            ← All cases
          </Link>
          <h1 className="text-2xl font-heading font-bold mt-2">
            {decision.type ?? "decision"} · {c.occurredAt.toISOString().slice(0, 10)}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {editWindow.open && (
            <Link
              href={`/clinician/cases/${c.id}/edit`}
              className="px-3 py-1.5 rounded-xl bg-foreground text-background text-xs font-bold"
            >
              Edit
            </Link>
          )}
          <Link
            href={`/clinician/cases/${c.id}/outcome`}
            className="px-3 py-1.5 rounded-xl border border-border text-xs font-bold"
          >
            + Outcome
          </Link>
          {!c.withdrawnAt && (
            <DeleteButton
              caseId={c.id}
              inEditWindow={editWindow.open}
              hasOutcomes={c.outcomes.length > 0}
            />
          )}
        </div>
      </div>

      {c.withdrawnAt && (
        <div className="border border-rose-500/40 rounded-2xl p-4 bg-rose-500/5 text-sm">
          <div className="font-semibold text-rose-700 dark:text-rose-300">
            Withdrawn on {c.withdrawnAt.toISOString().slice(0, 10)}
          </div>
          {c.withdrawnReason && (
            <p className="text-xs text-muted-foreground mt-1">
              Reason: {c.withdrawnReason}
            </p>
          )}
          <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest">
            This case is excluded from NutriMama&apos;s reasoning. Contact the
            team if you need it restored.
          </p>
        </div>
      )}

      <div
        className={`text-xs font-mono rounded-xl px-3 py-2 ${
          editWindow.open
            ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {editWindow.open
          ? `Edit window open — ${editWindow.label}. After 24h this case is locked. To revise then, log a new case.`
          : "Locked. Add an outcome anytime, or log a new case if your reasoning has materially changed."}
      </div>

      <Section title="Decision">
        <p className="text-sm font-semibold">{decision.details ?? "—"}</p>
      </Section>

      <Section title="Patient context">
        <div className="text-xs space-y-1 font-mono">
          {inputs.ageBand && <div>age band: {inputs.ageBand}</div>}
          {inputs.lifeStage && <div>life stage: {inputs.lifeStage}</div>}
          {inputs.symptoms && inputs.symptoms.length > 0 && (
            <div>symptoms: {inputs.symptoms.join(", ")}</div>
          )}
          {inputs.labs && Object.keys(inputs.labs).length > 0 && (
            <div>
              labs:{" "}
              {typeof inputs.labs.notes === "string" &&
              Object.keys(inputs.labs).length === 1
                ? inputs.labs.notes
                : JSON.stringify(inputs.labs)}
            </div>
          )}
          {inputs.history && (
            <div className="text-sm font-sans mt-2 whitespace-pre-wrap">
              {inputs.history}
            </div>
          )}
        </div>
      </Section>

      {differential.length > 0 && (
        <Section title="Differential">
          <ul className="text-sm space-y-1">
            {differential.map((d) => (
              <li key={d}>· {d}</li>
            ))}
          </ul>
        </Section>
      )}

      {c.reasoning && (
        <Section title="Reasoning">
          <p className="text-sm whitespace-pre-wrap">{c.reasoning}</p>
        </Section>
      )}

      <Section title={`Outcomes (${c.outcomes.length})`}>
        {c.outcomes.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No follow-up logged yet. <Link href={`/clinician/cases/${c.id}/outcome`} className="text-primary underline">Add one</Link> when you have data.
          </p>
        ) : (
          <ul className="space-y-2">
            {c.outcomes.map((o) => (
              <li
                key={o.id}
                className="border border-border rounded-xl p-3 bg-card"
              >
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-1">
                  <span>{o.checkpointAt.toISOString().slice(0, 10)}</span>
                  <span>{o.status}</span>
                </div>
                {o.notes && <p className="text-sm">{o.notes}</p>}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </div>
      <div className="border border-border rounded-2xl p-4 bg-card">
        {children}
      </div>
    </div>
  );
}
