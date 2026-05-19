import { getClinician } from "@/lib/clinician-auth";
import { NewCaseForm } from "./new-case-form";

export const dynamic = "force-dynamic";

export default async function ClinicianNewCasePage() {
  const clinician = await getClinician();
  if (!clinician) return null;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-heading font-bold">Capture a clinical case</h1>
        <p className="text-sm text-muted-foreground">
          Anonymized inputs, your decision, and the reasoning. The reasoning
          field is the most valuable — it lets NutriMama&apos;s personalization
          system learn how you think, not just what you prescribed.
        </p>
      </div>

      <div className="border border-amber-500/30 rounded-2xl p-4 bg-amber-500/5 text-xs leading-relaxed text-amber-900 dark:text-amber-300">
        <strong>Privacy note:</strong> do not include the patient&apos;s name,
        phone number, Aadhaar, email, or address. Any such text is scrubbed
        automatically on save. Use age band (e.g. <em>25-30</em>), city /
        state, and clinical context only.
      </div>

      <NewCaseForm />
    </div>
  );
}
