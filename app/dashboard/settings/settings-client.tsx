"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cancelSubscription } from "@/lib/actions/subscription";
import { requestAccountDeletion, setAllowModelTraining } from "@/lib/actions/lifecycle";
import { deleteDependent } from "@/lib/actions/dependent";
import { format } from "date-fns";

interface User {
  id: string;
  email: string;
  name: string;
  tier: string;
  tierExpiresAt: Date | null;
  allowModelTraining: boolean;
  languagePref: string | null;
}

interface ActiveSub {
  id: string;
  tier: string;
  status: string;
  currentPeriodEnd: string;
  amountInPaise: number;
}

interface Dependent {
  id: string;
  firstName: string;
  ageBand: string;
  relationship: string;
  hasMenarche: boolean;
  cycleTrackingEnabled: boolean;
}

export function SettingsClient({
  user,
  activeSub,
  dependents,
  providersSlot,
}: {
  user: User;
  activeSub: ActiveSub | null;
  dependents: Dependent[];
  providersSlot?: React.ReactNode;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");

  const cancel = () => {
    startTransition(async () => {
      await cancelSubscription();
      router.refresh();
    });
  };

  const removeDependent = (id: string) => {
    if (!confirm("Remove this dependent profile? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteDependent(id);
      router.refresh();
    });
  };

  const requestDeletion = () => {
    startTransition(async () => {
      await requestAccountDeletion(deleteReason || undefined);
      alert(
        "Your deletion request is recorded. Your data will be hard-deleted within 7 days. You can sign back in to cancel.",
      );
      router.push("/");
    });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-3xl mx-auto">
      <header>
        <h1 className="font-heading text-3xl text-primary">Settings</h1>
      </header>

      {providersSlot}

      {/* Account */}
      <section className="rounded-2xl bg-card lift p-6">
        <h2 className="font-heading text-xl text-primary">Account</h2>
        <dl className="mt-3 grid grid-cols-3 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Name</dt>
          <dd className="col-span-2">{user.name}</dd>
          <dt className="text-muted-foreground">Email</dt>
          <dd className="col-span-2">{user.email}</dd>
          <dt className="text-muted-foreground">Language</dt>
          <dd className="col-span-2">{user.languagePref === "hi" ? "हिन्दी" : "English"}</dd>
        </dl>
      </section>

      {/* Subscription */}
      <section className="rounded-2xl bg-card lift p-6">
        <h2 className="font-heading text-xl text-primary">Subscription</h2>
        {user.tier === "FREE" || !activeSub ? (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground">
              You&apos;re on the Free plan.
            </p>
            <a
              href="/pricing"
              className="mt-3 inline-block rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              See plans
            </a>
          </div>
        ) : (
          <div className="mt-2 space-y-2">
            <p className="text-sm">
              <strong>{activeSub.tier === "CARE_49" ? "Care" : "Pro"}</strong> ·{" "}
              ₹{activeSub.amountInPaise / 100} / month ·{" "}
              <span
                className={`chip text-[10px] py-0.5 ${
                  activeSub.status === "ACTIVE"
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-destructive/10 text-destructive border-destructive/30"
                }`}
              >
                {activeSub.status.toLowerCase()}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              Renews on{" "}
              {format(new Date(activeSub.currentPeriodEnd), "dd MMM yyyy")}.
            </p>
            {activeSub.status === "ACTIVE" && (
              <Button
                variant="ghost"
                onClick={cancel}
                disabled={pending}
                className="text-destructive"
              >
                {pending ? "Canceling…" : "Cancel subscription"}
              </Button>
            )}
          </div>
        )}
      </section>

      {/* Dependents */}
      <section className="rounded-2xl bg-card lift p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl text-primary">
            Family / dependent profiles
          </h2>
          <a
            href="/dashboard/dependents/add"
            className="text-sm text-primary underline"
          >
            Add a profile
          </a>
        </div>
        {dependents.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No dependent profiles yet. Add one for your daughter, sister, or
            niece (under 18). Requires verified parental consent.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {dependents.map((d) => (
              <li key={d.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{d.firstName}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.relationship.toLowerCase()} ·{" "}
                    {d.ageBand.replace("BAND_", "ages ").replace("_", "–")}
                    {d.hasMenarche && " · cycle tracking on"}
                  </p>
                </div>
                <button
                  onClick={() => removeDependent(d.id)}
                  className="text-xs text-destructive hover:underline"
                  disabled={pending}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Privacy */}
      <section className="rounded-2xl bg-card lift p-6">
        <h2 className="font-heading text-xl text-primary">Privacy</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You&apos;re in control. Withdraw any consent below at any time.
        </p>

        <div className="mt-4 rounded-xl bg-muted/40 border border-border p-3 text-xs text-muted-foreground leading-relaxed">
          <p className="font-medium text-foreground mb-1">
            How your data is protected
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              Your <strong>name and email never leave the account record</strong>.
              They are not attached to chats, logs, reports, or anything used
              for training.
            </li>
            <li>
              Training and ML pipelines only see a <strong>random account ID</strong>{" "}
              (a UUID with no link back to your identity).
            </li>
            <li>
              Aadhaar, PAN, phone numbers, ABHA IDs, and bank details are
              automatically redacted before any message reaches our AI providers.
            </li>
            <li>
              Encrypted in transit (TLS 1.2+) and at rest (AES-256).
            </li>
          </ul>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium">Allow anonymized data for AI training</p>
              <p className="text-xs text-muted-foreground">
                {user.allowModelTraining ? "Granted" : "Not granted"} — toggle
                anytime. Only your pseudonymous ID is used; never your name or
                email.{" "}
                <a href="/legal/privacy" className="underline">
                  Read the policy
                </a>
                .
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={user.allowModelTraining}
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await setAllowModelTraining(!user.allowModelTraining);
                  router.refresh();
                })
              }
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
                user.allowModelTraining ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  user.allowModelTraining ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-border">
          <h3 className="text-sm font-medium text-destructive">Delete my account</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Per India&apos;s DPDP Act, you can request deletion of your account
            and all data. We hard-delete within 7 days.
          </p>
          {!deleteOpen ? (
            <Button
              variant="ghost"
              onClick={() => setDeleteOpen(true)}
              className="mt-2 text-destructive"
            >
              Request deletion
            </Button>
          ) : (
            <div className="mt-2 space-y-2">
              <textarea
                placeholder="Why are you leaving? (optional, helps us improve)"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-border bg-input/40 px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={requestDeletion}
                  disabled={pending}
                >
                  {pending ? "Submitting…" : "Confirm deletion"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
