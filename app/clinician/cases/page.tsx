import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getClinician } from "@/lib/clinician-auth";

export const dynamic = "force-dynamic";

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

function editWindow(createdAt: Date) {
  const remaining = EDIT_WINDOW_MS - (Date.now() - createdAt.getTime());
  if (remaining <= 0) return null;
  const h = Math.floor(remaining / (60 * 60 * 1000));
  const m = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  return `${h}h ${m}m`;
}

export default async function ClinicianCasesPage() {
  const clinician = await getClinician();
  if (!clinician) return null;

  const cases = await prisma.keenClinicalCase.findMany({
    where: { teacherId: clinician.teacherId },
    orderBy: { occurredAt: "desc" },
    take: 100,
    include: { outcomes: { orderBy: { checkpointAt: "asc" } } },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">My case log</h1>
          <p className="text-sm text-muted-foreground">
            {cases.length} case{cases.length === 1 ? "" : "s"} contributed
          </p>
        </div>
        <Link
          href="/clinician/cases/new"
          className="px-4 py-2 rounded-xl bg-foreground text-background font-bold text-sm"
        >
          + New case
        </Link>
      </div>

      {cases.length === 0 ? (
        <div className="border border-dashed border-border rounded-3xl p-12 text-center text-sm text-muted-foreground">
          You have not logged any cases yet. Click <strong>+ New case</strong>{" "}
          to capture your first one.
        </div>
      ) : (
        <ul className="space-y-2">
          {cases.map((c) => {
            const decision = c.decision as { type?: string; details?: string };
            const inputs = c.inputs as {
              ageBand?: string;
              lifeStage?: string;
              symptoms?: string[];
            };
            const win = editWindow(c.createdAt);
            return (
              <li
                key={c.id}
                className="border border-border rounded-2xl p-4 bg-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/clinician/cases/${c.id}`}
                    className="block flex-1 min-w-0 hover:opacity-80"
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
                      <span>
                        {decision.type ?? "decision"}
                        {inputs.ageBand ? ` · age ${inputs.ageBand}` : ""}
                        {inputs.lifeStage ? ` · ${inputs.lifeStage}` : ""}
                      </span>
                      <span>{c.occurredAt.toISOString().slice(0, 10)}</span>
                    </div>
                    <p className="text-sm font-semibold">
                      {decision.details ?? "—"}
                    </p>
                    {c.reasoning && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                        {c.reasoning}
                      </p>
                    )}
                  </Link>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {win && (
                      <Link
                        href={`/clinician/cases/${c.id}/edit`}
                        className="px-2.5 py-1 rounded-lg bg-foreground text-background text-[10px] font-bold uppercase tracking-wider"
                      >
                        Edit · {win}
                      </Link>
                    )}
                    <Link
                      href={`/clinician/cases/${c.id}/outcome`}
                      className="px-2.5 py-1 rounded-lg border border-border text-[10px] font-bold uppercase tracking-wider"
                    >
                      + Outcome
                    </Link>
                  </div>
                </div>
                {c.outcomes.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-wider font-bold">
                    {c.outcomes.map((o) => (
                      <span
                        key={o.id}
                        className="px-2 py-0.5 rounded-full bg-muted"
                      >
                        {o.checkpointAt.toISOString().slice(0, 10)} · {o.status}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
