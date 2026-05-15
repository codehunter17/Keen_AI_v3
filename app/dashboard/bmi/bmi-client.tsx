"use client";

// BMI calculator UI — visual port of keen-ai's screen using
// v3's existing lib/bmi.ts (Asian-Indian cutoffs per ICMR-NIN).
// Live recompute as the user types; persist back to User via a
// small server action so dashboard widgets stay in sync.

import { useState, useTransition } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Scale, ArrowRight } from "lucide-react";
import { calcBmi } from "@/lib/bmi";
import { CitationBadge, SourceFooter } from "@/components/citation-badge";
import { saveVitals } from "./actions";

type Unit = "cm" | "ft";

interface Props {
  initialHeightCm: number | null;
  initialWeightKg: number | null;
}

// Recommended Indian foods by BMI category. Kept short — this is
// reinforcement copy, not a meal plan.
const RECOMMENDED_BY_CATEGORY: Record<string, string[]> = {
  UNDERWEIGHT: ["Ghee + dal + rice", "Paneer + whole milk", "Banana + peanut butter", "Frequent small meals"],
  NORMAL: ["Varied dal & vegetables", "Whole-grain rotis", "Fruits daily", "1 glass milk / curd"],
  OVERWEIGHT: ["Bajra / ragi rotis", "More vegetables, less rice", "Sprouts / chana", "20-min daily walk"],
  OBESE_I: ["Half-plate vegetables", "Replace refined oil with mustard / olive", "Cut sugar drinks", "Walk 30 min daily"],
  OBESE_II: ["Low-GI grains (bajra, jowar)", "Strict portion control", "Doctor-supervised plan", "Daily activity"],
};

const CATEGORY_TONE: Record<string, { bg: string; ring: string; text: string }> = {
  UNDERWEIGHT: { bg: "bg-amber-100", ring: "ring-amber-300", text: "text-amber-800" },
  NORMAL: { bg: "bg-emerald-100", ring: "ring-emerald-300", text: "text-emerald-800" },
  OVERWEIGHT: { bg: "bg-amber-100", ring: "ring-amber-300", text: "text-amber-800" },
  OBESE_I: { bg: "bg-orange-100", ring: "ring-orange-300", text: "text-orange-800" },
  OBESE_II: { bg: "bg-rose-100", ring: "ring-rose-300", text: "text-rose-800" },
};

export function BMIClient({ initialHeightCm, initialWeightKg }: Props) {
  const [unit, setUnit] = useState<Unit>("cm");
  const [heightCm, setHeightCm] = useState<string>(
    initialHeightCm != null ? String(initialHeightCm) : "",
  );
  const [feet, setFeet] = useState<string>("");
  const [inches, setInches] = useState<string>("");
  const [weightKg, setWeightKg] = useState<string>(
    initialWeightKg != null ? String(initialWeightKg) : "",
  );
  const [saving, startSave] = useTransition();
  const [savedNote, setSavedNote] = useState<string | null>(null);

  // Convert ft+in to cm if the user toggled to imperial
  const heightCmNum = (() => {
    if (unit === "cm") return parseFloat(heightCm);
    const f = parseFloat(feet) || 0;
    const i = parseFloat(inches) || 0;
    return Math.round((f * 30.48 + i * 2.54) * 10) / 10;
  })();
  const weightKgNum = parseFloat(weightKg);

  let result: ReturnType<typeof calcBmi> | null = null;
  try {
    if (heightCmNum >= 80 && weightKgNum >= 25) {
      result = calcBmi(heightCmNum, weightKgNum);
    }
  } catch {
    // input out of range — leave result null
  }

  const tone = result ? CATEGORY_TONE[result.category] : CATEGORY_TONE.NORMAL;

  const save = () => {
    if (!result || !Number.isFinite(heightCmNum) || !Number.isFinite(weightKgNum)) return;
    startSave(async () => {
      const res = await saveVitals({ heightCm: heightCmNum, weightKg: weightKgNum });
      setSavedNote(res.ok ? "Saved to your profile ✓" : "Couldn't save — try again");
      setTimeout(() => setSavedNote(null), 2500);
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Hero band */}
      <section className="rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-6 sm:p-7 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/15 blur-2xl" />
        <Link
          href="/dashboard"
          className="inline-flex w-9 h-9 items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-3">
          <Scale className="w-8 h-8" />
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl tracking-tight">BMI Calculator</h1>
            <p className="text-sm text-white/80 mt-0.5">Indian Asian-specific categories</p>
          </div>
        </div>
      </section>

      {/* Input card */}
      <section className="rounded-3xl bg-card border border-border p-5 sm:p-6">
        {/* Unit toggle */}
        <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-2">
          Height Unit
        </p>
        <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-2xl mb-4">
          <button
            type="button"
            onClick={() => setUnit("cm")}
            className={
              "py-2 rounded-xl text-sm font-semibold transition-colors " +
              (unit === "cm"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            cm
          </button>
          <button
            type="button"
            onClick={() => setUnit("ft")}
            className={
              "py-2 rounded-xl text-sm font-semibold transition-colors " +
              (unit === "ft"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            ft & in
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {unit === "cm" ? (
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-1">
                Your Height
              </label>
              <input
                type="number"
                inputMode="decimal"
                min={80}
                max={230}
                placeholder="165"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full rounded-xl border border-input bg-card/50 px-4 h-12 font-heading text-xl outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-1">
                  Feet
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={3}
                  max={8}
                  placeholder="5"
                  value={feet}
                  onChange={(e) => setFeet(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card/50 px-3 h-12 font-heading text-xl outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-1">
                  Inches
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={11}
                  placeholder="5"
                  value={inches}
                  onChange={(e) => setInches(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card/50 px-3 h-12 font-heading text-xl outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              inputMode="decimal"
              min={25}
              max={250}
              placeholder="56"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full rounded-xl border border-input bg-card/50 px-4 h-12 font-heading text-xl outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      </section>

      {/* Result card */}
      {result ? (
        <motion.section
          key={result.bmi}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl bg-card border ${tone.ring} ring-1 p-6 sm:p-7`}
        >
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                Your BMI
              </p>
              <p className={`font-heading text-6xl sm:text-7xl ${tone.text} tracking-tight mt-1`}>
                {result.bmi}
              </p>
              <p className="text-xs text-muted-foreground mt-1">kg/m²</p>
            </div>
            <div className={`${tone.bg} ${tone.text} rounded-2xl px-4 py-2 text-right`}>
              <p className="text-xs uppercase tracking-widest font-semibold opacity-80">
                {result.label}
              </p>
              <p className="text-sm font-semibold mt-0.5">18.5 – 22.9</p>
            </div>
          </div>

          {/* Colour-band gauge */}
          <Gauge bmi={result.bmi} />

          {/* Ideal weight strip */}
          <div className="mt-5 rounded-2xl bg-muted/50 px-4 py-3 text-sm">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
              Ideal weight range for your height
            </p>
            <p className="font-heading text-2xl text-foreground mt-0.5">
              {result.healthyRangeKg.low} – {result.healthyRangeKg.high}{" "}
              <span className="text-sm font-normal text-muted-foreground">kg</span>
            </p>
          </div>

          {/* What this means */}
          <div className="mt-5">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-emerald-700 dark:text-emerald-300">
              What this means
            </p>
            <p className="text-sm text-foreground/85 mt-1 leading-relaxed">{result.message}</p>
          </div>

          {/* Recommended foods */}
          <div className="mt-5">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
              ✅ Recommended foods
            </p>
            <div className="flex flex-wrap gap-1.5">
              {RECOMMENDED_BY_CATEGORY[result.category].map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 px-3 py-1 text-xs font-medium"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Save + citation */}
          <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
            <CitationBadge source="ICMR_RDA_2020" />
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white px-5 py-2 text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save to my profile"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {savedNote && (
            <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-300 text-right">
              {savedNote}
            </p>
          )}
        </motion.section>
      ) : (
        <section className="rounded-3xl bg-card border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Enter your height and weight to see your BMI.
        </section>
      )}

      {/* Source footer */}
      <SourceFooter
        sources={["ICMR_RDA_2020"]}
        prefix="Asian-Indian BMI cutoffs based on"
        disclaimer="BMI is a screening tool, not a diagnosis. For pregnant or breastfeeding women, results are not clinically meaningful — consult your doctor."
      />
    </div>
  );
}

function Gauge({ bmi }: { bmi: number }) {
  // Position thumb across the 12-40 scale
  const min = 12;
  const max = 40;
  const pct = Math.max(0, Math.min(100, ((bmi - min) / (max - min)) * 100));
  return (
    <div className="mt-5">
      <div className="relative h-3 rounded-full overflow-hidden flex">
        <span className="flex-[5] bg-amber-400" />
        <span className="flex-[6] bg-emerald-500" />
        <span className="flex-[3] bg-amber-400" />
        <span className="flex-[7] bg-orange-500" />
        <span className="flex-[7] bg-rose-500" />
        <span
          className="absolute -top-1 w-5 h-5 rounded-full bg-white border-2 border-foreground shadow"
          style={{ left: `calc(${pct}% - 0.625rem)` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] font-semibold text-muted-foreground">
        <span>12</span>
        <span>18.5</span>
        <span>23</span>
        <span>25</span>
        <span>30</span>
        <span>40</span>
      </div>
    </div>
  );
}
