import { prisma } from "@/lib/prisma";
import { AddTeacherForm } from "./add-teacher-form";
import { TeacherRow } from "./teacher-row";

export const dynamic = "force-dynamic";

export default async function TeachersPage() {
  const teachers = await prisma.keenTeacher.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { cases: { where: { withdrawnAt: null } } },
      },
    },
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-heading font-bold">Teachers</h1>
        <p className="text-sm text-muted-foreground">
          Clinicians whose decisions Keen learns from. Higher trust weight ⇒ more
          influence on the brain&apos;s reasoning.
        </p>
      </div>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Add teacher
        </h2>
        <AddTeacherForm />
      </section>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Roster
        </h2>
        {teachers.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No teachers yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {teachers.map((t) => (
              <TeacherRow
                key={t.id}
                teacher={{
                  id: t.id,
                  displayName: t.displayName,
                  specialty: t.specialty,
                  trustWeight: t.trustWeight,
                  caseCount: t._count.cases,
                  revoked: t.revoked,
                  invitedAt: t.invitedAt?.toISOString() ?? null,
                  lastSeenAt: t.lastSeenAt?.toISOString() ?? null,
                }}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
