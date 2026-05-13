// Medical triage engine — classifies user message into RED / YELLOW / GREEN.
// Ported from the legacy Keen_AI Python triage_engine.py.
//
// Sources baked in:
//   - FOGSI Danger Signs Classification 2023
//   - WHO ANC Guidelines 2016
//   - ACOG Practice Bulletins
//   - MEWC (Modified Early Warning Criteria — Obstetric variant)
//
// This is a deterministic regex layer — fast, free, auditable. It runs
// BEFORE the LLM. RED = surface emergency contacts, do not call LLM.
// YELLOW = call LLM with a stronger "see a doctor today" preamble.

export type TriageLevel = "RED" | "YELLOW" | "GREEN";

interface Pattern {
  re: RegExp;
  label: string;
}

const RED: Pattern[] = [
  { re: /pad.{0,15}(soaking|soak|wet|full).{0,10}(every|har|ek).{0,10}(hour|ghante|hr)/i, label: "Heavy bleeding — pad soaking every hour" },
  { re: /heavy bleed/i, label: "Heavy vaginal bleeding" },
  { re: /bleed.{0,20}pregnan/i, label: "Bleeding in pregnancy" },
  { re: /postpartum.{0,15}(heavy|bleed|soak)/i, label: "Postpartum hemorrhage signs" },
  { re: /clot.{0,10}(golf|bigger|large|bada)/i, label: "Large clot passage" },
  { re: /(worst|terrible|severe|bahut tez).{0,15}(headache|sir dard)/i, label: "Severe headache — preeclampsia sign" },
  { re: /(blurr|double|loss of).{0,10}vision/i, label: "Visual disturbance — eclampsia sign" },
  { re: /(seizure|convulsion|fitting|jhatke)/i, label: "Seizure / convulsion" },
  { re: /(faint|behoshi|unconsci|hosh khona)/i, label: "Loss of consciousness" },
  { re: /bp.{0,15}(160|170|180|190|200|2\d\d)/i, label: "Hypertensive crisis — BP ≥160" },
  { re: /eclampsia/i, label: "Eclampsia" },
  { re: /(chest pain|seene mein dard|chest tightness)/i, label: "Chest pain" },
  { re: /(shortness of breath|breathless|saans (nahi|nai|band|mushkil))/i, label: "Breathing difficulty" },
  { re: /(no|nahi|band).{0,15}(baby.{0,10}movement|fetal movement)/i, label: "Absent fetal movement" },
  { re: /baby.{0,10}(not moving|stopped moving)/i, label: "Baby not moving" },
  { re: /(water broke|waters broken|pani toot|amniotic)/i, label: "Membrane rupture" },
  { re: /(ectopic|one.sided.{0,10}(severe|sharp|tez).{0,10}pain.{0,20}pregnan)/i, label: "Suspected ectopic pregnancy" },
  { re: /placent.{0,10}(previa|abruption)/i, label: "Placental emergency" },
  { re: /cord.{0,10}(prolapses?|prolapse)/i, label: "Cord prolapse" },
  { re: /(suicid|kill (myself|me)|end (my|the) life|nahi rehna|jeena nahi)/i, label: "Suicidal ideation" },
  { re: /(harm|hurt).{0,10}(my )?baby/i, label: "Thoughts of harming baby" },
  { re: /(shock|haath thande|cold.{0,5}sweat|pale.{0,5}faint)/i, label: "Shock signs" },
];

const YELLOW: Pattern[] = [
  { re: /(fever|bukhar).{0,30}(pregnan|garbh)/i, label: "Fever in pregnancy" },
  { re: /(pregnan|garbh).{0,30}(fever|bukhar)/i, label: "Fever in pregnancy" },
  { re: /preeclampsia/i, label: "Preeclampsia symptoms" },
  { re: /(swelling|soojhna|soojan).{0,15}(face|haath|aankhein|sir|chehra)/i, label: "Face/hand swelling" },
  { re: /(sudden|achanak).{0,15}(swell|soojhan)/i, label: "Sudden swelling" },
  { re: /(vomit|ulti).{0,20}(all day|continuously|kuch nahi ruk|everything)/i, label: "Severe vomiting" },
  { re: /(can.t|unable|nahi).{0,10}(eat|drink|kha|pi).{0,15}(24|hours|din)/i, label: "Unable to eat/drink 24h" },
  { re: /(no|nahi|kam).{0,15}(movement|hilna).{0,10}(since|for|se).{0,5}[2-9]/i, label: "Reduced fetal movements" },
  { re: /(leak|seep|drip).{0,10}(fluid|paani|water)/i, label: "Fluid leaking" },
  { re: /(infection|sepsis).{0,15}(fever|bukhar|redness)/i, label: "Infection with fever" },
  { re: /(uti|urinary).{0,20}(fever|back pain|kidney)/i, label: "UTI with fever" },
  { re: /(gestational diabetes|gdm).{0,20}(sugar.{0,5}(very|bahut) high|uncontrol)/i, label: "Uncontrolled GDM" },
  { re: /(miscarriage|garbhpat).{0,15}(pain|bleed|signs)/i, label: "Miscarriage signs" },
  { re: /(ppd|postpartum depression|postnatal depression)/i, label: "Postpartum depression" },
  { re: /(thyroid).{0,15}(pregnan|garbh).{0,15}(high|low|uncontrol)/i, label: "Uncontrolled thyroid in pregnancy" },
  { re: /(iud|copper t).{0,15}(severe pain|bleeding|bleed)/i, label: "IUD complications" },
  { re: /bp.{0,15}(140|150|15\d)/i, label: "Borderline high BP 140-159" },
  { re: /(premature|preterm).{0,10}(labor|contraction|dard)/i, label: "Preterm labor signs" },
];

export interface TriageResult {
  level: TriageLevel;
  matchedLabels: string[];
}

export function triage(text: string): TriageResult {
  const redHits = RED.filter(p => p.re.test(text)).map(p => p.label);
  if (redHits.length > 0) return { level: "RED", matchedLabels: redHits };
  const yellowHits = YELLOW.filter(p => p.re.test(text)).map(p => p.label);
  if (yellowHits.length > 0) return { level: "YELLOW", matchedLabels: yellowHits };
  return { level: "GREEN", matchedLabels: [] };
}

export function triagePreamble(level: TriageLevel): string {
  if (level === "YELLOW") {
    return (
      "**Please see a doctor within 24 hours.** Based on what you've shared, " +
      "a clinician should look at this today. While you arrange that, here's " +
      "general information that might help — but it does not replace medical care."
    );
  }
  return "";
}
