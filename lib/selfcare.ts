// Selfcare — curated daily routine recommendations keyed off lifeStage +
// cycleStage + symptoms. Static for v1; AI-personalized in v2.

import type { LifeStage, CycleStage } from "@/lib/lifecycle";

export interface SelfcareTip {
  id: string;
  title: string;
  body: string;
  durationMin: number;
  category: "MOVEMENT" | "BREATH" | "NUTRITION" | "SLEEP" | "MIND" | "RITUAL";
  appliesTo: {
    lifeStages?: LifeStage[];
    cycleStages?: CycleStage[];
    symptoms?: string[]; // e.g. "cramps", "low_mood"
  };
}

export const SELFCARE_TIPS: SelfcareTip[] = [
  {
    id: "warm-water-jeera",
    title: "Warm jeera water on waking",
    body: "Boil ½ tsp cumin in a cup of water for 2 min. Sip warm before food. Eases bloating, supports digestion, and is a standard Indian morning ritual.",
    durationMin: 2,
    category: "RITUAL",
    appliesTo: { lifeStages: ["ADULT_MENSTRUATING", "TRYING_TO_CONCEIVE", "PREGNANT", "POSTPARTUM"] },
  },
  {
    id: "10-min-walk-after-meal",
    title: "10-min walk after lunch",
    body: "A flat 10-minute walk after your largest meal of the day improves blood sugar control by 20–30%. Don't sit immediately after eating.",
    durationMin: 10,
    category: "MOVEMENT",
    appliesTo: {},
  },
  {
    id: "cramps-heat-pad",
    title: "Heat for cramps",
    body: "Place a warm water bottle or heat pad on the lower abdomen for 15 min. As effective as ibuprofen for many women.",
    durationMin: 15,
    category: "RITUAL",
    appliesTo: { symptoms: ["cramps"] },
  },
  {
    id: "box-breathing-4-4-4-4",
    title: "Box breathing — 2 minutes",
    body: "Inhale 4, hold 4, exhale 4, hold 4. Repeat 8 cycles. Drops cortisol and heart rate quickly. Use before sleep or before a hard meeting.",
    durationMin: 2,
    category: "BREATH",
    appliesTo: {},
  },
  {
    id: "haldi-doodh-evening",
    title: "Haldi doodh before bed",
    body: "1 cup warm milk + ¼ tsp turmeric + a pinch of black pepper. Anti-inflammatory and a classic sleep ritual.",
    durationMin: 5,
    category: "SLEEP",
    appliesTo: { lifeStages: ["PREGNANT", "POSTPARTUM"] },
  },
  {
    id: "no-screens-30-min",
    title: "30-min screen-off before bed",
    body: "Phone away 30 min before sleep. Replace with a paper book, journaling, or stretching. Sleep quality jumps within a week.",
    durationMin: 30,
    category: "SLEEP",
    appliesTo: {},
  },
  {
    id: "sun-salutations-morning",
    title: "5 sun salutations",
    body: "Surya namaskar × 5 rounds. 8–10 minutes total. Full-body movement, opens hip flexors, gentle cardio. Skip if pregnant beyond T1.",
    durationMin: 10,
    category: "MOVEMENT",
    appliesTo: { lifeStages: ["ADULT_MENSTRUATING", "TRYING_TO_CONCEIVE"] },
  },
  {
    id: "kegels-set",
    title: "Kegel set — 3 × 10",
    body: "Squeeze your pelvic floor for 5 sec, release for 5 sec. Do 10. Repeat 3 times across the day. Strengthens for delivery and recovery.",
    durationMin: 5,
    category: "MOVEMENT",
    appliesTo: { lifeStages: ["PREGNANT", "POSTPARTUM"] },
  },
  {
    id: "anjali-mudra-breath",
    title: "Anjali mudra + breath",
    body: "Hands at heart center, palms together, eyes closed, 6 deep breaths. A 1-minute reset between tasks.",
    durationMin: 1,
    category: "MIND",
    appliesTo: {},
  },
  {
    id: "kicks-count-after-28w",
    title: "Daily kick count",
    body: "After dinner, lie on your left side for 1 hour. Count baby's movements — you should feel 10 in 2 hours. Less = call your doctor.",
    durationMin: 60,
    category: "RITUAL",
    appliesTo: { lifeStages: ["PREGNANT"] },
  },
];

export function selfcareForUser(opts: {
  lifeStage?: LifeStage;
  cycleStage?: CycleStage;
  symptoms?: string[];
}): SelfcareTip[] {
  return SELFCARE_TIPS.filter((t) => {
    const ls = t.appliesTo.lifeStages;
    if (ls && opts.lifeStage && !ls.includes(opts.lifeStage)) return false;
    const cs = t.appliesTo.cycleStages;
    if (cs && opts.cycleStage && !cs.includes(opts.cycleStage)) return false;
    const sy = t.appliesTo.symptoms;
    if (sy && sy.length) {
      if (!opts.symptoms?.some((s) => sy.includes(s))) return false;
    }
    return true;
  });
}
