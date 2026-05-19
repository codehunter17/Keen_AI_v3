"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createCaseAction } from "./actions";

type Teacher = { id: string; displayName: string; specialty: string };

const DECISION_TYPES = [
  "test",
  "drug",
  "lifestyle",
  "referral",
  "watch",
  "other",
] as const;

export function NewCaseForm({ teachers }: { teachers: Teacher[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  if (teachers.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-2xl p-8 text-center text-sm text-muted-foreground">
        Add a teacher first under{" "}
        <a href="/admin/teachers" className="text-primary underline">
          /admin/teachers
        </a>
        .
      </div>
    );
  }

  return (
    <form
      action={async (fd) => {
        if (submittingRef.current) return;
        submittingRef.current = true;
        setError(null);
        setPending(true);
        try {
          const res = await createCaseAction(fd);
          if (!res.ok) {
            setError(res.error);
            setPending(false);
            submittingRef.current = false;
            return;
          }
          router.push("/admin/cases");
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "save failed");
          setPending(false);
          submittingRef.current = false;
        }
      }}
      className="space-y-6"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Teacher">
          <select
            name="teacherId"
            required
            className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm"
          >
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.displayName} — {t.specialty}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Visit date">
          <input
            name="occurredAt"
            type="date"
            required
            defaultValue={new Date().toISOString().slice(0, 10)}
            className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm"
          />
        </Field>
      </div>

      <Field label="Patient context (anonymized)">
        <div className="grid md:grid-cols-3 gap-3">
          <input
            name="ageBand"
            placeholder="age band — e.g. 25-30"
            className="px-4 py-2 rounded-xl border border-border bg-background text-sm"
          />
          <input
            name="lifeStage"
            placeholder="life stage — e.g. PREGNANT"
            className="px-4 py-2 rounded-xl border border-border bg-background text-sm"
          />
          <input
            name="symptoms"
            placeholder="symptoms, comma-separated"
            className="px-4 py-2 rounded-xl border border-border bg-background text-sm"
          />
        </div>
        <textarea
          name="history"
          placeholder="brief relevant history (no names, no contact info)"
          rows={3}
          className="mt-3 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm"
        />
        <textarea
          name="labsJson"
          placeholder='labs as JSON — e.g. {"TSH": 4.2, "Hb": 10.1}'
          rows={2}
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

      <Field label="Reasoning">
        <textarea
          name="reasoning"
          rows={4}
          placeholder="why this decision over the alternatives — the teaching part Keen learns from"
          className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm"
        />
      </Field>

      <div className="flex items-center gap-3">
        <button
          disabled={pending}
          className="px-5 py-2.5 rounded-xl bg-foreground text-background font-bold text-sm disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save case"}
        </button>
        {error && <span className="text-xs text-rose-600 font-mono">{error}</span>}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}
