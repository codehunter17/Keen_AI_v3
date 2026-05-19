"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateClinicianCaseAction } from "./actions";

const DECISION_TYPES = [
  "test",
  "drug",
  "lifestyle",
  "referral",
  "watch",
  "other",
] as const;

const LIFE_STAGES = [
  "MENSTRUATING",
  "TRYING_TO_CONCEIVE",
  "PREGNANT",
  "POST_PARTUM",
  "PERIMENOPAUSE",
  "MENOPAUSE",
] as const;

interface Defaults {
  caseId: string;
  occurredAt: string;
  ageBand: string;
  lifeStage: string;
  symptoms: string;
  history: string;
  labsJson: string;
  decisionType: string;
  decisionDetails: string;
  differential: string;
  reasoning: string;
}

export function EditCaseForm({ defaults }: { defaults: Defaults }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  return (
    <form
      action={async (fd) => {
        if (submittingRef.current) return;
        submittingRef.current = true;
        setError(null);
        setPending(true);
        try {
          const res = await updateClinicianCaseAction(defaults.caseId, fd);
          if (!res.ok) {
            setError(res.error);
            setPending(false);
            submittingRef.current = false;
            return;
          }
          router.push(`/clinician/cases/${defaults.caseId}`);
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "save failed");
          setPending(false);
          submittingRef.current = false;
        }
      }}
      className="space-y-6"
    >
      <Field label="Visit date">
        <input
          name="occurredAt"
          type="date"
          required
          defaultValue={defaults.occurredAt}
          className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm"
        />
      </Field>

      <Field label="Patient context (anonymized)">
        <div className="grid md:grid-cols-3 gap-3">
          <input
            name="ageBand"
            defaultValue={defaults.ageBand}
            placeholder="age band — e.g. 25-30"
            className="px-4 py-2 rounded-xl border border-border bg-background text-sm"
          />
          <select
            name="lifeStage"
            defaultValue={defaults.lifeStage}
            className="px-4 py-2 rounded-xl border border-border bg-background text-sm"
          >
            <option value="">life stage…</option>
            {LIFE_STAGES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ").toLowerCase()}
              </option>
            ))}
          </select>
          <input
            name="symptoms"
            defaultValue={defaults.symptoms}
            placeholder="symptoms, comma-separated"
            className="px-4 py-2 rounded-xl border border-border bg-background text-sm"
          />
        </div>
        <textarea
          name="history"
          defaultValue={defaults.history}
          rows={3}
          placeholder="brief relevant history (no identifiers)"
          className="mt-3 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm"
        />
        <textarea
          name="labsJson"
          defaultValue={defaults.labsJson}
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
            defaultValue={defaults.decisionType}
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
            defaultValue={defaults.decisionDetails}
            placeholder="what was decided"
            className="md:col-span-3 px-4 py-2 rounded-xl border border-border bg-background text-sm"
          />
        </div>
      </Field>

      <Field label="Differential">
        <input
          name="differential"
          defaultValue={defaults.differential}
          placeholder="conditions considered, comma-separated"
          className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm"
        />
      </Field>

      <Field label="Reasoning">
        <textarea
          name="reasoning"
          defaultValue={defaults.reasoning}
          rows={5}
          placeholder="why this decision over the alternatives"
          className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm"
        />
      </Field>

      <div className="flex items-center gap-3 pt-2">
        <button
          disabled={pending}
          className="px-5 py-2.5 rounded-xl bg-foreground text-background font-bold text-sm disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/clinician/cases/${defaults.caseId}`)}
          className="px-5 py-2.5 rounded-xl border border-border font-bold text-sm"
        >
          Cancel
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
