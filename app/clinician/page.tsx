import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getClinician } from "@/lib/clinician-auth";

export const dynamic = "force-dynamic";

export default async function ClinicianHome() {
  const clinician = await getClinician();
  if (!clinician) return null; // layout already 404s

  const [total, last30Days, recent] = await Promise.all([
    prisma.keenClinicalCase.count({ where: { teacherId: clinician.teacherId } }),
    prisma.keenClinicalCase.count({
      where: {
        teacherId: clinician.teacherId,
        occurredAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.keenClinicalCase.findMany({
      where: { teacherId: clinician.teacherId },
      orderBy: { occurredAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-heading font-bold">
          Welcome back, {clinician.displayName}.
        </h1>
        <p className="text-muted-foreground mt-1">
          Your contributions help personalize care for thousands of women across
          India. Thank you.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Cases logged" value={total.toString()} />
        <Stat label="Last 30 days" value={last30Days.toString()} />
        <Stat label="Specialty" value={clinician.specialty} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/clinician/cases/new"
          className="block border border-primary/30 rounded-3xl p-6 bg-primary/5 hover:bg-primary/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-bold">Log a new case</div>
              <div className="text-xs text-muted-foreground">
                Capture the decision + reasoning from a recent consult.
              </div>
            </div>
          </div>
        </Link>
        <Link
          href="/clinician/cases"
          className="block border border-border rounded-3xl p-6 hover:bg-muted/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-bold">My case log</div>
              <div className="text-xs text-muted-foreground">
                Browse and edit cases you have submitted.
              </div>
            </div>
          </div>
        </Link>
      </div>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Recent
        </h2>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            You have not logged any cases yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {recent.map((c) => {
              const dec = c.decision as { type?: string; details?: string };
              return (
                <li
                  key={c.id}
                  className="border border-border rounded-2xl p-4 bg-card"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-1">
                    <span>{dec.type ?? "decision"}</span>
                    <span>{c.occurredAt.toISOString().slice(0, 10)}</span>
                  </div>
                  <p className="text-sm font-semibold">{dec.details ?? "—"}</p>
                  {c.reasoning && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {c.reasoning}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border rounded-2xl p-4 bg-card">
      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="text-2xl font-heading font-bold mt-1">{value}</div>
    </div>
  );
}
