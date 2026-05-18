"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HeightInput } from "@/components/height-input";
import {
  setBasics,
  setLifeStage,
  setVitals,
  acceptConsents,
} from "@/lib/actions/lifecycle";
import { LANGUAGES, type LanguageCode } from "@/lib/languages";
import { ageFromDob } from "@/lib/lifecycle";

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = 0 | 1 | 2 | 3;

type AdultLifeStage =
  | "ADULT_MENSTRUATING"
  | "TRYING_TO_CONCEIVE"
  | "PREGNANT"
  | "POSTPARTUM"
  | "PERIMENOPAUSE"
  | "MENOPAUSE";

type TeenLifeStage = "TEEN_11_13" | "TEEN_14_17";
type LifeStage = AdultLifeStage | TeenLifeStage | "CHILD_4_7" | "CHILD_8_10";

// ─── Life stage options shown to adults (18+) ────────────────────────────────
const ADULT_LIFE_STAGE_OPTIONS: {
  value: AdultLifeStage;
  label: string;
  desc: string;
  emoji: string;
}[] = [
  { value: "ADULT_MENSTRUATING", label: "Tracking my cycle", desc: "Periods, PCOS awareness, daily wellness", emoji: "🌙" },
  { value: "TRYING_TO_CONCEIVE", label: "Trying to conceive", desc: "Fertility window, prep checklist, nutrition", emoji: "🌱" },
  { value: "PREGNANT", label: "Pregnant", desc: "Week-by-week care, meal plans, risk insights", emoji: "🤰" },
  { value: "POSTPARTUM", label: "Postpartum / new mother", desc: "Recovery, mental health, infant nutrition support", emoji: "👶" },
  { value: "PERIMENOPAUSE", label: "Perimenopause", desc: "Symptom tracking, hormone education", emoji: "🍃" },
  { value: "MENOPAUSE", label: "Menopause", desc: "Daily symptom care, longevity nutrition", emoji: "🌸" },
];

// ─── Exported initial type ────────────────────────────────────────────────────
export type OnboardingInitial = {
  name: string;
  dob: string;
  language: LanguageCode;
  lifeStage: LifeStage | null;
  pregnancyWeek: number | "";
  heightCm: number | undefined;
  weight: string;
  diet: "VEGETARIAN" | "VEGAN" | "NON_VEG";
  consentsAccepted: boolean;
  allowTraining: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeAge(dob: string): number | null {
  if (!dob) return null;
  try { return ageFromDob(new Date(dob)); } catch { return null; }
}

function isMinor(age: number | null): boolean {
  return age !== null && age < 18;
}

function isChild(age: number | null): boolean {
  return age !== null && age < 12;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OnboardingClient({
  initial,
  initialStep,
}: {
  initial: OnboardingInitial;
  initialStep: Step;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(initialStep);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(initial.name);
  const [dob, setDob] = useState(initial.dob);
  const [language, setLanguage] = useState<LanguageCode>(initial.language);
  const [lifeStage, setLifeStageVal] = useState<LifeStage | null>(initial.lifeStage);
  const [pregnancyWeek, setPregnancyWeek] = useState<number | "">(initial.pregnancyWeek);
  const [heightCm, setHeightCm] = useState<number | undefined>(initial.heightCm);
  const [weight, setWeight] = useState<string>(initial.weight);
  const [diet, setDiet] = useState<"VEGETARIAN" | "VEGAN" | "NON_VEG">(initial.diet);
  const [agreedTerms, setAgreedTerms] = useState(initial.consentsAccepted);
  const [agreedPrivacy, setAgreedPrivacy] = useState(initial.consentsAccepted);
  const [agreedMedical, setAgreedMedical] = useState(initial.consentsAccepted);
  const [allowTraining, setAllowTraining] = useState(initial.allowTraining);
  const [parentalConsent, setParentalConsent] = useState(false);

  // Derived age — recomputed whenever dob changes
  const age = computeAge(dob);
  const minor = isMinor(age);
  const child = isChild(age);
  // Children (under 12) skip the life-stage picker — it's auto-set server-side
  const skipLifeStagePicker = child;

  const next = () => setStep((s) => Math.min(3, s + 1) as Step);
  const back = () => setStep((s) => Math.max(0, s - 1) as Step);

  // ── Step 0: basics ──────────────────────────────────────────
  const submitStep0 = () => {
    if (!dob) { setError("Please enter your date of birth."); return; }
    if (minor && !parentalConsent) {
      setError("A parent or guardian must give consent before continuing.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await setBasics({
        dob,
        countryCode: "IN",
        languagePref: language,
        name: name.trim() || undefined,
        parentalConsent: minor ? parentalConsent : undefined,
      });
      if (!res.ok) { setError(res.message); return; }

      // Children (under 12): life stage is auto-set — skip step 1, go to step 2
      if (res.autoLifeStage) {
        setLifeStageVal(res.autoLifeStage as LifeStage);
        setStep(2); // jump straight to vitals
      } else {
        next(); // adults go to life stage picker
      }
    });
  };

  // ── Step 1: life stage (adults + teens only) ────────────────
  const submitStep1 = () => {
    if (!lifeStage) return;
    setError(null);
    startTransition(async () => {
      await setLifeStage({
        lifeStage: lifeStage as any,
        pregnancyWeek:
          lifeStage === "PREGNANT" && typeof pregnancyWeek === "number"
            ? pregnancyWeek
            : undefined,
      });
      next();
    });
  };

  // ── Step 2: vitals ──────────────────────────────────────────
  const submitStep2 = () => {
    setError(null);
    startTransition(async () => {
      await setVitals({
        height: heightCm,
        weight: weight ? parseFloat(weight) : undefined,
        dietaryPref: diet,
        regionalPref: "INDIAN",
      });
      next();
    });
  };

  // ── Step 3: consents ────────────────────────────────────────
  const submitStep3 = () => {
    if (!agreedTerms || !agreedPrivacy || !agreedMedical) return;
    setError(null);
    startTransition(async () => {
      await acceptConsents({
        acceptedTerms: true,
        acceptedPrivacy: true,
        acceptedMedicalDisclaimer: true,
        allowModelTraining: allowTraining,
      });
      router.push("/dashboard");
    });
  };

  // ── Progress bar: step count adjusts when child skips step 1 ─
  const totalSteps = skipLifeStagePicker ? 3 : 4;
  const displayStep = skipLifeStagePicker && step >= 2 ? step - 1 : step;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl">
        <ProgressBar step={displayStep} total={totalSteps} />

        <div className="mt-6 rounded-2xl bg-card lift p-6 sm:p-8">
          <AnimatePresence mode="wait">

            {/* ── Step 0: Name, DOB, Language ─────────────────── */}
            {step === 0 && (
              <Slide key="s0">
                <h1 className="font-heading text-2xl sm:text-3xl text-primary">
                  Welcome to NutriMama
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  A few quick things so we can personalise everything for you.
                </p>

                <label htmlFor="ob-name" className="mt-6 block text-sm font-medium">Your name</label>
                <input
                  id="ob-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya"
                  maxLength={60}
                  autoComplete="given-name"
                  className="mt-1 w-full h-12 rounded-xl border border-border bg-input/40 px-3 outline-none focus:ring-2 focus:ring-ring"
                />

                <label htmlFor="ob-dob" className="mt-5 block text-sm font-medium">Date of birth</label>
                <input
                  id="ob-dob"
                  type="date"
                  value={dob}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setDob(e.target.value)}
                  className="mt-1 w-full h-12 rounded-xl border border-border bg-input/40 px-3 outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {age !== null && age >= 4 && age < 12 &&
                    "🧒 Child mode — you'll see body-safety and nutrition content."}
                  {age !== null && age >= 12 && age < 18 &&
                    "👩 Teen mode — you'll see period care, nutrition and wellness content."}
                  {age !== null && age >= 18 &&
                    "We use this to unlock the right features for your stage of life."}
                  {age !== null && age < 4 &&
                    "⚠️ NutriMama is designed for users aged 4 and above."}
                  {age === null && "We use this to unlock the right features for your stage of life."}
                </p>

                {/* Parental consent — only shown when under-18 DOB entered */}
                {minor && (
                  <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-3">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-2">
                      Parental / Guardian Consent Required (DPDP Act 2023)
                    </p>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={parentalConsent}
                        onChange={(e) => setParentalConsent(e.target.checked)}
                        className="mt-0.5 h-4 w-4 accent-primary"
                      />
                      <span className="text-xs text-amber-800 dark:text-amber-200">
                        I am the parent or guardian of this child and I give consent
                        for NutriMama to provide age-appropriate health education and
                        nutrition content to them.
                      </span>
                    </label>
                  </div>
                )}

                <label className="mt-5 block text-sm font-medium">Language</label>
                <p className="text-[11px] text-muted-foreground">Pick the language you read most easily.</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLanguage(l.code)}
                      className={`h-11 px-4 rounded-full border text-sm font-semibold transition-all ${
                        language === l.code
                          ? "bg-primary text-white border-primary"
                          : "bg-card text-foreground border-border hover:border-primary/40"
                      }`}
                    >
                      {l.native}
                    </button>
                  ))}
                </div>

                {error && <ErrorBanner>{error}</ErrorBanner>}

                <div className="mt-8 flex justify-end">
                  <Button onClick={submitStep0} disabled={!dob || pending || (age !== null && age < 4)}>
                    {pending ? "Saving…" : "Continue"}
                  </Button>
                </div>
              </Slide>
            )}

            {/* ── Step 1: Life stage (adults + teens 12-17 only) ── */}
            {step === 1 && !skipLifeStagePicker && (
              <Slide key="s1">
                <h1 className="font-heading text-2xl sm:text-3xl text-primary">
                  {age !== null && age < 18 ? "A little about you" : "Where are you in your journey?"}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pick what feels closest. You can change this anytime.
                </p>

                <div className="mt-6 grid gap-2">
                  {/* Teens (12–17): only show period-related options */}
                  {age !== null && age >= 12 && age < 18 ? (
                    <>
                      {[
                        { value: "TEEN_11_13" as const, label: "Not started my period yet", desc: "Body changes, puberty education, nutrition", emoji: "🌱" },
                        { value: "TEEN_14_17" as const, label: "My period has started", desc: "Period tracking, cycle care, nutrition", emoji: "🌙" },
                      ].map((opt) => {
                        const active = lifeStage === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setLifeStageVal(opt.value)}
                            className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                              active ? "border-primary bg-accent" : "border-border bg-card hover:bg-accent/40"
                            }`}
                          >
                            <span className="text-2xl leading-none">{opt.emoji}</span>
                            <span>
                              <span className="block font-medium">{opt.label}</span>
                              <span className="block text-xs text-muted-foreground">{opt.desc}</span>
                            </span>
                          </button>
                        );
                      })}
                    </>
                  ) : (
                    /* Adults: full life stage picker */
                    ADULT_LIFE_STAGE_OPTIONS.map((opt) => {
                      const active = lifeStage === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setLifeStageVal(opt.value)}
                          className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                            active ? "border-primary bg-accent" : "border-border bg-card hover:bg-accent/40"
                          }`}
                        >
                          <span className="text-2xl leading-none">{opt.emoji}</span>
                          <span>
                            <span className="block font-medium">{opt.label}</span>
                            <span className="block text-xs text-muted-foreground">{opt.desc}</span>
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>

                {lifeStage === "PREGNANT" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium">How many weeks pregnant are you?</label>
                    <input
                      type="number"
                      min={1}
                      max={45}
                      value={pregnancyWeek}
                      onChange={(e) => setPregnancyWeek(e.target.value ? parseInt(e.target.value) : "")}
                      className="mt-1 w-32 rounded-xl border border-border bg-input/40 px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  <Button variant="ghost" onClick={back} disabled={pending}>Back</Button>
                  <Button onClick={submitStep1} disabled={!lifeStage || pending}>
                    {pending ? "Saving…" : "Continue"}
                  </Button>
                </div>
              </Slide>
            )}

            {/* ── Step 2: Vitals ──────────────────────────────── */}
            {step === 2 && (
              <Slide key="s2">
                <h1 className="font-heading text-2xl sm:text-3xl text-primary">
                  {child ? "A few quick details" : "A few quick details"}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  All optional — skip anything you&apos;d rather not share now.
                </p>

                <div className="mt-6 space-y-4">
                  <HeightInput valueCm={heightCm} onChange={setHeightCm} />
                  <div>
                    <label className="block text-sm font-medium">Weight (kg)</label>
                    <input
                      type="number"
                      min={10}
                      max={250}
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 40"
                      className="mt-1 w-full rounded-xl border border-border bg-input/40 px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <label className="mt-5 block text-sm font-medium">Diet</label>
                <div className="mt-1 flex gap-2">
                  {([["VEGETARIAN", "Vegetarian"], ["VEGAN", "Vegan"], ["NON_VEG", "Non-veg"]] as const).map(([v, label]) => (
                    <button key={v} type="button" onClick={() => setDiet(v)}
                      className={`chip cursor-pointer ${diet === v ? "chip-active" : ""}`}>
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="ghost" onClick={() => setStep(skipLifeStagePicker ? 0 : 1)} disabled={pending}>Back</Button>
                  <Button onClick={submitStep2} disabled={pending}>{pending ? "Saving…" : "Continue"}</Button>
                </div>
              </Slide>
            )}

            {/* ── Step 3: Consents ────────────────────────────── */}
            {step === 3 && (
              <Slide key="s3">
                <h1 className="font-heading text-2xl sm:text-3xl text-primary">One last thing</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Required by India&apos;s DPDP Act and our medical safety promise.
                </p>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="rounded-xl bg-muted p-3">
                    <p className="font-medium">This is not medical advice.</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      NutriMama is a wellness companion. Our AI provides general information and
                      personalised suggestions, but it is <strong>not</strong> a doctor and cannot
                      diagnose, prescribe, or replace professional medical care.
                    </p>
                  </div>

                  <Check checked={agreedTerms} onChange={setAgreedTerms} label={
                    <>I accept the <a href="/legal/terms" target="_blank" className="underline">Terms of Use</a>.</>
                  } />
                  <Check checked={agreedPrivacy} onChange={setAgreedPrivacy} label={
                    <>I&apos;ve read the <a href="/legal/privacy" target="_blank" className="underline">Privacy Policy</a> (DPDP Act 2023 compliant).</>
                  } />
                  <Check checked={agreedMedical} onChange={setAgreedMedical}
                    label="I understand NutriMama is not a substitute for a doctor." />
                  <Check checked={allowTraining} onChange={setAllowTraining} label={
                    <span className="text-muted-foreground">
                      <em>Optional:</em> Help improve NutriMama by allowing anonymized data to train
                      our AI. You can revoke this anytime in Settings.
                    </span>
                  } />
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="ghost" onClick={back} disabled={pending}>Back</Button>
                  <Button onClick={submitStep3}
                    disabled={!agreedTerms || !agreedPrivacy || !agreedMedical || pending}>
                    {pending ? "Saving…" : "Enter NutriMama"}
                  </Button>
                </div>
              </Slide>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = ((step + 1) / total) * 100;
  return (
    <div>
      <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
        <span>Step {step + 1} of {total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function Slide({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

function Check({ checked, onChange, label }: {
  checked: boolean;
  onChange: (b: boolean) => void;
  label: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-border accent-primary" />
      <span>{label}</span>
    </label>
  );
}

function ErrorBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {children}
    </div>
  );
}
