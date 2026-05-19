import { listTeachers } from "@/keen";
import { AddTeacherForm } from "./add-teacher-form";

export const dynamic = "force-dynamic";

export default async function TeachersPage() {
  const teachers = await listTeachers();
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
              <li
                key={t.id}
                className="border border-border rounded-2xl p-4 bg-card flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">{t.displayName}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.specialty}
                  </div>
                </div>
                <span className="text-xs font-mono">
                  trust × {t.trustWeight.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
