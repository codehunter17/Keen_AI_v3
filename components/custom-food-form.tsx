"use client";

// User types a food name + serving — Gemini fetches macros + key micros (ICMR-NIN).
// Falls through to manual entry if AI is unavailable. Saves into today's DailyLog.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logCustomFood } from "@/lib/actions/custom-food";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

const MEAL_TYPES: { v: MealType; label: string; emoji: string }[] = [
  { v: "breakfast", label: "Breakfast", emoji: "🌅" },
  { v: "lunch", label: "Lunch", emoji: "🌞" },
  { v: "snack", label: "Snack", emoji: "🍎" },
  { v: "dinner", label: "Dinner", emoji: "🌙" },
];

function defaultMealType(): MealType {
  const h = new Date().getHours();
  if (h < 11) return "breakfast";
  if (h < 15) return "lunch";
  if (h < 19) return "snack";
  return "dinner";
}

interface FetchedMacros {
  kcal: number;
  protein_g: number;
  iron_mg: number;
  calcium_mg: number;
  potassium_mg?: number;
  folate_mcg?: number;
  vitC_mg?: number;
}

export function CustomFoodForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const [type, setType] = useState<MealType>(defaultMealType());
  const [name, setName] = useState("");
  const [serving, setServing] = useState("1 katori");

  const [showManual, setShowManual] = useState(false);
  const [manKcal, setManKcal] = useState("");
  const [manProtein, setManProtein] = useState("");
  const [manIron, setManIron] = useState("");
  const [manCalcium, setManCalcium] = useState("");

  const [result, setResult] = useState<FetchedMacros | null>(null);
  const [aiFailed, setAiFailed] = useState(false);

  const submit = () => {
    if (!name.trim()) return;
    setResult(null);
    setAiFailed(false);
    startTransition(async () => {
      const res = await logCustomFood({
        name: name.trim(),
        serving: serving.trim() || "1 serving",
        type,
        manualMacros: showManual
          ? {
              kcal: parseFloat(manKcal) || 0,
              protein_g: parseFloat(manProtein) || 0,
              iron_mg: manIron ? parseFloat(manIron) : undefined,
              calcium_mg: manCalcium ? parseFloat(manCalcium) : undefined,
            }
          : undefined,
      });
      if (res.macros) setResult(res.macros);
      else if (!showManual) setAiFailed(true);
      // Reset form fields but keep panel open so user sees the result
      setName("");
      setServing("1 katori");
      setManKcal("");
      setManProtein("");
      setManIron("");
      setManCalcium("");
      router.refresh();
    });
  };

  return (
    <section className="rounded-2xl bg-card lift overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
      >
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-heading text-lg">Add a custom food</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Type any dish — AI fetches macros, iron, calcium, potassium for you.
            </p>
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>

      {open && (
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-4 border-t border-border/60 pt-5">
          {/* Meal type */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Logging as
            </p>
            <div className="flex flex-wrap gap-2">
              {MEAL_TYPES.map((m) => (
                <button
                  key={m.v}
                  type="button"
                  onClick={() => setType(m.v)}
                  className={`chip cursor-pointer ${type === m.v ? "chip-active" : ""}`}
                >
                  <span className="mr-1">{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Name + serving */}
          <div className="grid sm:grid-cols-3 gap-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium">Food name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kashmiri rajma, mutton biryani, daal puri"
                className="mt-1 w-full rounded-xl border border-border bg-input/40 px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Serving</label>
              <input
                value={serving}
                onChange={(e) => setServing(e.target.value)}
                placeholder="e.g. 1 katori, 2 pieces"
                className="mt-1 w-full rounded-xl border border-border bg-input/40 px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Manual macros option */}
          <div>
            <button
              type="button"
              onClick={() => setShowManual((v) => !v)}
              className="text-xs text-muted-foreground underline"
            >
              {showManual ? "Use AI instead" : "Or enter macros manually"}
            </button>
            {showManual && (
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <ManualField label="kcal" value={manKcal} onChange={setManKcal} />
                <ManualField label="protein g" value={manProtein} onChange={setManProtein} />
                <ManualField label="iron mg" value={manIron} onChange={setManIron} />
                <ManualField label="calcium mg" value={manCalcium} onChange={setManCalcium} />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={submit} disabled={!name.trim() || pending}>
              {pending ? "Logging…" : showManual ? "Save with my values" : "Fetch + log"}
            </Button>
          </div>

          {/* AI result preview */}
          {result && (
            <div className="rounded-xl bg-primary/10 border border-primary/30 p-3 text-xs space-y-1">
              <p className="font-semibold text-primary">Logged ✓</p>
              <p>
                {result.kcal} kcal · {result.protein_g.toFixed(1)} g protein
                {result.iron_mg ? ` · ${result.iron_mg.toFixed(1)} mg iron` : ""}
                {result.calcium_mg ? ` · ${result.calcium_mg} mg calcium` : ""}
              </p>
              {(result.potassium_mg || result.folate_mcg || result.vitC_mg) && (
                <p className="text-muted-foreground">
                  {result.potassium_mg ? `${result.potassium_mg} mg potassium` : ""}
                  {result.folate_mcg ? ` · ${result.folate_mcg} mcg folate` : ""}
                  {result.vitC_mg ? ` · ${result.vitC_mg} mg vit-C` : ""}
                </p>
              )}
            </div>
          )}

          {aiFailed && !result && (
            <div className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
              Couldn&apos;t fetch macros for that food. Try a more common name, or
              tap &ldquo;Or enter macros manually&rdquo; above.
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ManualField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-input/40 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
