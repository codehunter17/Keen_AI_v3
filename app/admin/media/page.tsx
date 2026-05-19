import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function fmt(d: Date | null | string) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toISOString().replace("T", " ").slice(0, 16) + "Z";
}

export default async function MediaPage() {
  const [jobs, feed] = await Promise.all([
    prisma.keenMediaJob.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.appContentFeed.findMany({
      orderBy: { publishedAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h1 className="text-2xl font-heading font-bold">Media jobs</h1>
          <span className="text-xs text-muted-foreground font-mono">
            {jobs.length} rows
          </span>
        </div>
        {jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No jobs yet.</p>
        ) : (
          <ul className="space-y-2">
            {jobs.map((j) => (
              <li
                key={j.id}
                className="border border-border rounded-2xl p-4 bg-card"
              >
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
                  <span>
                    {j.platform} · {j.kind} · {j.status}
                  </span>
                  <span>{fmt(j.createdAt)}</span>
                </div>
                <p className="text-sm font-semibold mb-1">{j.title}</p>
                {j.externalUrl && (
                  <a
                    href={j.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary underline"
                  >
                    {j.externalUrl}
                  </a>
                )}
                {j.errorTail && (
                  <p className="text-xs text-rose-600 font-mono mt-2">
                    {j.errorTail}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-2xl font-heading font-bold">Public feed</h2>
          <span className="text-xs text-muted-foreground font-mono">
            {feed.length} rows
          </span>
        </div>
        {feed.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Empty feed.</p>
        ) : (
          <ul className="grid md:grid-cols-2 gap-3">
            {feed.map((f) => (
              <li
                key={f.id}
                className="border border-border rounded-2xl p-4 bg-card"
              >
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
                  <span>
                    {f.kind} · {f.locale}
                  </span>
                  <span>{fmt(f.publishedAt)}</span>
                </div>
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {f.description}
                </p>
                <a
                  href={f.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-wider font-bold text-primary mt-2 inline-block"
                >
                  open ↗
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
