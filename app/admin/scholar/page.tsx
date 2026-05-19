import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function fmt(d: Date | null | string) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toISOString().replace("T", " ").slice(0, 16) + "Z";
}

export default async function ScholarPage() {
  const [sources, findings, conflicts, models] = await Promise.all([
    prisma.keenScholarSource.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.keenScholarFinding.findMany({
      orderBy: { lastCitedAt: "desc" },
      take: 50,
      include: { source: { select: { name: true, kind: true } } },
    }),
    prisma.keenScholarConflict.findMany({
      where: { status: "open" },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        findingA: { select: { topic: true, outcome: true, studyUrl: true } },
        findingB: { select: { topic: true, outcome: true, studyUrl: true } },
      },
    }),
    prisma.keenPretrainedModel.findMany({ orderBy: { task: "asc" } }),
  ]);

  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h1 className="text-2xl font-heading font-bold">Scholar sources</h1>
          <span className="text-xs text-muted-foreground font-mono">
            {sources.length} registered
          </span>
        </div>
        <ul className="grid md:grid-cols-2 gap-3">
          {sources.map((s) => (
            <li key={s.id} className="border border-border rounded-2xl p-4 bg-card">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
                <span>{s.kind}</span>
                <span>trust × {s.defaultTrustWeight.toFixed(2)}</span>
              </div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                last harvest: {fmt(s.lastHarvestedAt)}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-2xl font-heading font-bold">Open conflicts</h2>
          <span className="text-xs text-muted-foreground font-mono">
            {conflicts.length} pending
          </span>
        </div>
        {conflicts.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No conflicting findings.
          </p>
        ) : (
          <ul className="space-y-3">
            {conflicts.map((c) => (
              <li
                key={c.id}
                className="border border-amber-500/40 rounded-2xl p-4 bg-amber-500/5"
              >
                <p className="text-sm font-semibold mb-2">{c.reason}</p>
                <div className="grid md:grid-cols-2 gap-3 text-xs">
                  <a
                    href={c.findingA.studyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-border rounded-xl p-3 bg-background hover:border-primary/40"
                  >
                    <div className="font-bold">A · {c.findingA.topic}</div>
                    <div className="text-muted-foreground mt-1 line-clamp-3">
                      {c.findingA.outcome}
                    </div>
                  </a>
                  <a
                    href={c.findingB.studyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-border rounded-xl p-3 bg-background hover:border-primary/40"
                  >
                    <div className="font-bold">B · {c.findingB.topic}</div>
                    <div className="text-muted-foreground mt-1 line-clamp-3">
                      {c.findingB.outcome}
                    </div>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-2xl font-heading font-bold">Recent findings</h2>
          <span className="text-xs text-muted-foreground font-mono">
            {findings.length} rows
          </span>
        </div>
        {findings.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No findings yet. Trigger the scholar harvester or wait for cron.
          </p>
        ) : (
          <ul className="space-y-2">
            {findings.map((f) => (
              <li
                key={f.id}
                className="border border-border rounded-2xl p-4 bg-card"
              >
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
                  <span>
                    {f.source.name} · {f.source.kind}
                  </span>
                  <span>
                    trust × {f.trustWeight.toFixed(2)} · cited {f.citationCount}
                  </span>
                </div>
                <p className="text-sm font-semibold">{f.topic}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {f.outcome}
                </p>
                <a
                  href={f.studyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-wider font-bold text-primary mt-2 inline-block"
                >
                  study ↗
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-2xl font-heading font-bold">Pretrained models</h2>
          <span className="text-xs text-muted-foreground font-mono">
            {models.length} registered
          </span>
        </div>
        <ul className="space-y-2">
          {models.map((m) => (
            <li key={m.id} className="border border-border rounded-2xl p-4 bg-card">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
                <span>{m.task}</span>
                <span>
                  {m.invocationCount} calls · {m.avgLatencyMs ?? "—"}ms
                </span>
              </div>
              <div className="font-mono text-xs">{m.hfModelId}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {m.description}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
