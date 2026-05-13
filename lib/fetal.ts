// Pregnancy week-by-week (fetal development + maternal milestones).
// Adapted from the legacy Keen_AI fetal_engine.py + ICMR pregnancy guidance.

export interface FetalWeekInfo {
  week: number;
  trimester: 1 | 2 | 3;
  fetalSizeAnalogue: string;     // "size of a poppy seed", etc.
  fetalLengthCm: number | null;
  fetalWeightG: number | null;
  fetalDevelopment: string;
  maternalChanges: string;
  whatToFocusOn: string;
  topNutrients: string[];
  appointmentsDue: string;
}

const TRIMESTERS = (week: number): 1 | 2 | 3 =>
  week <= 13 ? 1 : week <= 27 ? 2 : 3;

const MILESTONES: Record<number, Partial<FetalWeekInfo>> = {
  4: {
    fetalSizeAnalogue: "poppy seed",
    fetalLengthCm: 0.1,
    fetalDevelopment: "Implantation complete; the placenta and amniotic sac are forming.",
    maternalChanges: "You may have just missed your period; HCG levels rising.",
    whatToFocusOn: "Start folic acid 400-800 mcg/day if you haven't already. Avoid alcohol and unprescribed medications.",
    topNutrients: ["Folic acid", "Iron"],
    appointmentsDue: "Confirm pregnancy with a urine test or beta-HCG blood test.",
  },
  6: {
    fetalSizeAnalogue: "lentil",
    fetalLengthCm: 0.6,
    fetalDevelopment: "Heart begins to beat; neural tube closing.",
    maternalChanges: "Nausea, breast tenderness, fatigue may appear.",
    whatToFocusOn: "Eat small frequent meals to manage nausea. Stay hydrated.",
    topNutrients: ["Folic acid", "B6 (helps nausea)"],
    appointmentsDue: "Schedule first antenatal (ANC) visit if not done.",
  },
  8: {
    fetalSizeAnalogue: "raspberry",
    fetalLengthCm: 1.6,
    fetalDevelopment: "Tiny fingers and toes forming. All major organs starting.",
    maternalChanges: "Morning sickness peak for many. Tender breasts.",
    whatToFocusOn: "Continue folic acid + iron. Light walking 15-20 min/day.",
    topNutrients: ["Folic acid", "Iron", "Vitamin B6"],
    appointmentsDue: "First ultrasound (dating scan) around 8-10 weeks.",
  },
  12: {
    fetalSizeAnalogue: "lime",
    fetalLengthCm: 5.4,
    fetalWeightG: 14,
    fetalDevelopment: "Reflexes develop. Risk of miscarriage drops sharply.",
    maternalChanges: "Nausea often eases. Energy returning.",
    whatToFocusOn: "Begin gentle prenatal yoga or walking. Announce when you feel ready.",
    topNutrients: ["Iron", "Calcium", "Folic acid"],
    appointmentsDue: "NT scan + double marker test (11-14 weeks).",
  },
  16: {
    fetalSizeAnalogue: "avocado",
    fetalLengthCm: 11.6,
    fetalWeightG: 100,
    fetalDevelopment: "Skeleton hardening; baby can hear muffled sounds.",
    maternalChanges: "You may feel first 'flutters'.",
    whatToFocusOn: "Add iron-rich foods (spinach, dates, jaggery, ragi) — pair with vitamin C.",
    topNutrients: ["Iron", "Calcium", "Omega-3 (DHA)"],
    appointmentsDue: "Quad marker test if NT not done; routine ANC.",
  },
  20: {
    fetalSizeAnalogue: "banana",
    fetalLengthCm: 25.6,
    fetalWeightG: 300,
    fetalDevelopment: "Halfway there. Anomaly scan reveals organ development.",
    maternalChanges: "Visible bump. Definite movements.",
    whatToFocusOn: "Anomaly scan is critical — book it now if not scheduled.",
    topNutrients: ["Iron", "Calcium", "Protein"],
    appointmentsDue: "Anomaly scan (level 2 ultrasound).",
  },
  24: {
    fetalSizeAnalogue: "ear of corn",
    fetalLengthCm: 30,
    fetalWeightG: 600,
    fetalDevelopment: "Lung development; baby gains taste buds.",
    maternalChanges: "Heartburn, back pain may appear.",
    whatToFocusOn: "Sleep on your side (preferably left). Avoid lying flat on back.",
    topNutrients: ["Calcium", "Iron", "Magnesium"],
    appointmentsDue: "GTT (glucose tolerance test) for gestational diabetes around 24-28 weeks.",
  },
  28: {
    fetalSizeAnalogue: "eggplant",
    fetalLengthCm: 37.6,
    fetalWeightG: 1000,
    fetalDevelopment: "Brain rapidly developing. Eyes can open.",
    maternalChanges: "Third trimester begins. Braxton-Hicks may start.",
    whatToFocusOn: "Count fetal kicks daily after 28 weeks (10 movements in 2 hours).",
    topNutrients: ["Iron", "Calcium", "Omega-3"],
    appointmentsDue: "Tdap vaccine (27-36 weeks) per ICMR/WHO. Anti-D if Rh-negative.",
  },
  32: {
    fetalSizeAnalogue: "jicama",
    fetalLengthCm: 42.4,
    fetalWeightG: 1700,
    fetalDevelopment: "Growth spurt; baby practising breathing motions.",
    maternalChanges: "Shortness of breath as uterus pushes diaphragm.",
    whatToFocusOn: "Start packing your hospital bag. Discuss birth plan with partner.",
    topNutrients: ["Iron", "Calcium", "Protein"],
    appointmentsDue: "Growth scan; bi-weekly ANC visits begin.",
  },
  36: {
    fetalSizeAnalogue: "papaya",
    fetalLengthCm: 47.4,
    fetalWeightG: 2600,
    fetalDevelopment: "Considered 'late preterm' if born now; baby moving into head-down position.",
    maternalChanges: "Pelvic pressure, frequent urination.",
    whatToFocusOn: "Group B Strep swab. Confirm hospital bag, paediatrician, contact list.",
    topNutrients: ["Iron", "Vitamin K", "Calcium"],
    appointmentsDue: "Weekly ANC visits begin. GBS screening.",
  },
  40: {
    fetalSizeAnalogue: "pumpkin",
    fetalLengthCm: 51.2,
    fetalWeightG: 3400,
    fetalDevelopment: "Full term. Baby ready to meet you.",
    maternalChanges: "Real labour signs: regular contractions, water breaking, bloody show.",
    whatToFocusOn: "Rest. Hydrate. Watch for danger signs (severe headache, vision changes, reduced movement).",
    topNutrients: ["Iron", "Calcium", "Hydration"],
    appointmentsDue: "Daily kick counts. Fetal monitoring if past due date.",
  },
};

const NEAREST_MILESTONE_WEEKS = Object.keys(MILESTONES)
  .map(Number)
  .sort((a, b) => a - b);

export function fetalInfoForWeek(week: number): FetalWeekInfo {
  const w = Math.max(1, Math.min(45, Math.round(week)));
  // pick the nearest defined milestone <= w
  const milestoneWeek =
    [...NEAREST_MILESTONE_WEEKS].reverse().find((m) => m <= w) ?? 4;
  const m = MILESTONES[milestoneWeek];
  return {
    week: w,
    trimester: TRIMESTERS(w),
    fetalSizeAnalogue: m.fetalSizeAnalogue ?? "growing every day",
    fetalLengthCm: m.fetalLengthCm ?? null,
    fetalWeightG: m.fetalWeightG ?? null,
    fetalDevelopment:
      m.fetalDevelopment ?? "Baby is developing steadily.",
    maternalChanges: m.maternalChanges ?? "Listen to your body.",
    whatToFocusOn: m.whatToFocusOn ?? "Continue prenatal care, eat well, rest.",
    topNutrients: m.topNutrients ?? ["Iron", "Calcium", "Folic acid"],
    appointmentsDue: m.appointmentsDue ?? "Routine antenatal visit.",
  };
}
