import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProposalActions } from "./actions-client";

export const dynamic = "force-dynamic";

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await prisma.keenProposal.findUnique({
    where: { id },
    include: { opportunity: true },
  });
  if (!p) notFound();

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
          {p.tier} · {p.status}
        </div>
        <h1 className="text-2xl font-heading font-bold">{p.title}</h1>
      </div>

      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Spec
        </h2>
        <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans border border-border rounded-2xl p-4 bg-card">
          {p.spec}
        </pre>
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Files touched
          </h2>
          <ul className="border border-border rounded-2xl p-4 bg-card text-xs font-mono space-y-1">
            {p.filesTouched.length === 0 ? (
              <li className="text-muted-foreground italic">none</li>
            ) : (
              p.filesTouched.map((f) => <li key={f}>{f}</li>)
            )}
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Tables touched
          </h2>
          <ul className="border border-border rounded-2xl p-4 bg-card text-xs font-mono space-y-1">
            {p.tablesTouched.length === 0 ? (
              <li className="text-muted-foreground italic">none</li>
            ) : (
              p.tablesTouched.map((t) => <li key={t}>{t}</li>)
            )}
          </ul>
        </section>
      </div>

      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Risk
        </h2>
        <p className="text-sm border border-border rounded-2xl p-4 bg-card">
          {p.risk}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Rollback plan
        </h2>
        <p className="text-sm border border-border rounded-2xl p-4 bg-card">
          {p.rollbackPlan}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Expected impact
        </h2>
        <p className="text-sm border border-border rounded-2xl p-4 bg-card">
          {p.expectedImpact}
        </p>
      </section>

      {(p.status === "awaiting_approval" || p.status === "draft") && (
        <ProposalActions proposalId={p.id} tier={p.tier} />
      )}

      {p.prUrl && (
        <a
          href={p.prUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-semibold text-primary underline"
        >
          View on GitHub →
        </a>
      )}
    </div>
  );
}
