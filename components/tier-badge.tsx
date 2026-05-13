"use client";

import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
import { getMyTier } from "@/lib/actions/subscription";

export function TierBadge() {
  const [tier, setTier] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getMyTier()
      .then((r) => {
        if (alive) setTier(r.tier);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!tier || tier === "FREE") return null;

  const isPro = tier === "PRO_99";
  const label = isPro ? "PRO" : "CARE";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm ${
        isPro
          ? "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
          : "bg-gradient-to-r from-emerald-500 to-emerald-700 text-white"
      }`}
      title={`You're on the ${label} plan`}
    >
      <Crown className="w-3 h-3" />
      {label}
    </span>
  );
}
