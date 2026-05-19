import Link from "next/link";
import { listCases } from "@/keen";

export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const cases = await listCases(100);

  return (
    <div className="space-y-8">
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

      {cases.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No cases yet.</p>
      ) : (
        <ul className="space-y-2">
          {cases.map((c) => {
            const decision = c.decision as { type?: string; details?: string };
            return (
              <li
                key={c.id}
                className="border border-border rounded-2xl p-4 bg-card"
              >
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
                  <span>
                    {c.teacher.displayName} · {c.teacher.specialty}
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
                {c.outcomes.length > 0 && (
                  <div className="mt-2 flex gap-2 text-[10px] uppercase tracking-wider font-bold">
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
