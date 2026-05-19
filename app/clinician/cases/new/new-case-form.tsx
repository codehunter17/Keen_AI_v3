"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClinicianCaseAction } from "./actions";

const DECISION_TYPES = [
  "test",
  "drug",
  "lifestyle",
  "referral",
  "watch",
  "other",
] as const;

export function NewCaseForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={(fd) => {
        setError(null);
        startTransition(async () => {
          const res = await createClinicianCaseAction(fd);
          if (!res.ok) {
            setError(res.error);
            return;
          }
          router.push("/clinician/cases");
          router.refresh();
        });
      }}
      className="space-y-6"
    >
      <Field label="Visit date">
        <input
          name="occurredAt"
          type="date"
          required
          defaultValue={new Date().toISOString().slice(0, 10)}
          className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm"
        />
      </Field>

      <Field label="Patient context (anonymized)">
        <div className="grid md:grid-cols-3 gap-3">
          <input
            name="ageBand"
            placeholder="age band — e.g. 25-30"
            className="px-4 py-2 rounded-xl border border-border bg-background text-sm"
          />
          <select
            name="lifeStage"
            className="px-4 py-2 rounded-xl border border-border bg-background text-sm"
            defaultValue=""
          >
            <option value="">life stage…</option>
            <option value="MENSTRUATING">Menstruating</option>
            <option value="TRYING_TO_CONCEIVE">Trying to conceive</option>
            <option value="PREGNANT">Pregnant</option>
            <option value="POST_PARTUM">Post-partum</option>
            <option value="PERIMENOPAUSE">Perimenopause</option>
            <option value="MENOPAUSE">Menopause</option>
          </select>
          <input
            name="symptoms"
            placeholder="symptoms, comma-separated"
            className="px-4 py-2 rounded-xl border border-border bg-background text-sm"
          />
        </div>
        <textarea
          name="history"
          rows={3}
          placeholder="brief relevant history (no identifiers)"
          className="mt-3 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm"
        />
        <textarea
          name="labsJson"
          rows={2}
          placeholder='labs as JSON — e.g. {"TSH": 4.2, "Hb": 10.1}'
          className="mt-3 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm font-mono text-xs"
        />
      </Field>

      <Field label="Decision">
        <div className="grid md:grid-cols-4 gap-3">
          <select
            name="decisionType"
            required
            className="px-4 py-2 rounded-xl border border-border bg-background text-sm"
          >
            {DECISION_TYPES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <input
            name="decisionDetails"
            required
            placeholder="what was decided (drug + dose, test name, etc.)"
            className="md:col-span-3 px-4 py-2 rounded-xl border border-border bg-background text-sm"
          />
        </div>
      </Field>

      <Field label="Differential">
        <input
          name="differential"
          placeholder="conditions considered, comma-separated"
          className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm"
        />
      </Field>

      <Field label="Reasoning (the most valuable field)">
        <textarea
          name="reasoning"
          rows={5}
          placeholder="why this decision over the alternatives — what tipped you toward this approach, what you ruled out, what you'd reconsider if X labs come back changed"
          className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm"
        />
      </Field>

      <div className="flex items-center gap-3 pt-2">
        <button
          disabled={pending}
          className="px-5 py-2.5 rounded-xl bg-foreground text-background font-bold text-sm disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save case"}
        </button>
        {error && (
          <span className="text-xs text-rose-600 font-mono">{error}</span>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}
