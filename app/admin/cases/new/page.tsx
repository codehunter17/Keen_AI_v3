import { listTeachers } from "@/keen";
import { NewCaseForm } from "./new-case-form";

export const dynamic = "force-dynamic";

export default async function NewCasePage() {
  const teachers = await listTeachers();
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-heading font-bold">Capture a clinical case</h1>
        <p className="text-sm text-muted-foreground">
          What the doctor saw, decided, and reasoned. This goes straight into
          Keen&apos;s long-term memory.
        </p>
      </div>
      <NewCaseForm teachers={teachers} />
    </div>
  );
}
