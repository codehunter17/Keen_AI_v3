"use client";

// Reusable height input that accepts cm or ft+in.
// Always emits a single cm number to the parent via onChange.
// India context: most women say "5 ft 4 in" colloquially; cm is medical.

import { useEffect, useState } from "react";

interface Props {
  /** Current value in cm. Pass undefined for empty. */
  valueCm: number | undefined;
  onChange: (cm: number | undefined) => void;
  /** Default unit when first rendered. cm or ftin. */
  defaultUnit?: "cm" | "ftin";
  className?: string;
}

const FT_TO_CM = 30.48;
const IN_TO_CM = 2.54;

export function HeightInput({ valueCm, onChange, defaultUnit = "cm", className = "" }: Props) {
  const [unit, setUnit] = useState<"cm" | "ftin">(defaultUnit);
  const [cm, setCm] = useState<string>(valueCm ? String(valueCm) : "");
  const [ft, setFt] = useState<string>("");
  const [inches, setInches] = useState<string>("");

  // When the parent updates valueCm externally (e.g. data load), sync local state.
  useEffect(() => {
    if (valueCm == null) return;
    setCm(String(valueCm));
    const totalIn = valueCm / IN_TO_CM;
    const f = Math.floor(totalIn / 12);
    const i = Math.round(totalIn - f * 12);
    setFt(String(f));
    setInches(String(i));
  }, [valueCm]);

  const onCmChange = (v: string) => {
    setCm(v);
    onChange(v ? parseFloat(v) : undefined);
  };

  const onFtInChange = (newFt: string, newIn: string) => {
    setFt(newFt);
    setInches(newIn);
    const f = newFt ? parseFloat(newFt) : 0;
    const i = newIn ? parseFloat(newIn) : 0;
    if (!f && !i) {
      onChange(undefined);
      return;
    }
    const result = Math.round((f * FT_TO_CM + i * IN_TO_CM) * 10) / 10;
    onChange(result);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <span className="block text-sm font-medium">Height</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setUnit("cm")}
            className={`text-xs px-2.5 py-1 rounded-full border transition ${
              unit === "cm"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            cm
          </button>
          <button
            type="button"
            onClick={() => setUnit("ftin")}
            className={`text-xs px-2.5 py-1 rounded-full border transition ${
              unit === "ftin"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            ft / in
          </button>
        </div>
      </div>

      {unit === "cm" ? (
        <input
          type="number"
          min={80}
          max={230}
          value={cm}
          onChange={(e) => onCmChange(e.target.value)}
          placeholder="e.g. 160"
          className="w-full rounded-xl border border-border bg-input/40 px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <input
                type="number"
                min={3}
                max={7}
                value={ft}
                onChange={(e) => onFtInChange(e.target.value, inches)}
                placeholder="5"
                className="w-full rounded-xl border border-border bg-input/40 px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                ft
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={11}
                value={inches}
                onChange={(e) => onFtInChange(ft, e.target.value)}
                placeholder="6"
                className="w-full rounded-xl border border-border bg-input/40 px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                in
              </span>
            </div>
          </div>
          {(ft || inches) && (
            <p className="mt-1 text-[11px] text-muted-foreground">
              ≈ {valueCm ?? 0} cm
            </p>
          )}
        </>
      )}
    </div>
  );
}
