"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logOutcomeAction } from "./actions";

const PRESET_CHECKPOINTS = [
  { label: "+1 week", days: 7 },
  { label: "+2 weeks", days: 14 },
  { label: "+1 month", days: 30 },
  { label: "+3 months", days: 90 },
];

const STATUSES = [
  { value: "improved", label: "Improved" },
  { value: "unchanged", label: "Unchanged" },
  { value: "worsened", label: "Worsened" },
  { value: "unknown", label: "Unknown / no contact" },
] as const;

export function OutcomeForm({
  caseId,
  caseOccurredAt,
}: {
  caseId: string;
  caseOccurredAt: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkpointAt, setCheckpointAt] = useState(
    new Date().toISOString().slice(0, 10),
  );

  const setPreset = (days: number) => {
    const d = new Date(caseOccurredAt);
    d.setDate(d.getDate() + days);
    setCheckpointAt(d.toISOString().slice(0, 10));
  };

  return (
    <form
      action={async (fd) => {
        setError(null);
        setPending(true);
        try {
          const res = await logOutcomeAction(caseId, fd);
          if (!res.ok) {
            setError(res.error);
            setPending(false);
            return;
          }
          router.push(`/clinician/cases/${caseId}`);
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "save failed");
          setPending(false);
        }
      }}
      className="space-y-6"
    >
      <Field label="Checkpoint date">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {PRESET_CHECKPOINTS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setPreset(p.days)}
                className="px-3 py-1.5 rounded-full border border-border text-xs font-bold hover:bg-muted"
              >
                {p.label}
              </button>
            ))}
          </div>
          <input
            name="checkpointAt"
            type="date"
            required
            value={checkpointAt}
            onChange={(e) => setCheckpointAt(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm"
          />
        </div>
      </Field>

      <Field label="Outcome">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {STATUSES.map((s) => (
            <label
              key={s.value}
              className="border border-border rounded-xl p-3 text-sm cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary/40 transition-colors"
            >
              <input
                type="radio"
                name="status"
                value={s.value}
                required
                className="mr-2"
              />
              {s.label}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Notes (optional)">
        <textarea
          name="notes"
          rows={4}
          placeholder="What changed? Side effects? Compliance? Any context worth remembering for similar cases."
          className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm"
        />
      </Field>

      <div className="flex items-center gap-3 pt-2">
        <button
          disabled={pending}
          className="px-5 py-2.5 rounded-xl bg-foreground text-background font-bold text-sm disabled:opacity-50"
        >
          {pending ? "Saving…" : "Log outcome"}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/clinician/cases/${caseId}`)}
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
