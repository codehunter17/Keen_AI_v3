"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Archive, X, Link as LinkIcon, Copy, ShieldOff, ShieldCheck } from "lucide-react";
import {
  updateTeacherAction,
  deleteTeacherAction,
  archiveTeacherAction,
  generateInviteAction,
  setRevokedAction,
} from "./actions";

type Teacher = {
  id: string;
  displayName: string;
  specialty: string;
  trustWeight: number;
  caseCount: number;
  revoked: boolean;
  invitedAt: string | null;
  lastSeenAt: string | null;
};

export function TeacherRow({ teacher }: { teacher: Teacher }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [mode, setMode] = useState<
    "view" | "edit" | "deleting" | "archiving" | "invite"
  >("view");
  const [error, setError] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [name, setName] = useState(teacher.displayName);
  const [specialty, setSpecialty] = useState(teacher.specialty);
  const [trust, setTrust] = useState(teacher.trustWeight.toString());

  const reset = () => {
    setName(teacher.displayName);
    setSpecialty(teacher.specialty);
    setTrust(teacher.trustWeight.toString());
    setError(null);
    setInviteUrl(null);
    setCopied(false);
    setMode("view");
  };

  const generateInvite = () => {
    setError(null);
    setInviteUrl(null);
    setCopied(false);
    setMode("invite");
    startTransition(async () => {
      const res = await generateInviteAction(teacher.id);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setInviteUrl(res.url);
      router.refresh();
    });
  };

  const copyInvite = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const toggleRevoked = (revoked: boolean) => {
    startTransition(async () => {
      const res = await setRevokedAction(teacher.id, revoked);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  };

  const save = () => {
    setError(null);
    startTransition(async () => {
      const res = await updateTeacherAction({
        id: teacher.id,
        displayName: name,
        specialty,
        trustWeight: Number(trust),
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setMode("view");
      router.refresh();
    });
  };

  const confirmDelete = () => {
    setError(null);
    startTransition(async () => {
      const res = await deleteTeacherAction(teacher.id);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  };

  const confirmArchive = () => {
    setError(null);
    startTransition(async () => {
      const res = await archiveTeacherAction(teacher.id);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setMode("view");
      router.refresh();
    });
  };

  if (mode === "edit") {
    return (
      <li className="border border-primary/40 rounded-2xl p-4 bg-card space-y-3">
        <div className="grid md:grid-cols-3 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-background text-sm"
            placeholder="Name"
          />
          <input
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-background text-sm"
            placeholder="Specialty"
          />
          <input
            value={trust}
            onChange={(e) => setTrust(e.target.value)}
            type="number"
            step="0.1"
            min="0"
            max="3"
            className="px-3 py-2 rounded-xl border border-border bg-background text-sm font-mono"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={save}
            disabled={pending}
            className="px-3 py-1.5 rounded-xl bg-foreground text-background text-xs font-bold disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save"}
          </button>
          <button
            onClick={reset}
            disabled={pending}
            className="px-3 py-1.5 rounded-xl border border-border text-xs font-bold"
          >
            Cancel
          </button>
          {error && (
            <span className="text-xs text-rose-600 font-mono">{error}</span>
          )}
        </div>
      </li>
    );
  }

  if (mode === "deleting") {
    return (
      <li className="border border-rose-500/60 rounded-2xl p-4 bg-rose-500/5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold">Delete {teacher.displayName}?</div>
            <div className="text-xs text-muted-foreground mt-1">
              {teacher.caseCount > 0 ? (
                <>
                  This will <strong>cascade-delete {teacher.caseCount}</strong>{" "}
                  case{teacher.caseCount === 1 ? "" : "s"} and their follow-up
                  outcomes. Cannot be undone.
                </>
              ) : (
                <>No cases logged yet — safe to remove.</>
              )}
            </div>
            {teacher.caseCount > 0 && (
              <div className="text-xs text-amber-700 mt-2">
                Consider <strong>Archive</strong> instead — zeros the trust
                weight without losing the case history.
              </div>
            )}
          </div>
          <button
            onClick={reset}
            className="p-1 hover:bg-muted rounded-lg"
            disabled={pending}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={confirmDelete}
            disabled={pending}
            className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold disabled:opacity-50"
          >
            {pending ? "Deleting…" : "Yes, delete permanently"}
          </button>
          {teacher.caseCount > 0 && (
            <button
              onClick={() => setMode("archiving")}
              disabled={pending}
              className="px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold disabled:opacity-50"
            >
              Archive instead
            </button>
          )}
          <button
            onClick={reset}
            disabled={pending}
            className="px-3 py-1.5 rounded-xl border border-border text-xs font-bold"
          >
            Cancel
          </button>
          {error && (
            <span className="text-xs text-rose-600 font-mono">{error}</span>
          )}
        </div>
      </li>
    );
  }

  if (mode === "archiving") {
    return (
      <li className="border border-amber-500/60 rounded-2xl p-4 bg-amber-500/5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold">
              Archive {teacher.displayName}?
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Sets trust weight to 0. Their {teacher.caseCount} case
              {teacher.caseCount === 1 ? "" : "s"} stay as historical evidence
              but stop influencing Keen&apos;s reasoning.
            </div>
          </div>
          <button
            onClick={reset}
            className="p-1 hover:bg-muted rounded-lg"
            disabled={pending}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={confirmArchive}
            disabled={pending}
            className="px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold disabled:opacity-50"
          >
            {pending ? "Archiving…" : "Yes, archive"}
          </button>
          <button
            onClick={reset}
            disabled={pending}
            className="px-3 py-1.5 rounded-xl border border-border text-xs font-bold"
          >
            Cancel
          </button>
          {error && (
            <span className="text-xs text-rose-600 font-mono">{error}</span>
          )}
        </div>
      </li>
    );
  }

  if (mode === "invite") {
    return (
      <li className="border border-primary/40 rounded-2xl p-4 bg-primary/5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold">
              Invite link for {teacher.displayName}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Single-click sign-in for the clinician. Treat like a password —
              share via WhatsApp or signed email only. Valid for 1 year. Revoke
              anytime with the shield icon.
            </div>
          </div>
          <button
            onClick={reset}
            className="p-1 hover:bg-muted rounded-lg"
            disabled={pending}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {pending && !inviteUrl && (
          <div className="text-xs text-muted-foreground font-mono">
            Generating…
          </div>
        )}
        {inviteUrl && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                value={inviteUrl}
                readOnly
                className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-xs font-mono"
                onFocus={(e) => e.target.select()}
              />
              <button
                onClick={copyInvite}
                className="px-3 py-2 rounded-xl bg-foreground text-background text-xs font-bold flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Hi ${teacher.displayName}, here's your NutriMama contributor link. Click once to sign in — it'll remember you. ${inviteUrl}`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-bold text-emerald-700 hover:underline"
            >
              → Share via WhatsApp
            </a>
          </div>
        )}
        {error && (
          <p className="text-xs text-rose-600 font-mono">{error}</p>
        )}
      </li>
    );
  }

  // view mode
  return (
    <li className="border border-border rounded-2xl p-4 bg-card flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="font-semibold truncate flex items-center gap-2">
          <span>{teacher.displayName}</span>
          {teacher.revoked && (
            <span className="text-[10px] uppercase tracking-wider font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-full">
              revoked
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {teacher.specialty} · {teacher.caseCount} case
          {teacher.caseCount === 1 ? "" : "s"}
          {teacher.lastSeenAt && (
            <span>
              {" "}
              · last seen {new Date(teacher.lastSeenAt).toISOString().slice(0, 10)}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-muted-foreground">
          trust × {teacher.trustWeight.toFixed(2)}
        </span>
        <button
          onClick={generateInvite}
          className="p-2 rounded-lg hover:bg-primary/10 text-primary"
          aria-label="Generate invite link"
          title="Generate clinician invite link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        {teacher.revoked ? (
          <button
            onClick={() => toggleRevoked(false)}
            className="p-2 rounded-lg hover:bg-emerald-500/10 text-emerald-700"
            aria-label="Restore access"
            title="Restore portal access"
            disabled={pending}
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => toggleRevoked(true)}
            className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-600"
            aria-label="Revoke access"
            title="Revoke portal access (token stops working immediately)"
            disabled={pending}
          >
            <ShieldOff className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => setMode("edit")}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
          aria-label="Edit teacher"
          title="Edit"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => setMode("archiving")}
          className="p-2 rounded-lg hover:bg-amber-500/10 text-amber-700"
          aria-label="Archive teacher (set trust to 0)"
          title="Archive (keeps cases)"
        >
          <Archive className="w-4 h-4" />
        </button>
        <button
          onClick={() => setMode("deleting")}
          className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-600"
          aria-label="Delete teacher"
          title="Delete (cascades to cases)"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </li>
  );
}
