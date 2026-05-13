"use client";

import { useState } from "react";
import { DEFICIENCY_REMEDIES, REGIONAL_MEALS, type Region } from "@/lib/medical-kb";

const NUTRIENTS = Object.keys(DEFICIENCY_REMEDIES);
const REGIONS: { v: Region; label: string }[] = [
  { v: "north", label: "North India" },
  { v: "south", label: "South India" },
  { v: "gujarat", label: "Gujarat" },
  { v: "maharashtra", label: "Maharashtra" },
  { v: "bengal", label: "Bengal" },
  { v: "rajasthan", label: "Rajasthan" },
  { v: "punjab", label: "Punjab" },
  { v: "northeast", label: "Northeast" },
  { v: "odisha", label: "Odisha" },
];

export default function RemediesPage() {
  const [nutrient, setNutrient] = useState<string>("iron");
  const [region, setRegion] = useState<Region>("north");

  const r = DEFICIENCY_REMEDIES[nutrient];
  const meal = REGIONAL_MEALS[nutrient]?.[region];

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <header>
        <span className="chip border-primary/30 text-primary">Indian remedies</span>
        <h1 className="font-heading text-3xl text-primary mt-2">
          Three-layer guide
        </h1>
        <p className="text-sm text-muted-foreground">
          Gharelu home remedies, ayurvedic options, and standard medicine — for
          common deficiencies in Indian women. Sourced from ICMR-NIN 2020.
        </p>
      </header>

      {/* Pickers */}
      <section className="rounded-2xl bg-card lift p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium">Nutrient</label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {NUTRIENTS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNutrient(n)}
                className={`chip cursor-pointer ${nutrient === n ? "chip-active" : ""}`}
              >
                {DEFICIENCY_REMEDIES[n].name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Your region</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as Region)}
            className="mt-1.5 rounded-xl border border-border bg-input/40 px-3 py-2 text-sm"
          >
            {REGIONS.map((r) => (
              <option key={r.v} value={r.v}>{r.label}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Regional meal */}
      {meal && (
        <section className="rounded-2xl surface-premium lift p-5">
          <p className="chip border-primary/30 text-primary">Best meal in your region</p>
          <p className="mt-2 font-heading text-lg">{meal}</p>
        </section>
      )}

      {/* 3-layer remedy */}
      <section className="grid sm:grid-cols-2 gap-4">
        <Card title="Gharelu (home remedies)" emoji="🏠">
          <ul className="space-y-1.5 text-sm">
            {r.gharelu.map((g, i) => (
              <li key={i}>• {g}</li>
            ))}
          </ul>
        </Card>
        <Card title="Ayurveda" emoji="🌿">
          <ul className="space-y-1.5 text-sm">
            {r.ayurveda.map((a, i) => (
              <li key={i}>• {a}</li>
            ))}
          </ul>
        </Card>
        <Card title="Standard medicine (informational only)" emoji="💊">
          <ul className="space-y-1.5 text-sm">
            {r.medicine.map((m, i) => (
              <li key={i}>• {m}</li>
            ))}
          </ul>
        </Card>
        <Card title="When to see a doctor" emoji="👩‍⚕️" highlight>
          <p className="text-sm">{r.doctor}</p>
        </Card>
      </section>

      <p className="text-center text-xs text-muted-foreground">
        Not medical advice. Always consult a qualified doctor before starting
        supplements, especially during pregnancy.
      </p>
    </div>
  );
}

function Card({
  title,
  emoji,
  highlight,
  children,
}: {
  title: string;
  emoji: string;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl p-4 lift ${
        highlight ? "bg-secondary/30 border border-secondary/40" : "bg-card"
      }`}
    >
      <p className="font-heading text-sm flex items-center gap-2">
        <span>{emoji}</span>
        <span>{title}</span>
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
