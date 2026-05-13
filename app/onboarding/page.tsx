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

// Generic, life-stage-aware onboarding.
// Flow: DOB → life stage → quick vitals → consents → done.
// Pregnancy-specific deep questionnaire moved to dashboard sub-flow.

type Step = 0 | 1 | 2 | 3;

type LifeStage =
  | "ADULT_MENSTRUATING"
  | "TRYING_TO_CONCEIVE"
  | "PREGNANT"
  | "POSTPARTUM"
  | "PERIMENOPAUSE"
  | "MENOPAUSE";

const LIFE_STAGE_OPTIONS: {
  value: LifeStage;
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

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Step 0 — DOB
  const [dob, setDob] = useState("");
  const [language, setLanguage] = useState<"en" | "hi">("en");

  // Step 1 — life stage
  const [lifeStage, setLifeStageVal] = useState<LifeStage | null>(null);
  const [pregnancyWeek, setPregnancyWeek] = useState<number | "">("");

  // Step 2 — vitals. Height is held in cm; HeightInput handles unit toggle.
  const [heightCm, setHeightCm] = useState<number | undefined>(undefined);
  const [weight, setWeight] = useState<string>("");
  const [diet, setDiet] = useState<"VEGETARIAN" | "VEGAN" | "NON_VEG">("VEGETARIAN");

  // Step 3 — consents
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedMedical, setAgreedMedical] = useState(false);
  const [allowTraining, setAllowTraining] = useState(false);

  const next = () => setStep((s) => Math.min(3, s + 1) as Step);
  const back = () => setStep((s) => Math.max(0, s - 1) as Step);

  const submitStep0 = () => {
    setError(null);
    startTransition(async () => {
      const res = await setBasics({ dob, countryCode: "IN", languagePref: language });
      if (!res.ok) {
        setError(res.message);
        return;
      }
      next();
    });
  };

  const submitStep1 = () => {
    if (!lifeStage) return;
    setError(null);
    startTransition(async () => {
      await setLifeStage({
        lifeStage,
        pregnancyWeek:
          lifeStage === "PREGNANT" && typeof pregnancyWeek === "number"
            ? pregnancyWeek
            : undefined,
      });
      next();
    });
  };

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

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl">
        <ProgressBar step={step} total={4} />

        <div className="mt-6 rounded-2xl bg-card lift p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <Slide key="s0">
                <h1 className="font-heading text-2xl sm:text-3xl text-primary">
                  Welcome to NutriMama
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  A few quick things so we can personalize everything for you.
                </p>

                <label className="mt-6 block text-sm font-medium">Your date of birth</label>
                <input
                  type="date"
                  value={dob}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setDob(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-input/40 px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  We use this to unlock the right features for your stage of life.
                  NutriMama is for users 18 and over.
                </p>

                <label className="mt-5 block text-sm font-medium">Language</label>
                <div className="mt-1 flex gap-2">
                  {(["en", "hi"] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLanguage(l)}
                      className={`chip cursor-pointer ${language === l ? "chip-active" : ""}`}
                    >
                      {l === "en" ? "English" : "हिन्दी"}
                    </button>
                  ))}
                </div>

                {error && <ErrorBanner>{error}</ErrorBanner>}

                <div className="mt-8 flex justify-end">
                  <Button onClick={submitStep0} disabled={!dob || pending}>
                    {pending ? "Saving…" : "Continue"}
                  </Button>
                </div>
              </Slide>
            )}

            {step === 1 && (
              <Slide key="s1">
                <h1 className="font-heading text-2xl sm:text-3xl text-primary">
                  Where are you in your journey?
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pick what feels closest. You can change this anytime.
                </p>

                <div className="mt-6 grid gap-2">
                  {LIFE_STAGE_OPTIONS.map((opt) => {
                    const active = lifeStage === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setLifeStageVal(opt.value)}
                        className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                          active
                            ? "border-primary bg-accent"
                            : "border-border bg-card hover:bg-accent/40"
                        }`}
                      >
                        <span className="text-2xl leading-none">{opt.emoji}</span>
                        <span>
                          <span className="block font-medium">{opt.label}</span>
                          <span className="block text-xs text-muted-foreground">
                            {opt.desc}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {lifeStage === "PREGNANT" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium">
                      How many weeks pregnant are you?
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={45}
                      value={pregnancyWeek}
                      onChange={(e) =>
                        setPregnancyWeek(e.target.value ? parseInt(e.target.value) : "")
                      }
                      className="mt-1 w-32 rounded-xl border border-border bg-input/40 px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Don&apos;t know exactly? Pick the nearest week — you can refine later.
                    </p>
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  <Button variant="ghost" onClick={back} disabled={pending}>
                    Back
                  </Button>
                  <Button onClick={submitStep1} disabled={!lifeStage || pending}>
                    {pending ? "Saving…" : "Continue"}
                  </Button>
                </div>
              </Slide>
            )}

            {step === 2 && (
              <Slide key="s2">
                <h1 className="font-heading text-2xl sm:text-3xl text-primary">
                  A few quick details
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
                      min={25}
                      max={250}
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 58"
                      className="mt-1 w-full rounded-xl border border-border bg-input/40 px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <label className="mt-5 block text-sm font-medium">Diet</label>
                <div className="mt-1 flex gap-2">
                  {(
                    [
                      ["VEGETARIAN", "Vegetarian"],
                      ["VEGAN", "Vegan"],
                      ["NON_VEG", "Non-veg"],
                    ] as const
                  ).map(([v, label]) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setDiet(v)}
                      className={`chip cursor-pointer ${
                        diet === v
                          ? "chip-active"
                          : ""
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="ghost" onClick={back} disabled={pending}>
                    Back
                  </Button>
                  <Button onClick={submitStep2} disabled={pending}>
                    {pending ? "Saving…" : "Continue"}
                  </Button>
                </div>
              </Slide>
            )}

            {step === 3 && (
              <Slide key="s3">
                <h1 className="font-heading text-2xl sm:text-3xl text-primary">
                  One last thing
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Required by India&apos;s DPDP Act and our medical safety promise.
                </p>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="rounded-xl bg-muted p-3">
                    <p className="font-medium">This is not medical advice.</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      NutriMama is a wellness companion. Our AI provides general
                      information and personalized suggestions, but it is{" "}
                      <strong>not</strong> a doctor and cannot diagnose, prescribe,
                      or replace professional medical care.
                    </p>
                  </div>

                  <Check
                    checked={agreedTerms}
                    onChange={setAgreedTerms}
                    label={
                      <>
                        I accept the{" "}
                        <a href="/legal/terms" target="_blank" className="underline">
                          Terms of Use
                        </a>
                        .
                      </>
                    }
                  />
                  <Check
                    checked={agreedPrivacy}
                    onChange={setAgreedPrivacy}
                    label={
                      <>
                        I&apos;ve read the{" "}
                        <a href="/legal/privacy" target="_blank" className="underline">
                          Privacy Policy
                        </a>{" "}
                        (DPDP Act 2023 compliant).
                      </>
                    }
                  />
                  <Check
                    checked={agreedMedical}
                    onChange={setAgreedMedical}
                    label="I understand NutriMama is not a substitute for a doctor."
                  />
                  <Check
                    checked={allowTraining}
                    onChange={setAllowTraining}
                    label={
                      <span className="text-muted-foreground">
                        <em>Optional:</em> Help improve NutriMama by allowing
                        anonymized data to train our AI. You can revoke this
                        anytime in Settings.
                      </span>
                    }
                  />
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="ghost" onClick={back} disabled={pending}>
                    Back
                  </Button>
                  <Button
                    onClick={submitStep3}
                    disabled={
                      !agreedTerms || !agreedPrivacy || !agreedMedical || pending
                    }
                  >
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

function Check({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (b: boolean) => void;
  label: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-border accent-primary"
      />
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
