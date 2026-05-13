"use client";

// Offline-first meal logger.
// Search hits IndexedDB first (zero network), falls back to in-memory FOOD_DB.
// Writes go to the IndexedDB queue + sync to server when online.

import { useEffect, useRef, useState } from "react";
import { Search, Plus, Check } from "lucide-react";
import { searchFoodsOffline, enqueueMeal } from "@/lib/offline-db";
import { drainQueue } from "@/lib/sync-orchestrator";
import { searchFoods, type Food } from "@/lib/food-db";
import { scheduleAfterMealHydrationNudge } from "@/lib/notifications-client";

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

export function MealLogger() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Food[]>([]);
  const [type, setType] = useState<MealType>(defaultMealType());
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [recent, setRecent] = useState<{ food: Food; servings: number; at: number }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Live search — IndexedDB first (offline), fall back to in-memory.
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    let alive = true;
    searchFoodsOffline(query, 12)
      .then((idb) => {
        if (!alive) return;
        if (idb.length > 0) setResults(idb);
        else setResults(searchFoods(query, 12));
      })
      .catch(() => {
        if (alive) setResults(searchFoods(query, 12));
      });
    return () => {
      alive = false;
    };
  }, [query]);

  const log = async (food: Food, servings = 1) => {
    setBusyId(food.id);
    try {
      await enqueueMeal({
        type,
        foodId: food.id,
        foodName: food.name,
        servings,
        loggedAt: Date.now(),
      });
      // Try sync immediately — succeeds if online, queued otherwise.
      drainQueue().catch(() => {});
      // Auto-schedule a hydration nudge 1h after this meal (local notification).
      scheduleAfterMealHydrationNudge().catch(() => {});
      setConfirmId(food.id);
      setRecent((prev) => [{ food, servings, at: Date.now() }, ...prev.slice(0, 4)]);
      setQuery("");
      setTimeout(() => setConfirmId(null), 2000);
      inputRef.current?.focus();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Meal type picker */}
      <section>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Logging as
        </p>
        <div className="flex flex-wrap gap-2">
          {MEAL_TYPES.map((m) => (
            <button
              key={m.v}
              type="button"
              onClick={() => setType(m.v)}
              className={`chip cursor-pointer text-base ${type === m.v ? "chip-active" : ""}`}
            >
              <span className="mr-1">{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>
      </section>

      {/* Search */}
      <section className="rounded-2xl bg-card lift p-4 sm:p-5">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-input/40 px-3">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a food — e.g. dal, ragi roti, paneer, methi"
            className="flex-1 bg-transparent py-3 outline-none text-base"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs text-muted-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {results.length > 0 && (
          <ul className="mt-3 divide-y divide-border max-h-[60vh] overflow-y-auto">
            {results.map((f) => {
              const isBusy = busyId === f.id;
              const isDone = confirmId === f.id;
              return (
                <li key={f.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {f.name}{" "}
                      {f.hi && (
                        <span className="text-xs text-muted-foreground">· {f.hi}</span>
                      )}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {f.servingLabel} · {f.kcal} kcal · P {f.protein_g}g · Fe {f.iron_mg}mg · Ca {f.calcium_mg}mg
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => log(f)}
                    disabled={isBusy}
                    className={`shrink-0 inline-flex items-center gap-1 rounded-full text-xs font-semibold px-3 py-1.5 transition ${
                      isDone
                        ? "bg-primary/15 text-primary"
                        : "bg-primary text-primary-foreground hover:scale-[1.03]"
                    } disabled:opacity-50`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    {isDone ? "Logged" : "Log"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {query && results.length === 0 && (
          <p className="mt-3 text-sm text-muted-foreground">
            Nothing matches &ldquo;{query}&rdquo;. Try the Hindi name, or use the voice mic on the home page.
          </p>
        )}
      </section>

      {/* Recently logged this session */}
      {recent.length > 0 && (
        <section className="rounded-2xl bg-card lift p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Just logged
          </p>
          <ul className="space-y-1">
            {recent.map((r, i) => (
              <li key={i} className="text-sm">
                ✓ {r.servings === 1 ? "" : `${r.servings}× `}
                {r.food.name}{" "}
                <span className="text-[10px] text-muted-foreground">
                  · {r.food.kcal * r.servings} kcal
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-center text-[11px] text-muted-foreground">
        Searches run offline once you've opened the app. Logs sync automatically
        when you reconnect.
      </p>
    </div>
  );
}
