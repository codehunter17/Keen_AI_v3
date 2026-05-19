"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { addTeacherAction } from "./actions";

export function AddTeacherForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        if (submittingRef.current) return;
        submittingRef.current = true;
        setError(null);
        setPending(true);
        try {
          const res = await addTeacherAction(formData);
          if (!res.ok) {
            setError(res.error);
            setPending(false);
            submittingRef.current = false;
            return;
          }
          formRef.current?.reset();
          setPending(false);
          submittingRef.current = false;
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "save failed");
          setPending(false);
          submittingRef.current = false;
        }
      }}
      className="border border-border rounded-2xl p-4 bg-card space-y-3"
    >
      <div className="grid md:grid-cols-3 gap-3">
        <input
          name="displayName"
          required
          placeholder="Dr. Smita Singh"
          className="px-4 py-2 rounded-xl border border-border bg-background text-sm"
        />
        <input
          name="specialty"
          required
          placeholder="OB-GYN"
          className="px-4 py-2 rounded-xl border border-border bg-background text-sm"
        />
        <input
          name="trustWeight"
          defaultValue="1.0"
          type="number"
          step="0.1"
          min="0"
          max="3"
          className="px-4 py-2 rounded-xl border border-border bg-background text-sm font-mono"
        />
      </div>
      <button
        disabled={pending}
        className="px-4 py-2 rounded-xl bg-foreground text-background font-bold text-sm disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add teacher"}
      </button>
      {error && <p className="text-xs text-rose-600 font-mono">{error}</p>}
    </form>
  );
}
