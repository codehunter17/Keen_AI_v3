"use client";

// 4-step Daily Check-in modal — ported from keen-ai.
// Replaces the old single-step sleep/mood/movement modal.
//
// Steps:
//   1. Meals planned (pick 2-6 number-pill)
//   2. Supplements taken today (multi-select with "None today" override)
//   3. Water goal (slider 0.5-4 L)
//   4. Symptoms + mood (multi-select pills + final CTA "Start My Day!")
//
// Auto-opens once per UTC day if user hasn't done their check-in.
// Persists into DailyLog.checkin (one row per day, upsert).

import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { submitDailyCheckin } from "@/lib/actions/checkin";

type Step = 1 | 2 | 3 | 4;
type Supplement = "IRON" | "FOLIC_ACID" | "CALCIUM" | "MULTIVITAMIN" | "NONE";

const SYMPTOMS = [
  { key: "tiredness", label: "Tiredness", emoji: "😩" },
  { key: "dizziness", label: "Dizziness", emoji: "😵" },
  { key: "nausea", label: "Nausea", emoji: "🤢" },
  { key: "swelling", label: "Swelling", emoji: "🥵" },
  { key: "headache", label: "Headache", emoji: "🤕" },
  { key: "fine", label: "Feeling fine", emoji: "😊" },
] as const;

const SUPPLEMENTS: { key: Supplement; label: string; emoji: string }[] = [
  { key: "IRON", label: "Iron", emoji: "🔴" },
  { key: "FOLIC_ACID", label: "Folic Acid", emoji: "🟢" },
  { key: "CALCIUM", label: "Calcium", emoji: "🟠" },
  { key: "MULTIVITAMIN", label: "Multivitamin", emoji: "🟡" },
  { key: "NONE", label: "None today", emoji: "❌" },
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function DailyCheckIn() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  const [mealsPlanned, setMealsPlanned] = useState<number>(3);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [waterTargetL, setWaterTargetL] = useState<number>(2);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState<string | null>(null);

  // Auto-open once per UTC day, 2s after mount, only if not already done today.
  useEffect(() => {
    const last = localStorage.getItem("nm_checkin_date");
    if (last === todayKey()) return;
    const t = setTimeout(() => setIsOpen(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setIsOpen(false);
  };

  const toggleSupplement = (s: Supplement) => {
    setSupplements((prev) => {
      // "None today" is mutually exclusive with the others
      if (s === "NONE") return prev.includes("NONE") ? [] : ["NONE"];
      const without = prev.filter((p) => p !== "NONE");
      return without.includes(s) ? without.filter((p) => p !== s) : [...without, s];
    });
  };

  const toggleSymptom = (k: string) => {
    setSymptoms((prev) => {
      if (k === "fine") return prev.includes("fine") ? [] : ["fine"];
      const without = prev.filter((p) => p !== "fine");
      return without.includes(k) ? without.filter((p) => p !== k) : [...without, k];
    });
  };

  const submit = () => {
    startTransition(async () => {
      const res = await submitDailyCheckin({
        mealsPlanned,
        supplements,
        waterTargetL,
        symptoms,
        mood: mood ?? undefined,
      });
      if (res.ok) {
        localStorage.setItem("nm_checkin_date", todayKey());
        setDone(true);
        setTimeout(() => {
          setIsOpen(false);
          // Reset for next session
          setTimeout(() => {
            setDone(false);
            setStep(1);
          }, 400);
        }, 1800);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 no-print">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="relative w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl border border-border shadow-2xl overflow-hidden"
        >
          {done ? (
            <div className="p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-heading text-2xl text-foreground">
                Check-in complete!
              </h2>
              <p className="text-sm text-muted-foreground">
                Today&apos;s plan saved. Have a wonderful day 🌸
              </p>
            </div>
          ) : (
            <>
              {/* Header: title + 4-step progress + close */}
              <div className="px-6 pt-5 pb-4 flex items-center justify-between">
                <h3 className="font-heading text-lg text-foreground">Daily Check-in</h3>
                <div className="flex items-center gap-2">
                  <ProgressDots step={step} total={4} />
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close"
                    className="ml-2 p-1.5 rounded-full text-muted-foreground hover:bg-muted"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Step body */}
              <div className="px-6 pb-4">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <StepBody key="1">
                      <Hero emoji="🌸" title="Good morning!" sub="Nutrition now shapes your future health" />
                      <FocusBlock />
                      <Question text="🥣 How many meals are you planning today?" />
                      <div className="grid grid-cols-5 gap-2 mt-3">
                        {[2, 3, 4, 5, 6].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setMealsPlanned(n)}
                            className={
                              "py-3 rounded-2xl border font-heading text-lg transition " +
                              (mealsPlanned === n
                                ? "bg-rose-500 text-white border-rose-500 shadow-md"
                                : "bg-card border-border text-muted-foreground hover:border-rose-300")
                            }
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                      <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1">
                        ✅ Good plan for the day
                      </p>
                    </StepBody>
                  )}

                  {step === 2 && (
                    <StepBody key="2">
                      <h4 className="font-heading text-xl text-foreground">💊 Any supplements today?</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Supplements help fill nutritional gaps. Be honest — it helps your analysis.
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {SUPPLEMENTS.map((s) => {
                          const active = supplements.includes(s.key);
                          return (
                            <button
                              key={s.key}
                              type="button"
                              onClick={() => toggleSupplement(s.key)}
                              className={
                                "py-2.5 rounded-full border text-sm font-medium transition " +
                                (active
                                  ? "bg-rose-500 text-white border-rose-500"
                                  : "bg-card border-border text-foreground/80 hover:border-rose-300")
                              }
                            >
                              <span className="mr-1.5">{s.emoji}</span>
                              {s.label}
                            </button>
                          );
                        })}
                      </div>
                    </StepBody>
                  )}

                  {step === 3 && (
                    <StepBody key="3">
                      <h4 className="font-heading text-xl text-foreground">💧 Water goal for today</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Water is essential for iron and folate absorption. Set your target.
                      </p>
                      <div className="mt-5">
                        <div className="flex items-baseline justify-between">
                          <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                            Target water today
                          </span>
                          <span className="font-heading text-2xl text-emerald-700">
                            {waterTargetL}L
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0.5}
                          max={4}
                          step={0.5}
                          value={waterTargetL}
                          onChange={(e) => setWaterTargetL(parseFloat(e.target.value))}
                          className="w-full mt-3 accent-emerald-600"
                        />
                        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                          {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].map((v) => (
                            <span key={v}>{v}</span>
                          ))}
                        </div>
                        <div className="mt-3 rounded-xl bg-emerald-50 text-emerald-700 px-3 py-2 text-xs">
                          ✅ {waterTargetL >= 2 && waterTargetL <= 3 ? "Good target" : waterTargetL < 2 ? "Aim a bit higher if you can" : "Make sure your kidneys handle this much"}
                        </div>
                        <p className="mt-3 rounded-xl bg-violet-50 text-violet-800 px-3 py-2 text-xs">
                          💡 Tip: Start folate-rich foods even before planning pregnancy
                        </p>
                      </div>
                    </StepBody>
                  )}

                  {step === 4 && (
                    <StepBody key="4">
                      <h4 className="font-heading text-xl text-foreground">😩 Any symptoms today?</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Symptoms help us assess your nutritional risk accurately. Be honest.
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {SYMPTOMS.map((s) => {
                          const active = symptoms.includes(s.key);
                          return (
                            <button
                              key={s.key}
                              type="button"
                              onClick={() => toggleSymptom(s.key)}
                              className={
                                "py-2.5 rounded-full border text-sm font-medium transition " +
                                (active
                                  ? "bg-rose-500 text-white border-rose-500"
                                  : "bg-card border-border text-foreground/80 hover:border-rose-300")
                              }
                            >
                              <span className="mr-1.5">{s.emoji}</span>
                              {s.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Quick mood chip */}
                      <p className="mt-5 text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                        Overall mood today
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {["Great", "Calm", "Low", "Irritable", "Tired"].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setMood(mood === m ? null : m)}
                            className={
                              "rounded-full border px-3 py-1 text-xs font-medium transition " +
                              (mood === m
                                ? "bg-amber-500 text-white border-amber-500"
                                : "bg-card border-border text-foreground/80 hover:border-amber-300")
                            }
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </StepBody>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer — Back / Next or final CTA */}
              <div className="px-6 pb-6 pt-2 flex items-center gap-2">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => (s - 1) as Step)}
                    className="px-4 py-3 rounded-2xl bg-muted text-foreground/80 text-sm font-semibold inline-flex items-center gap-1.5 hover:bg-muted/80"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => (s + 1) as Step)}
                    className="flex-1 py-3 rounded-2xl bg-rose-500 text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-rose-600 transition"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submit}
                    disabled={pending}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5 hover:opacity-95 active:scale-95 transition disabled:opacity-60"
                  >
                    <Sparkles className="w-4 h-4" />
                    {pending ? "Saving…" : "Start My Day!"}
                  </button>
                )}
              </div>

              {/* Skip */}
              <div className="text-center pb-4">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("nm_checkin_date", todayKey());
                    close();
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                >
                  Skip for today
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const completed = i + 1 < step;
        const active = i + 1 === step;
        return (
          <span
            key={i}
            className={
              "h-1.5 rounded-full transition-all " +
              (completed
                ? "w-3 bg-emerald-500"
                : active
                  ? "w-6 bg-rose-500"
                  : "w-3 bg-muted")
            }
          />
        );
      })}
    </div>
  );
}

function StepBody({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

function Hero({ emoji, title, sub }: { emoji: string; title: string; sub: string }) {
  return (
    <div className="text-center mb-4">
      <div className="text-4xl mb-2" aria-hidden>{emoji}</div>
      <h4 className="font-heading text-xl text-foreground">{title}</h4>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

function FocusBlock() {
  return (
    <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 p-3.5 mb-4">
      <p className="text-xs font-semibold text-rose-700 dark:text-rose-300 mb-1.5">
        🎯 Reproductive Health 🌸 — Today&apos;s Focus
      </p>
      <ul className="text-[12px] text-foreground/85 leading-relaxed space-y-1">
        <li>• Iron for monthly replenishment</li>
        <li>• Folate — essential if planning pregnancy</li>
        <li>• Calcium for long-term bone health</li>
      </ul>
    </div>
  );
}

function Question({ text }: { text: string }) {
  return <h4 className="font-heading text-base text-foreground mt-2">{text}</h4>;
}
