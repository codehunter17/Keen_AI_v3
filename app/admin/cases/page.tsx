import Link from "next/link";
import { listCases } from "@/keen";

export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const cases = await listCases(100);
  const active = cases.filter((c) => !c.withdrawnAt);
  const withdrawn = cases.filter((c) => c.withdrawnAt);

  return (
    <div className="space-y-12">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Clinical cases</h1>
          <p className="text-sm text-muted-foreground">
            Doctor visits captured as structured cases. The brain learns from
            these.
          </p>
        </div>
        <Link
          href="/admin/cases/new"
          className="px-4 py-2 rounded-xl bg-foreground text-background font-bold text-sm"
        >
          New case
        </Link>
      </div>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Active
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            {active.length} rows
          </span>
        </div>
        {active.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No active cases yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {active.map((c) => (
              <CaseRow key={c.id} c={c} />
            ))}
          </ul>
        )}
      </section>

      {withdrawn.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Withdrawn
            </h2>
            <span className="text-xs text-muted-foreground font-mono">
              {withdrawn.length} rows · audit only, excluded from reasoning
            </span>
          </div>
          <ul className="space-y-2">
            {withdrawn.map((c) => (
              <CaseRow key={c.id} c={c} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function CaseRow({
  c,
}: {
  c: {
    id: string;
    teacher: { displayName: string; specialty: string };
    occurredAt: Date;
    decision: unknown;
    reasoning: string | null;
    outcomes: { id: string; checkpointAt: Date; status: string }[];
    withdrawnAt: Date | null;
    withdrawnReason: string | null;
    withdrawnBy: string | null;
  };
}) {
  const decision = c.decision as { type?: string; details?: string };
  return (
    <li
      className={
        c.withdrawnAt
          ? "border border-rose-500/30 rounded-2xl p-4 bg-rose-500/5"
          : "border border-border rounded-2xl p-4 bg-card"
      }
    >
      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
        <span>
          {c.teacher.displayName} · {c.teacher.specialty}
          {c.withdrawnAt && (
            <span className="ml-2 px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 uppercase tracking-wider">
              withdrawn
            </span>
          )}
        </span>
        <span>{c.occurredAt.toISOString().slice(0, 10)}</span>
      </div>
      <p className="text-sm font-semibold mb-1">
        {decision.type ?? "decision"}: {decision.details ?? "—"}
      </p>
      {c.reasoning && (
        <p className="text-xs text-muted-foreground line-clamp-2">
          {c.reasoning}
        </p>
      )}
      {c.withdrawnAt && (
        <p className="text-xs text-rose-700 dark:text-rose-300 mt-2">
          Withdrawn {c.withdrawnAt.toISOString().slice(0, 10)} by{" "}
          {c.withdrawnBy ?? "unknown"}
          {c.withdrawnReason ? ` — ${c.withdrawnReason}` : ""}
        </p>
      )}
      {c.outcomes.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-wider font-bold">
          {c.outcomes.map((o) => (
            <span key={o.id} className="px-2 py-0.5 rounded-full bg-muted">
              {o.checkpointAt.toISOString().slice(0, 10)} · {o.status}
            </span>
          ))}
        </div>
      )}
    </li>
  );
}
