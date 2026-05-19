"use client";

// Settings — reorganised to match the keen-ai layout the user uploaded:
//   • Profile card (coral) with name, tracking mode, age, tier pill
//   • TRACKING MODE switch — Period / Pregnant (opens weeks modal)
//   • Settings list — Language / Dark mode / Local-only AI / Export / Reminders / Chat
//   • Subscription card (small)
//   • Sign out
//   • Delete account (minimised at the bottom — DPDP requirement)
//
// Dependents UI is removed (NEXT_PUBLIC_ENABLE_DEPENDENT_PROFILES=false).
// Provider-status panel is hidden (dev-only).

import { useState, useTransition } from "react";
import { displayName, displayInitial } from "@/lib/display-name";
import { NameEditor } from "@/components/name-editor";
import { LanguagePicker } from "@/components/language-picker";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cancelSubscription } from "@/lib/actions/subscription";
import { requestAccountDeletion } from "@/lib/actions/lifecycle";
import { setLocalOnlyMode, exportMyData } from "@/lib/actions/user-prefs";
import {
  startPregnancyTracking,
  stopPregnancyTracking,
} from "@/app/dashboard/pregnancy/actions";
import { format } from "date-fns";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Globe,
  Moon,
  Lock,
  Download,
  Bell,
  Bot,
  ChevronRight,
  LogOut,
  Plus,
  Minus,
  X,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  tier: string;
  tierExpiresAt: Date | null;
  allowModelTraining: boolean;
  languagePref: string | null;
  age: number | null;
  pregnancyStage: string | null;
  pregnancyWeek: number | null;
}

interface ActiveSub {
  id: string;
  tier: string;
  status: string;
  currentPeriodEnd: string;
  amountInPaise: number;
}

export function SettingsClient({
  user,
  activeSub,
  providersSlot,
}: {
  user: User;
  activeSub: ActiveSub | null;
  providersSlot?: React.ReactNode;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [showWeeksModal, setShowWeeksModal] = useState(false);
  const [weeksInModal, setWeeksInModal] = useState(8);
  const [exportingData, setExportingData] = useState(false);

  const isPregnant = user.pregnancyStage === "PREGNANT";
  const localOnly = !user.allowModelTraining;
  const tierLabel =
    user.tier === "FREE" ? "Free" : user.tier === "CARE_49" ? "Care" : "Pro";
  const tierPrice =
    user.tier === "FREE" ? "₹49/mo for Pro" : user.tier === "CARE_49" ? "Care · ₹49/mo" : "Pro · ₹99/mo";

  const cancel = () => {
    startTransition(async () => {
      await cancelSubscription();
      router.refresh();
    });
  };

  const startPregnancy = () => {
    startTransition(async () => {
      const res = await startPregnancyTracking({ weeks: weeksInModal });
      if (res.ok) {
        setShowWeeksModal(false);
        router.refresh();
      }
    });
  };

  const stopPregnancy = () => {
    if (
      !confirm(
        "Switch back to period tracking? Your pregnancy progress will be paused; cycle data stays intact.",
      )
    )
      return;
    startTransition(async () => {
      await stopPregnancyTracking();
      router.refresh();
    });
  };

  const toggleLocalOnly = () => {
    startTransition(async () => {
      await setLocalOnlyMode(!localOnly);
      router.refresh();
    });
  };

  const exportData = () => {
    setExportingData(true);
    startTransition(async () => {
      const res = await exportMyData();
      if (res.ok) {
        // Trigger browser download
        const blob = new Blob([res.data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `nutrimama-data-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert("Couldn't export right now — please try again in a moment.");
      }
      setExportingData(false);
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
    <div className="space-y-5 p-4 sm:p-6 max-w-2xl mx-auto pb-24">
      <h1 className="font-heading text-3xl text-foreground">Settings</h1>

      {/* dev-only provider status (hidden from end users) */}
      {providersSlot}

      {/* ── Profile card (warm coral gradient) ─────────────────── */}
      <section className="rounded-3xl p-6 bg-gradient-to-br from-pink-400 via-rose-400 to-orange-300 text-white relative overflow-hidden shadow-lg shadow-rose-200/40 dark:shadow-rose-900/20">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-orange-200/20 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-heading ring-1 ring-white/30">
            {displayInitial(user)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading text-2xl truncate">{displayName(user)}</p>
            <p className="text-xs text-white/85 mt-0.5">
              {isPregnant ? `🤰 Pregnancy · Week ${user.pregnancyWeek ?? "?"}` : "🌸 Period Tracking"}
              {user.age != null && ` · ${user.age} yrs`}
            </p>
            <span className="mt-2 inline-flex items-center rounded-full bg-white/20 border border-white/30 px-3 py-0.5 text-[11px] font-semibold">
              {tierLabel}
              {user.tier === "FREE" && <span className="ml-1.5 opacity-80">· {tierPrice}</span>}
            </span>
          </div>
        </div>
      </section>

      {/* ── NAME (single tap to edit) ─────────────────────────── */}
      <section className="rounded-3xl bg-card border border-border overflow-hidden">
        <NameEditor currentName={user.name} />
      </section>

      {/* ── TRACKING MODE switcher ─────────────────────────────── */}
      <section className="rounded-3xl bg-card border border-border p-4">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-2 px-1">
          Tracking Mode
        </p>
        <div className="grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-2xl">
          <button
            type="button"
            onClick={isPregnant ? stopPregnancy : undefined}
            disabled={pending}
            className={
              "py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5 " +
              (!isPregnant
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            🌸 Period
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isPregnant) {
                setWeeksInModal(user.pregnancyWeek ?? 8);
                setShowWeeksModal(true);
              }
            }}
            disabled={pending}
            className={
              "py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5 " +
              (isPregnant
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            🤰 Pregnant
          </button>
        </div>
      </section>

      {/* ── Settings list (keen-ai parity) ─────────────────────── */}
      <section className="rounded-3xl bg-card border border-border overflow-hidden divide-y divide-border">
        {/* Language — opens a picker modal */}
        <LanguagePicker currentCode={user.languagePref} />

        {/* Dark Mode — uses the existing ThemeToggle component */}
        <Row
          icon={<Moon className="w-4 h-4 text-amber-500" />}
          label="Dark Mode"
          right={<ThemeToggle />}
        />

        {/* Local-only mode — inverted from allowModelTraining */}
        <Row
          icon={<Lock className="w-4 h-4 text-emerald-600" />}
          label="Local-only mode (no AI)"
          sub="Blocks AI calls and training. Cycle and log features still work."
          right={
            <SwitchToggle
              checked={localOnly}
              onChange={toggleLocalOnly}
              disabled={pending}
            />
          }
        />

        {/* Export data */}
        <button
          type="button"
          onClick={exportData}
          disabled={exportingData || pending}
          className="w-full"
        >
          <Row
            icon={<Download className="w-4 h-4 text-blue-600" />}
            label="Export my data"
            sub="Download all your data as JSON (DPDP §13)."
            right={
              <span className="text-xs text-muted-foreground">
                {exportingData ? "Preparing…" : <ChevronRight className="w-4 h-4" />}
              </span>
            }
          />
        </button>

        {/* Reminders → schedule page */}
        <Link href="/dashboard/schedule" className="block">
          <Row
            icon={<Bell className="w-4 h-4 text-primary" />}
            label="Reminders"
            right={<ChevronRight className="w-4 h-4 text-muted-foreground" />}
          />
        </Link>

        {/* AI Chat → chat page */}
        <Link href="/dashboard/chat" className="block">
          <Row
            icon={<Bot className="w-4 h-4 text-violet-600" />}
            label="AI Chat"
            right={<ChevronRight className="w-4 h-4 text-muted-foreground" />}
          />
        </Link>
      </section>

      {/* ── Subscription card (compact) ────────────────────────── */}
      <section className="rounded-3xl bg-card border border-border p-5">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
          Subscription
        </p>
        {user.tier === "FREE" || !activeSub ? (
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-sm text-foreground/80">You&apos;re on the Free plan.</p>
            <Link
              href="/pricing"
              className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              See plans
            </Link>
          </div>
        ) : (
          <div className="mt-2 space-y-1.5">
            <p className="text-sm">
              <strong>{activeSub.tier === "CARE_49" ? "Care" : "Pro"}</strong> · ₹
              {activeSub.amountInPaise / 100} / month
            </p>
            <p className="text-xs text-muted-foreground">
              Renews on {format(new Date(activeSub.currentPeriodEnd), "dd MMM yyyy")}
            </p>
            {activeSub.status === "ACTIVE" && (
              <button
                type="button"
                onClick={cancel}
                disabled={pending}
                className="text-xs text-destructive hover:underline"
              >
                {pending ? "Canceling…" : "Cancel subscription"}
              </button>
            )}
          </div>
        )}
      </section>

      {/* ── Sign out (Better Auth handles via client) ─────────── */}
      <Link
        href="/auth/sign-in"
        className="block rounded-2xl bg-muted/50 hover:bg-muted transition px-4 py-3.5 text-sm font-medium text-foreground/80 flex items-center gap-2"
        onClick={() => {
          // Better Auth sign-out happens via /api/auth/sign-out — we link
          // to sign-in and let the client clear the session.
          fetch("/api/auth/sign-out", { method: "POST" }).catch(() => {});
        }}
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </Link>

      {/* ── Delete account (minimised at the bottom, DPDP required) ─ */}
      <section className="rounded-3xl border border-border bg-muted/30 p-5">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
          Danger zone
        </p>
        {!deleteOpen ? (
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Delete account · hard-purge within 7 days (DPDP §12)
            </p>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="text-xs text-destructive hover:underline font-semibold"
            >
              Request deletion
            </button>
          </div>
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
      </section>

      {/* ── How-many-weeks modal ──────────────────────────────── */}
      {showWeeksModal && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4 no-print">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setShowWeeksModal(false)}
          />
          <div className="relative w-full max-w-sm bg-card rounded-t-3xl sm:rounded-3xl border border-border shadow-2xl p-6">
            <button
              type="button"
              onClick={() => setShowWeeksModal(false)}
              aria-label="Close"
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-5xl mb-2 text-center" aria-hidden>🤰</div>
            <h2 className="font-heading text-2xl text-center text-foreground">
              How many weeks pregnant?
            </h2>
            <p className="text-xs text-muted-foreground text-center mt-1">
              Enter weeks 1–40
            </p>
            <div className="mt-5 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setWeeksInModal((w) => Math.max(1, w - 1))}
                aria-label="Decrease"
                className="w-12 h-12 rounded-2xl bg-muted hover:bg-muted/70 active:scale-95 transition flex items-center justify-center"
              >
                <Minus className="w-5 h-5" />
              </button>
              <p className="font-heading text-5xl text-primary tabular-nums w-24 text-center">
                {weeksInModal}
              </p>
              <button
                type="button"
                onClick={() => setWeeksInModal((w) => Math.min(40, w + 1))}
                aria-label="Increase"
                className="w-12 h-12 rounded-2xl bg-muted hover:bg-muted/70 active:scale-95 transition flex items-center justify-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowWeeksModal(false)}
                className="rounded-2xl bg-muted hover:bg-muted/70 py-3 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={startPregnancy}
                disabled={pending}
                className="rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-sm font-semibold disabled:opacity-60"
              >
                {pending ? "Starting…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Small layout primitives kept local since they only appear here ──

function Row({
  icon,
  label,
  sub,
  right,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="w-9 h-9 rounded-xl bg-muted/40 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      <div className="shrink-0 flex items-center">{right}</div>
    </div>
  );
}

function SwitchToggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 " +
        (checked ? "bg-emerald-500" : "bg-muted")
      }
    >
      <span
        className={
          "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform " +
          (checked ? "translate-x-5" : "translate-x-0.5")
        }
      />
    </button>
  );
}
