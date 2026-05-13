"use client";

// Floating action button — one tap, four shortcuts.
// Inspired by Keen_AI's draggable FAB pattern but kept simple (no drag for v1).
// Lives bottom-right above the mobile bottom nav, opens a fan of action chips.

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, X, Droplet, Heart, Flame, Sparkles } from "lucide-react";
import { logWaterIntake } from "@/lib/actions/wellness";

export function QuickActionsFab() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState<string | null>(null);

  const drinkWater = () =>
    startTransition(async () => {
      await logWaterIntake({ ml: 250 });
      setConfirm("water");
      setTimeout(() => setConfirm(null), 1800);
      router.refresh();
    });

  return (
    <div className="fixed bottom-24 md:bottom-6 right-5 z-40 flex flex-col items-end gap-2.5 no-print">
      {open && (
        <>
          <FabAction
            label="Log a meal"
            icon={<Sparkles className="w-5 h-5" />}
            color="bg-primary text-primary-foreground"
            href="/dashboard/meals"
            onClick={() => setOpen(false)}
          />
          <FabAction
            label="Log period"
            icon={<Heart className="w-5 h-5" />}
            color="bg-secondary text-secondary-foreground"
            href="/dashboard/cycle"
            onClick={() => setOpen(false)}
          />
          <FabAction
            label="+ 250 ml water"
            icon={<Droplet className="w-5 h-5" />}
            color="bg-card border border-border text-foreground"
            disabled={pending}
            onClick={drinkWater}
          />
          <FabAction
            label="Streak"
            icon={<Flame className="w-5 h-5" />}
            color="bg-card border border-border text-foreground"
            href="/dashboard/badges"
            onClick={() => setOpen(false)}
          />
        </>
      )}

      {confirm === "water" && (
        <div className="rounded-full bg-foreground text-background px-3 py-1.5 text-xs font-semibold shadow-lg animate-in fade-in zoom-in">
          ✓ 250 ml logged
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all ${
          open
            ? "bg-foreground text-background rotate-45"
            : "bg-primary text-primary-foreground hover:scale-105"
        }`}
        aria-label={open ? "Close quick actions" : "Open quick actions"}
      >
        {open ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>
    </div>
  );
}

function FabAction({
  label,
  icon,
  color,
  href,
  onClick,
  disabled,
}: {
  label: string;
  icon: React.ReactNode;
  color: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const inner = (
    <div className={`flex items-center gap-2 rounded-full pl-3 pr-4 py-2 shadow-lg ${color} ${disabled ? "opacity-50" : "hover:scale-[1.03]"} transition-transform`}>
      {icon}
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
  if (href) {
    return (
      <Link href={href} onClick={onClick} className="block">
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="block">
      {inner}
    </button>
  );
}
