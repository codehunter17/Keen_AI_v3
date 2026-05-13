"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  logWaterIntake,
  logCheckIn,
  addEmergencyContact,
  deleteEmergencyContact,
} from "@/lib/actions/wellness";
import { INDIA_EMERGENCY } from "@/lib/safety";
import type { BmiResult } from "@/lib/bmi";

interface Hydration {
  ml: number;
  target: number;
  percent: number;
}

interface Streak {
  currentDays: number;
  longestDays: number;
}

interface Weekly {
  daysLogged: number;
  averageWaterGlasses: number;
  symptomCount: number;
  cycleCount: number;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: "PARTNER" | "PARENT" | "DOCTOR" | "FRIEND";
  priority: number;
}

const MOODS = [
  { v: "great", emoji: "🌞", label: "Great" },
  { v: "good", emoji: "🙂", label: "Good" },
  { v: "okay", emoji: "😐", label: "Okay" },
  { v: "low", emoji: "😔", label: "Low" },
  { v: "rough", emoji: "😣", label: "Rough" },
] as const;

export function WellnessClient({
  bmi,
  hydration,
  streak,
  weekly,
  contacts: initialContacts,
}: {
  bmi: BmiResult | null;
  hydration: Hydration;
  streak: Streak;
  weekly: Weekly;
  contacts: Contact[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [mood, setMood] = useState<(typeof MOODS)[number]["v"] | null>(null);
  const [energy, setEnergy] = useState(3);
  const [moodNotes, setMoodNotes] = useState("");
  const [contacts, setContacts] = useState(initialContacts);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relation: "PARTNER" as Contact["relation"],
  });

  const drink = (ml: number) =>
    startTransition(async () => {
      await logWaterIntake({ ml });
      router.refresh();
    });

  const submitMood = () => {
    if (!mood) return;
    startTransition(async () => {
      await logCheckIn({ mood, energy, notes: moodNotes || undefined });
      setMood(null);
      setMoodNotes("");
      router.refresh();
    });
  };

  const saveContact = () => {
    startTransition(async () => {
      const c = await addEmergencyContact({
        ...newContact,
        priority: 1,
      });
      setContacts((cur) => [
        ...cur,
        {
          id: c.id,
          name: c.name,
          phone: c.phone,
          relation: c.relation as Contact["relation"],
          priority: c.priority,
        },
      ]);
      setNewContact({ name: "", phone: "", relation: "PARTNER" });
      setShowAddContact(false);
    });
  };

  const removeContact = (id: string) =>
    startTransition(async () => {
      await deleteEmergencyContact(id);
      setContacts((cur) => cur.filter((c) => c.id !== id));
    });

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-5xl mx-auto">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-3xl text-primary">Wellness</h1>
          <p className="text-sm text-muted-foreground">
            Your daily care — water, mood, and what your body is telling you.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-heading text-primary">
              {streak.currentDays}🔥
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              day streak
            </p>
          </div>
        </div>
      </header>

      {/* Week summary strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Days logged this week" value={`${weekly.daysLogged}/7`} />
        <Stat label="Avg water/day" value={`${weekly.averageWaterGlasses.toFixed(1)} glasses`} />
        <Stat label="Symptoms tracked" value={weekly.symptomCount.toString()} />
        <Stat label="Longest streak" value={`${streak.longestDays} days`} />
      </section>

      {/* Hydration */}
      <section className="rounded-2xl bg-card lift p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-heading text-xl text-primary">Hydration</h2>
          <span className="text-xs text-muted-foreground">
            {hydration.ml} / {hydration.target} ml today
          </span>
        </div>
        <div className="mt-3 h-3 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-secondary transition-all"
            style={{ width: `${hydration.percent}%` }}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {[200, 250, 500].map((ml) => (
            <button
              key={ml}
              type="button"
              onClick={() => drink(ml)}
              disabled={pending}
              className="chip cursor-pointer hover:bg-accent"
            >
              + {ml} ml
            </button>
          ))}
          <span className="ml-2 text-xs text-muted-foreground self-center">
            Tap when you drink water
          </span>
        </div>
      </section>

      {/* BMI */}
      {bmi ? (
        <section className="rounded-2xl bg-card lift p-6">
          <h2 className="font-heading text-xl text-primary">BMI</h2>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading text-3xl">{bmi.bmi}</span>
            <span className="chip">{bmi.label}</span>
          </div>
          <p className="mt-2 text-sm">{bmi.message}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Healthy weight range for your height: {bmi.healthyRangeKg.low}–
            {bmi.healthyRangeKg.high} kg (ICMR-NIN South Asian cutoff)
          </p>
        </section>
      ) : (
        <section className="rounded-2xl bg-muted/50 p-4 text-sm">
          Add your height and weight in{" "}
          <a href="/dashboard/profile" className="underline">
            your profile
          </a>{" "}
          to see your BMI.
        </section>
      )}

      {/* Daily check-in */}
      <section className="rounded-2xl bg-card lift p-6">
        <h2 className="font-heading text-xl text-primary">Daily check-in</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Two taps. Helps the AI personalize tomorrow.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m.v}
              type="button"
              onClick={() => setMood(m.v)}
              className={`chip cursor-pointer text-base ${mood === m.v ? "chip-active" : ""}`}
            >
              {m.emoji} <span className="ml-1">{m.label}</span>
            </button>
          ))}
        </div>
        {mood && (
          <div className="mt-4 space-y-2">
            <label className="block text-sm font-medium">
              Energy ({energy}/5)
            </label>
            <input
              type="range"
              min={1}
              max={5}
              value={energy}
              onChange={(e) => setEnergy(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
            <textarea
              rows={2}
              value={moodNotes}
              onChange={(e) => setMoodNotes(e.target.value)}
              placeholder="Anything to remember about today? (optional)"
              className="w-full rounded-xl border border-border bg-input/40 px-3 py-2 text-sm"
            />
            <Button onClick={submitMood} disabled={pending}>
              {pending ? "Saving…" : "Save check-in"}
            </Button>
          </div>
        )}
      </section>

      {/* Emergency */}
      <section className="rounded-2xl surface-premium lift p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-heading text-xl text-primary">Emergency</h2>
          <button
            type="button"
            onClick={() => setShowAddContact((s) => !s)}
            className="text-xs text-primary underline"
          >
            {showAddContact ? "Cancel" : "Add a contact"}
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <a href={`tel:${INDIA_EMERGENCY.general}`} className="rounded-xl bg-card p-3 text-center hover:lift">
            <p className="font-heading text-2xl text-destructive">{INDIA_EMERGENCY.general}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Emergency</p>
          </a>
          <a href={`tel:${INDIA_EMERGENCY.ambulance}`} className="rounded-xl bg-card p-3 text-center hover:lift">
            <p className="font-heading text-2xl text-destructive">{INDIA_EMERGENCY.ambulance}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Ambulance</p>
          </a>
          <a href={`tel:${INDIA_EMERGENCY.womensHelpline}`} className="rounded-xl bg-card p-3 text-center hover:lift">
            <p className="font-heading text-2xl text-primary">{INDIA_EMERGENCY.womensHelpline}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Women's helpline</p>
          </a>
          <a href={`tel:${INDIA_EMERGENCY.childHelpline}`} className="rounded-xl bg-card p-3 text-center hover:lift">
            <p className="font-heading text-2xl text-primary">{INDIA_EMERGENCY.childHelpline}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Child helpline</p>
          </a>
        </div>

        {showAddContact && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              placeholder="Name"
              value={newContact.name}
              onChange={(e) => setNewContact((c) => ({ ...c, name: e.target.value }))}
              className="rounded-xl border border-border bg-input/40 px-3 py-2 text-sm"
            />
            <input
              placeholder="Phone (with country code)"
              value={newContact.phone}
              onChange={(e) => setNewContact((c) => ({ ...c, phone: e.target.value }))}
              className="rounded-xl border border-border bg-input/40 px-3 py-2 text-sm"
            />
            <select
              value={newContact.relation}
              onChange={(e) =>
                setNewContact((c) => ({
                  ...c,
                  relation: e.target.value as Contact["relation"],
                }))
              }
              className="rounded-xl border border-border bg-input/40 px-3 py-2 text-sm"
            >
              <option value="PARTNER">Partner</option>
              <option value="PARENT">Parent</option>
              <option value="DOCTOR">Doctor</option>
              <option value="FRIEND">Friend</option>
            </select>
            <Button
              className="sm:col-span-3"
              onClick={saveContact}
              disabled={!newContact.name || !newContact.phone || pending}
            >
              {pending ? "Saving…" : "Save contact"}
            </Button>
          </div>
        )}

        {contacts.length > 0 && (
          <ul className="mt-4 divide-y divide-border">
            {contacts.map((c) => (
              <li key={c.id} className="py-2 flex items-center justify-between">
                <div>
                  <a href={`tel:${c.phone}`} className="font-medium underline">
                    {c.name}
                  </a>
                  <span className="text-xs text-muted-foreground ml-2">
                    {c.relation.toLowerCase()}
                  </span>
                </div>
                <button
                  className="text-xs text-destructive hover:underline"
                  onClick={() => removeContact(c.id)}
                  disabled={pending}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card lift p-3">
      <p className="font-heading text-xl">{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}
