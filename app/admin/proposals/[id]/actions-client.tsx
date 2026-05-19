"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function ProposalActions({
  proposalId,
  tier,
}: {
  proposalId: string;
  tier: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState<string | null>(null);

  const post = (action: "approve" | "reject") => {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/keen/proposals/${proposalId}/decide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          passphrase: tier === "L4" ? passphrase : undefined,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.detail ?? data.state ?? "Failed.");
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="border border-border rounded-2xl p-4 bg-card space-y-3">
      {tier === "L4" && (
        <input
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          placeholder="Passphrase (L4 required)"
          className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm font-mono"
        />
      )}
      <div className="flex gap-2">
        <button
          disabled={pending}
          onClick={() => post("approve")}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-sm disabled:opacity-50"
        >
          Approve
        </button>
        <button
          disabled={pending}
          onClick={() => post("reject")}
          className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-sm disabled:opacity-50"
        >
          Reject
        </button>
      </div>
      {error && <p className="text-xs text-rose-600 font-mono">{error}</p>}
    </div>
  );
}
