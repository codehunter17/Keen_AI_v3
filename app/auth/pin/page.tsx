"use client";

// PIN setup screen — visual language from keen-ai's "Set Your PIN" screen.
// Two-phase flow: enter → confirm. After success, redirect to /dashboard.
// "Skip for now" lets users defer.
//
// Visual style: deep-aubergine background, coral lock icon with glow,
// big serif title, dot indicators above a numeric keypad.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Lock, Delete } from "lucide-react";
import { setPin } from "@/lib/actions/pin";

type Phase = "enter" | "confirm";
const PIN_LENGTH = 4;

export default function SetPinPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [phase, setPhase] = useState<Phase>("enter");
  const [pin, setPin1] = useState("");
  const [confirmPin, setPin2] = useState("");
  const [error, setError] = useState<string | null>(null);

  const activePin = phase === "enter" ? pin : confirmPin;
  const setActive = phase === "enter" ? setPin1 : setPin2;

  const press = (digit: string) => {
    setError(null);
    if (activePin.length >= PIN_LENGTH) return;
    setActive(activePin + digit);
    // Auto-advance: when entering phase fills up, jump to confirm
    if (phase === "enter" && activePin.length + 1 === PIN_LENGTH) {
      setTimeout(() => setPhase("confirm"), 200);
    }
    // Auto-submit on confirm phase fill
    if (phase === "confirm" && activePin.length + 1 === PIN_LENGTH) {
      setTimeout(() => submit(confirmPin + digit), 200);
    }
  };

  const backspace = () => {
    setError(null);
    setActive(activePin.slice(0, -1));
  };

  const submit = (confirmedPin: string) => {
    startTransition(async () => {
      const res = await setPin({ pin, confirmPin: confirmedPin });
      if (!res.ok) {
        setError(res.message ?? "Could not set PIN. Try again.");
        // Reset to phase 1 on mismatch / weak PIN
        setPhase("enter");
        setPin1("");
        setPin2("");
        return;
      }
      router.push("/dashboard");
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#221927] dark:bg-background text-white">
      {/* Lock icon with red glow */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 rounded-3xl bg-red-500/40 blur-3xl scale-150" />
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shadow-2xl">
          <Lock className="w-9 h-9 text-white" strokeWidth={2.5} />
        </div>
      </motion.div>

      <h1 className="font-heading text-3xl sm:text-4xl text-white mb-1 tracking-tight">
        {phase === "enter" ? "Set Your PIN" : "Confirm Your PIN"}
      </h1>
      <p className="text-sm text-white/60 mb-5">
        {phase === "enter"
          ? `Set a ${PIN_LENGTH}-digit PIN to lock your app`
          : "Enter the same PIN again"}
      </p>

      {/* 2-segment progress (enter / confirm) */}
      <div className="flex gap-2 mb-7">
        <span
          className={`h-1 w-10 rounded-full ${phase === "enter" ? "bg-rose-500" : "bg-emerald-500"}`}
        />
        <span
          className={`h-1 w-10 rounded-full ${phase === "confirm" ? "bg-rose-500" : "bg-white/15"}`}
        />
      </div>

      {/* Dot indicators */}
      <div className="flex gap-4 mb-2">
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: i < activePin.length ? 1.15 : 1,
              backgroundColor: i < activePin.length ? "rgb(244 63 94)" : "rgba(255,255,255,0.18)",
            }}
            className="w-3 h-3 rounded-full"
          />
        ))}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-rose-400 mt-3 max-w-xs text-center"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Numeric keypad */}
      <div className="grid grid-cols-3 gap-3 mt-8 w-full max-w-[280px]">
        {([
          ["1", ""],
          ["2", "ABC"],
          ["3", "DEF"],
          ["4", "GHI"],
          ["5", "JKL"],
          ["6", "MNO"],
          ["7", "PQRS"],
          ["8", "TUV"],
          ["9", "WXYZ"],
        ] as const).map(([num, letters]) => (
          <button
            key={num}
            type="button"
            disabled={pending}
            onClick={() => press(num)}
            className="aspect-[1.1] rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] active:bg-white/[0.18] active:scale-95 transition-all flex flex-col items-center justify-center"
          >
            <span className="font-heading text-2xl text-white">{num}</span>
            {letters && (
              <span className="text-[9px] tracking-widest text-white/45 -mt-0.5">
                {letters}
              </span>
            )}
          </button>
        ))}
        <div /> {/* empty cell for layout */}
        <button
          type="button"
          disabled={pending}
          onClick={() => press("0")}
          className="aspect-[1.1] rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 transition-all flex items-center justify-center"
        >
          <span className="font-heading text-2xl text-white">0</span>
        </button>
        <button
          type="button"
          disabled={pending || activePin.length === 0}
          onClick={backspace}
          aria-label="Backspace"
          className="aspect-[1.1] rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 transition-all flex items-center justify-center disabled:opacity-30"
        >
          <Delete className="w-5 h-5 text-white" />
        </button>
      </div>

      <Link
        href="/dashboard"
        className="mt-7 text-sm text-white/55 underline-offset-4 hover:underline"
      >
        Skip for now
      </Link>

      <p className="mt-10 text-[10px] uppercase tracking-[0.3em] text-white/30">
        NutriMama
      </p>
    </div>
  );
}
