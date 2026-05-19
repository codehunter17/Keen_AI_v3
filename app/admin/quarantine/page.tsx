import { prisma } from "@/lib/prisma";
import { QuarantineRow } from "./quarantine-row";

export const dynamic = "force-dynamic";

export default async function QuarantinePage() {
  const [content, ips] = await Promise.all([
    prisma.keenQuarantine.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.keenQuarantineIp.findMany({
      where: { releasedAt: null },
      orderBy: { lastSeenAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h1 className="text-2xl font-heading font-bold">Quarantine</h1>
          <span className="text-xs text-muted-foreground font-mono">
            {content.length} content · {ips.length} ips
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Content flagged by the moderation worker before it touched a public
          table. IPs flagged by the telemetry stream (injection patterns or
          velocity anomalies). Release = restore the content / unblock the IP.
          Purge = permanent delete.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Flagged content
        </h2>
        {content.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No flagged content. Moderation worker is quiet.
          </p>
        ) : (
          <ul className="space-y-2">
            {content.map((q) => (
              <QuarantineRow
                key={q.id}
                row={{
                  id: q.id,
                  contentKind: q.contentKind,
                  content: q.content,
                  flagReason: q.flagReason,
                  confidence: q.confidence,
                  modelUsed: q.modelUsed,
                  status: q.status,
                  createdAt: q.createdAt.toISOString(),
                  pseudonym: q.pseudonym,
                }}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Quarantined IPs
        </h2>
        {ips.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No IPs currently quarantined.
          </p>
        ) : (
          <ul className="space-y-2">
            {ips.map((ip) => (
              <li
                key={ip.id}
                className="border border-border rounded-2xl p-4 bg-card"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-mono text-sm font-semibold">
                      {ip.ip}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {ip.reason} · severity {ip.severity} · hits {ip.hits} ·
                      expires{" "}
                      {ip.expiresAt
                        ? ip.expiresAt.toISOString().slice(0, 16)
                        : "never"}
                    </div>
                  </div>
                  <form
                    action={`/api/keen/quarantine/ip/${encodeURIComponent(ip.ip)}/release`}
                    method="post"
                  >
                    <button className="px-3 py-1.5 rounded-xl border border-border text-xs font-bold">
                      Release
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
