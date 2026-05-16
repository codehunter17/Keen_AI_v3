"use client";

// Inline name editor — used in Settings and as the body of the
// "What should we call you?" nudge on the dashboard.
//
// Designed for low-literacy users: big input, pencil icon WITH the word
// "Edit", plain English placeholder, explicit Save button (no save-on-blur
// surprises), and a hint that explains the Ma'am default.

import { useState, useTransition } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { updateProfile } from "@/lib/actions/profile";
import { useRouter } from "next/navigation";
import { displayName } from "@/lib/display-name";

export function NameEditor({
  currentName,
  variant = "row",
  onSaved,
}: {
  currentName: string | null | undefined;
  variant?: "row" | "card";
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentName ?? "");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    const next = value.trim().slice(0, 60);
    setError(null);
    startTransition(async () => {
      try {
        await updateProfile({ name: next });
        setEditing(false);
        router.refresh();
        onSaved?.();
      } catch (e) {
        console.error("[name-editor] save failed", e);
        setError("Couldn't save. Please try again.");
      }
    });
  };

  const cancel = () => {
    setValue(currentName ?? "");
    setEditing(false);
    setError(null);
  };

  // Card variant — used in the dashboard nudge.
  if (variant === "card") {
    return (
      <div className="rounded-3xl bg-card border border-border p-4 sm:p-5 space-y-3 shadow-sm">
        <label
          htmlFor="name-field"
          className="block text-sm font-semibold text-foreground"
        >
          What should we call you?
        </label>
        <input
          id="name-field"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Your name (e.g. Priya, Sita…)"
          maxLength={60}
          autoComplete="given-name"
          className="w-full h-12 px-4 rounded-2xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground leading-relaxed">
          We&apos;ll use this name in greetings and chat. If you skip this,
          we&apos;ll call you <strong>Ma&apos;am</strong>.
        </p>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="h-12 px-5 rounded-full bg-primary text-white font-semibold hover:opacity-90 transition flex items-center gap-2 disabled:opacity-60"
          >
            {pending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>Save name</span>
          </button>
          <button
            type="button"
            onClick={cancel}
            disabled={pending}
            className="h-12 px-5 rounded-full border border-border text-foreground font-semibold hover:bg-muted transition flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Skip</span>
          </button>
        </div>
      </div>
    );
  }

  // Row variant — used inside Settings list.
  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-3">
        <span
          className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center"
          aria-hidden
        >
          <Pencil className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">Your name</p>
          {!editing && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              We call you <strong>{displayName(currentName)}</strong>
            </p>
          )}
        </div>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="h-10 px-4 rounded-full border border-border text-sm font-semibold hover:bg-muted transition inline-flex items-center gap-1.5"
            aria-label="Edit your name"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        )}
      </div>

      {editing && (
        <div className="mt-3 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Your name (or leave blank for Ma'am)"
            maxLength={60}
            autoComplete="given-name"
            autoFocus
            className="w-full h-12 px-4 rounded-2xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="h-11 px-4 rounded-full bg-primary text-white font-semibold text-sm flex items-center gap-1.5 hover:opacity-90 transition disabled:opacity-60"
            >
              {pending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Save
            </button>
            <button
              type="button"
              onClick={cancel}
              disabled={pending}
              className="h-11 px-4 rounded-full border border-border text-sm font-semibold hover:bg-muted transition flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
