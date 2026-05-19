"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { addTeacherAction } from "./actions";

export function AddTeacherForm() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const res = await addTeacherAction(formData);
          if (!res.ok) {
            setError(res.error);
            return;
          }
          router.refresh();
        });
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
        Add teacher
      </button>
      {error && <p className="text-xs text-rose-600 font-mono">{error}</p>}
    </form>
  );
}
