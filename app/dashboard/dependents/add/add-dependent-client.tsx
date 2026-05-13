"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { startConsentFlow, confirmConsent } from "@/lib/actions/dependent";

declare global {
  interface Window {
    Razorpay?: new (opts: RzpOpts) => { open: () => void };
  }
}

interface RzpOpts {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  handler: (r: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
}

function loadScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function AddDependentClient({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1>(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [dob, setDob] = useState("");
  const [relationship, setRelationship] = useState<"DAUGHTER" | "NIECE" | "SISTER" | "OTHER">("DAUGHTER");

  useEffect(() => {
    loadScript();
  }, []);

  const submit = async () => {
    setError(null);
    setPending(true);
    try {
      const res = await startConsentFlow({ firstName, dob, relationship });
      if (!res.ok) {
        setError(res.message);
        return;
      }
      const ok = await loadScript();
      if (!ok || !window.Razorpay) {
        setError("Could not load Razorpay. Check your connection.");
        return;
      }
      const rzp = new window.Razorpay({
        key: res.razorpayKeyId,
        amount: res.amountInPaise,
        currency: "INR",
        name: "NutriMama — verifiable parental consent",
        description: "₹1 will be charged and refunded to verify you're the parent (DPDP Act §9).",
        order_id: res.razorpayOrderId,
        prefill: { name: userName, email: userEmail },
        theme: { color: "#1F4D3F" },
        handler: async (resp) => {
          const c = await confirmConsent({
            razorpayOrderId: resp.razorpay_order_id,
            razorpayPaymentId: resp.razorpay_payment_id,
            razorpaySignature: resp.razorpay_signature,
          });
          if (c.ok) {
            router.push(`/dashboard/dependents/${c.dependentId}`);
          } else {
            setError("Verification failed. Please try again or contact support.");
          }
        },
        modal: { ondismiss: () => setPending(false) },
      });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card lift p-6 sm:p-8">
        <span className="chip border-primary/30 text-primary">Family</span>
        <h1 className="font-heading text-2xl sm:text-3xl text-primary mt-3">
          Add a dependent profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          For your daughter, niece, or sister under 18. India&apos;s DPDP Act
          requires verifiable parental consent — we do this with a ₹1 payment
          that&apos;s <strong>immediately refunded</strong>. No subscription,
          no charge.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">First name</label>
            <input
              value={firstName}
              maxLength={40}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-input/40 px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g. Aanya"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Date of birth</label>
            <input
              type="date"
              value={dob}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDob(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-input/40 px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Profiles are only available for ages 4–17.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium">Relationship</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {(
                [
                  ["DAUGHTER", "Daughter"],
                  ["SISTER", "Sister"],
                  ["NIECE", "Niece"],
                  ["OTHER", "Other"],
                ] as const
              ).map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setRelationship(v)}
                  className={`chip cursor-pointer ${relationship === v ? "chip-active" : ""}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">
            By continuing you confirm you are the parent or legal guardian and
            consent to our processing of this child&apos;s data per the{" "}
            <a href="/legal/privacy" className="underline" target="_blank">Privacy Policy</a>.
          </div>

          {error && (
            <div className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => router.back()} disabled={pending}>
              Cancel
            </Button>
            <Button
              onClick={submit}
              disabled={!firstName || !dob || pending}
            >
              {pending ? "Verifying…" : "Verify with ₹1 (refunded)"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
