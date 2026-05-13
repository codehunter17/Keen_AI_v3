"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { redeemOwnerCode } from "@/lib/actions/subscription";

export function RedeemForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || pending) return;
    setMsg(null);
    startTransition(async () => {
      const res = await redeemOwnerCode({ code: code.trim() });
      if (res.ok) {
        setMsg({ type: "ok", text: "Pro unlocked! Refreshing…" });
        setCode("");
        router.refresh();
      } else {
        setMsg({ type: "err", text: res.error });
      }
    });
  };

  return (
    <form onSubmit={submit} className="mt-10 mx-auto max-w-md">
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-sm font-semibold text-foreground mb-1">
          Have a coupon code?
        </p>
        <p className="text-xs text-muted-foreground mb-3">
          Redeem to unlock Pro instantly — no payment required.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
            className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            disabled={pending}
          />
          <button
            type="submit"
            disabled={pending || !code.trim()}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all"
          >
            {pending ? "Redeeming…" : "Redeem"}
          </button>
        </div>
        {msg && (
          <p
            className={`mt-3 text-xs font-medium ${
              msg.type === "ok" ? "text-primary" : "text-red-500"
            }`}
          >
            {msg.text}
          </p>
        )}
      </div>
    </form>
  );
}
