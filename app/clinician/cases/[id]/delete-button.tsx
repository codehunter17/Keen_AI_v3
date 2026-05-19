"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, X } from "lucide-react";
import { deleteOrWithdrawCaseAction } from "./delete/actions";

export function DeleteButton({
  caseId,
  inEditWindow,
  hasOutcomes,
}: {
  caseId: string;
  inEditWindow: boolean;
  hasOutcomes: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const confirm = () => {
    setError(null);
    startTransition(async () => {
      const res = await deleteOrWithdrawCaseAction(caseId, reason);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push("/clinician/cases");
      router.refresh();
    });
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-500/5"
      >
        <Trash2 className="w-3.5 h-3.5" />
        {inEditWindow ? "Delete" : "Withdraw"}
      </button>
    );
  }

  return (
    <div className="border border-rose-500/40 rounded-2xl p-4 bg-rose-500/5 space-y-3 max-w-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">
            {inEditWindow ? "Delete this case?" : "Withdraw this case?"}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {inEditWindow ? (
              <>
                Within edit window — this will permanently delete the case
                {hasOutcomes ? " AND all its outcomes" : ""}. Cannot be undone.
              </>
            ) : (
              <>
                Edit window has closed. The case will be marked withdrawn but
                preserved for audit. NutriMama&apos;s personalization system
                will stop using it. Please provide a brief reason.
              </>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            setOpen(false);
            setReason("");
            setError(null);
          }}
          className="p-1 hover:bg-muted rounded-lg"
          disabled={pending}
          aria-label="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {!inEditWindow && (
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. wrong patient context, outcome data showed approach was inappropriate, duplicate entry"
          rows={2}
          className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm"
        />
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={confirm}
          disabled={pending}
          className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold disabled:opacity-50"
        >
          {pending
            ? "Working…"
            : inEditWindow
              ? "Yes, delete permanently"
              : "Yes, withdraw"}
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setReason("");
            setError(null);
          }}
          disabled={pending}
          className="px-3 py-1.5 rounded-xl border border-border text-xs font-bold"
        >
          Cancel
        </button>
        {error && (
          <span className="text-xs text-rose-700 font-mono">{error}</span>
        )}
      </div>
    </div>
  );
}
