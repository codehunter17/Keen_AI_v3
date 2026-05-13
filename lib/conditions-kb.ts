// Indian women's health conditions knowledge base — fed into the AI as RAG-context
// when symptom keywords match. Each entry is curated, citable, and short enough
// to fit in a system prompt segment.
//
// Sources: ICMR-NIN 2020, FOGSI Clinical Practice Guidelines 2023, ACOG, NIMHANS,
// PubMed reviews. Values verified to be commonly accepted in Indian clinical practice.
//
// NOT diagnostic. Educational only. The AI uses these to give specific, deep answers
// instead of vague "see a doctor" deflections.

export interface ConditionEntry {
  id: string;
  name: string;
  hindiName?: string;
  // Keyword triggers — if any appear in user message, include this entry in context.
  triggers: string[];
  // ≤ 60-word summary of what the condition actually is.
  summary: string;
  // Common presenting symptoms (the AI uses these to ask follow-up questions).
  symptoms: string[];
  // Recommended tests + typical Indian price range — AI uses these to ask user to upload.
  tests: { name: string; approxRupees: number; what: string }[];
  // What lifestyle / dietary management actually helps (zero generalization).
  management: string[];
  // When to escalate to a doctor (uses the four ESCALATE-TO-DOCTOR criteria).
  escalateWhen: string[];
}

export const CONDITIONS: ConditionEntry[] = [
  {
    id: "iron-deficiency-anemia",
    name: "Iron Deficiency Anaemia",
    hindiName: "खून की कमी",
    triggers: ["anemia", "anaemia", "khoon ki kami", "low hb", "haemoglobin", "hemoglobin", "tired", "thakaan", "dizzy", "chakkar", "pale"],
    summary:
      "About 53% of Indian women have iron deficiency. Reduced oxygen-carrying capacity → fatigue, dizziness, breathlessness on exertion, brittle nails, hair loss. ICMR classifies severity by Hb (g/dL): 11+ normal, 10-10.9 mild, 7-9.9 moderate, <7 severe.",
    symptoms: [
      "Persistent fatigue / weakness",
      "Pale skin, lips, inside lower eyelid",
      "Breathlessness climbing stairs",
      "Dizziness on standing",
      "Cold hands/feet",
      "Brittle / spoon-shaped nails",
      "Pica (craving non-food like ice, mud)",
      "Hair fall in clumps",
    ],
    tests: [
      { name: "CBC (Complete Blood Count)", approxRupees: 300, what: "Hb, MCV, MCH — confirms anaemia and gives clue to type" },
      { name: "Serum Ferritin", approxRupees: 500, what: "Iron stores — < 30 ng/mL confirms deficiency" },
      { name: "Iron studies (TIBC, transferrin saturation)", approxRupees: 800, what: "Distinguishes iron-deficiency from chronic-disease anaemia" },
    ],
    management: [
      "Hb 10-10.9: 60 mg elemental iron/day (one Orofer XT or Autrin) + diet. Recheck Hb in 4 weeks.",
      "Hb 7-9.9: 120 mg elemental iron/day, divided. Add 5 mg folic acid. Recheck Hb in 2 weeks.",
      "Diet: methi saag, palak, bhuna chana, gur+chana, bajra roti, ragi mudde, sattu, anar, dates.",
      "Pair with vitamin C — nimbu, amla, oranges — same meal. Increases absorption 3x.",
      "Avoid tea / coffee within 2 hours of iron-rich meals (tannins block absorption).",
      "Cooking in iron kadhai adds 1-2 mg per meal.",
    ],
    escalateWhen: [
      "Hb < 7 g/dL — IV iron / transfusion may be needed",
      "Pregnancy + Hb < 9 g/dL after 4 weeks of oral iron",
      "Heavy menstrual bleeding (>80 mL / cycle, soaking >7 pads/day)",
      "Symptoms of iron-deficiency unresponsive after 4 weeks of supplementation",
    ],
  },
  {
    id: "pcos",
    name: "Polycystic Ovary Syndrome (PCOS)",
    hindiName: "पॉलीसिस्टिक ओवरी",
    triggers: ["pcos", "pcod", "polycystic", "irregular periods", "ovulation", "hirsutism", "facial hair", "beard", "jawline acne", "weight gain"],
    summary:
      "Affects 1 in 5 Indian women. Diagnosis by Rotterdam criteria — need 2 of 3: oligo/anovulation, clinical/biochemical hyperandrogenism, polycystic ovaries on USG. Strongly linked to insulin resistance.",
    symptoms: [
      "Cycles >35 days or skipped months",
      "Excess facial / body hair (hirsutism)",
      "Persistent jawline acne",
      "Weight gain, especially abdominal",
      "Hair thinning on the head",
      "Acanthosis (dark velvety patches on neck, armpits — insulin resistance sign)",
      "Difficulty conceiving",
    ],
    tests: [
      { name: "Pelvic USG", approxRupees: 1500, what: "Counts antral follicles — ≥12 in either ovary supports PCOS" },
      { name: "Total + Free Testosterone", approxRupees: 1200, what: "Confirms biochemical hyperandrogenism" },
      { name: "LH:FSH ratio", approxRupees: 800, what: "Classic PCOS shows >2:1 ratio" },
      { name: "Fasting Insulin + Glucose (HOMA-IR)", approxRupees: 600, what: "Identifies insulin resistance — central to PCOS" },
      { name: "TSH", approxRupees: 250, what: "Rules out hypothyroidism (looks like PCOS)" },
      { name: "Prolactin", approxRupees: 500, what: "Rules out hyperprolactinaemia" },
      { name: "AMH", approxRupees: 1200, what: "Often elevated in PCOS — useful baseline if planning fertility" },
    ],
    management: [
      "5-10% weight loss frequently restores ovulation. Track waist (target <80 cm).",
      "Low-glycaemic diet: ragi roti instead of refined wheat, sprouts before meals, less rice.",
      "Resistance training 3x/week + 30-min walking after dinner — improves insulin sensitivity.",
      "Inositol 4 g/day (myo + d-chiro 40:1) — clinical evidence for cycle regulation.",
      "Spearmint tea 2 cups/day — reduces hirsutism scores in 5 weeks (RCT data).",
      "Sleep 7+ hours — sleep deprivation worsens insulin resistance.",
      "Cinnamon 1-2 g/day — modest blood sugar improvement.",
    ],
    escalateWhen: [
      "Trying to conceive >12 months without success — needs a fertility specialist",
      "Severe acne not responding to skincare — may need spironolactone or OCP (prescription)",
      "Severe hirsutism — laser + medication management",
      "HbA1c > 5.7% — pre-diabetes screening + management",
    ],
  },
  {
    id: "hypothyroid",
    name: "Hypothyroidism",
    hindiName: "थायराइड",
    triggers: ["thyroid", "hypothyroid", "tsh", "weight gain", "cold", "constipation", "hair loss", "puffy face"],
    summary:
      "Affects ~10% of Indian women. Underactive thyroid → slowed metabolism. Symptoms overlap heavily with PCOS, depression, and pregnancy fatigue. Subclinical: TSH 4-10. Overt: TSH >10 with low T4.",
    symptoms: [
      "Persistent weight gain despite no diet change",
      "Cold intolerance — feel cold when others don't",
      "Constipation (less than 3 bowel movements/week)",
      "Hair fall, dry skin, brittle nails",
      "Puffy face, especially around eyes",
      "Heavy / prolonged periods",
      "Slow heart rate",
      "Brain fog, low mood",
    ],
    tests: [
      { name: "TSH", approxRupees: 250, what: "Primary screen — Indian normal ~0.4-4.0 mIU/L" },
      { name: "Free T4", approxRupees: 350, what: "Confirms overt hypothyroidism if TSH high + Free T4 low" },
      { name: "Anti-TPO antibody", approxRupees: 800, what: "If positive → Hashimoto's autoimmune thyroiditis" },
    ],
    management: [
      "Diet: avoid raw cruciferous (cabbage, broccoli) in excess if hypothyroid — they're goitrogens.",
      "Iodine: include 1-2 servings of iodized salt + dairy daily.",
      "Selenium: 1 brazil nut or 50 g pumpkin seeds — supports thyroid hormone conversion.",
      "Avoid soy / coffee within 1 hour of thyroxine — interferes with absorption.",
      "Take thyroxine fasting, 30 min before tea/breakfast.",
      "Exercise + adequate protein — counters slowed metabolism.",
    ],
    escalateWhen: [
      "TSH > 4.0 — needs prescription thyroxine titration (not OTC)",
      "Pregnancy or planning — TSH must be < 2.5 in T1 to protect fetal brain development",
      "Anti-TPO positive — endocrinologist referral for autoimmune workup",
    ],
  },
  {
    id: "gestational-diabetes",
    name: "Gestational Diabetes Mellitus (GDM)",
    hindiName: "गर्भावस्था में डायबिटीज",
    triggers: ["gdm", "gestational diabetes", "sugar in pregnancy", "ogtt", "high blood sugar"],
    summary:
      "10-14% of Indian pregnancies. Diagnosed by 75 g OGTT at 24-28 weeks. Diagnostic if any one: fasting ≥92, 1-hr ≥180, 2-hr ≥153 mg/dL. Untreated → macrosomia, neonatal hypoglycaemia.",
    symptoms: [
      "Often silent in early stages",
      "Excessive thirst",
      "Frequent urination beyond normal pregnancy",
      "Recurrent vaginal yeast infections",
      "Sudden unexpected weight gain",
      "Glycosuria on routine urine test",
    ],
    tests: [
      { name: "Fasting + Postprandial blood sugar", approxRupees: 200, what: "First-line screen at any antenatal visit" },
      { name: "75 g OGTT (Oral Glucose Tolerance Test)", approxRupees: 500, what: "Standard at 24-28 weeks per FOGSI" },
      { name: "HbA1c", approxRupees: 600, what: "Poor pregnancy marker but useful baseline" },
    ],
    management: [
      "Diet: 30-35 kcal/kg ideal body weight/day, split into 3 meals + 3 snacks.",
      "Cut refined carbs (white rice, maida, sugar). Replace with millets — bajra, jowar, ragi.",
      "Snack on bhuna chana, peanuts, sattu drink — stable sugar.",
      "Walk 10-15 minutes after each meal — drops post-meal sugar 20-30%.",
      "Self-monitor blood glucose 4x/day with a glucometer (~₹1500 one-time + strips).",
      "Targets: fasting <95, 1-hr post-meal <140, 2-hr <120 mg/dL.",
    ],
    escalateWhen: [
      "Any reading consistently above target despite 1-2 weeks of diet + walking",
      "Insulin or metformin is needed — prescription only",
      "Polyhydramnios or large-for-gestational-age on USG",
    ],
  },
  {
    id: "uti",
    name: "Urinary Tract Infection (UTI)",
    hindiName: "मूत्राशय संक्रमण",
    triggers: ["uti", "burning urine", "frequent urination", "pelvic pain", "cloudy urine", "blood in urine"],
    summary:
      "Recurrent in many Indian women due to dehydration + heat. Symptoms: dysuria, frequency, urgency, suprapubic pain. Untreated UTIs in pregnancy → pyelonephritis (kidney infection).",
    symptoms: [
      "Burning sensation while urinating",
      "Urgent + frequent urination",
      "Lower abdominal cramping",
      "Cloudy / strong-smelling / bloody urine",
      "Low-grade fever (in upper UTI: high fever + flank pain)",
    ],
    tests: [
      { name: "Urine routine + microscopy", approxRupees: 150, what: "Pus cells >5/HPF + nitrites = active infection" },
      { name: "Urine culture + sensitivity", approxRupees: 500, what: "Identifies bacteria + which antibiotic works (essential for recurrent)" },
    ],
    management: [
      "Drink 3+ L water/day until symptoms resolve.",
      "Pee within 15 min after sex — flushes bacteria.",
      "Cranberry juice (unsweetened) 250 ml/day — modest evidence for prevention, not cure.",
      "Vitamin C 500-1000 mg/day acidifies urine — supports clearance.",
      "Avoid sugary drinks during infection — bacteria feed on glucose.",
      "Wipe front-to-back. Cotton underwear. Loose clothing.",
    ],
    escalateWhen: [
      "Symptoms persist > 48 hours of home measures — needs antibiotics (prescription)",
      "Blood in urine, fever > 38.5°C, flank/back pain — possible kidney involvement (urgent)",
      "Pregnancy + ANY UTI symptom — needs antibiotic treatment immediately",
      "More than 2 UTIs in 6 months — needs urology workup",
    ],
  },
  {
    id: "ppd",
    name: "Postpartum Depression",
    hindiName: "प्रसवोत्तर अवसाद",
    triggers: ["ppd", "postpartum depression", "baby blues", "sad after delivery", "can't bond with baby", "crying", "hopeless"],
    summary:
      "Affects ~22% of Indian mothers. 'Baby blues' (mild, lasts 2 weeks) is normal; PPD is symptoms persisting >2 weeks or severe enough to impair function. Different from psychosis (rare, urgent).",
    symptoms: [
      "Persistent sadness, emptiness >2 weeks postpartum",
      "Difficulty bonding with baby",
      "Severe fatigue beyond 'new-mom tired'",
      "Loss of interest in things you previously enjoyed",
      "Excessive guilt, feeling like a bad mother",
      "Sleep changes beyond what the baby causes",
      "Thoughts of harming yourself or the baby (urgent)",
    ],
    tests: [
      { name: "Edinburgh Postnatal Depression Scale (EPDS)", approxRupees: 0, what: "10-question self-screen — score ≥10 suggests PPD" },
    ],
    management: [
      "Talk to one trusted person daily — isolation worsens it sharply.",
      "Sleep when baby sleeps. Sleep debt is fuel for PPD.",
      "Sunlight 15-20 min/day — supports serotonin.",
      "Postnatal yoga / 20-min walking — reduces depressive symptoms 30-40% in trials.",
      "Reach out to iCall (+91-9152987821, free) or Vandrevala (1860-2662-345, 24x7).",
      "Continued breastfeeding is okay during therapy + most antidepressants.",
    ],
    escalateWhen: [
      "EPDS score ≥ 13 — needs psychiatric assessment (often medication helps)",
      "Any thought of harming self or baby — call Vandrevala 1860-2662-345 NOW",
      "Symptoms unresolved after 4 weeks of self-help",
    ],
  },
  {
    id: "vit-d-deficiency",
    name: "Vitamin D Deficiency",
    hindiName: "विटामिन डी की कमी",
    triggers: ["vitamin d", "vit d", "bone pain", "fatigue", "muscle weakness", "back pain"],
    summary:
      "70-90% of Indian women are deficient despite abundant sun. Reasons: clothing coverage, melanin, indoor lifestyle, low fortification. Cutoffs: <20 ng/mL deficient, 20-30 insufficient, 30-50 optimal.",
    symptoms: [
      "Persistent body / bone pain",
      "Muscle weakness, especially climbing stairs",
      "Frequent infections (immune impact)",
      "Fatigue not explained by anaemia",
      "Mood changes",
      "Hair fall",
    ],
    tests: [
      { name: "25-OH Vitamin D", approxRupees: 700, what: "Single best marker. Repeat after 3 months of replacement" },
    ],
    management: [
      "<10 ng/mL: 60,000 IU weekly x 8-12 weeks + dietary sources.",
      "10-20: 60,000 IU weekly x 4-6 weeks.",
      "20-30: 60,000 IU monthly maintenance.",
      "Sun: 15-20 min midday (10 AM-12 PM), face + arms exposed, 3-4x/week.",
      "Foods (limited): fortified milk, mushrooms, egg yolk, fatty fish.",
      "Pair with calcium (ragi, dahi, til) — they're absorbed together.",
    ],
    escalateWhen: [
      "Bone pain with elevated alkaline phosphatase or low calcium — possible osteomalacia",
      "Failure to improve after 12 weeks of supplementation — investigate malabsorption",
    ],
  },
  {
    id: "endometriosis",
    name: "Endometriosis",
    hindiName: "एंडोमेट्रिओसिस",
    triggers: ["endometriosis", "severe period pain", "painful sex", "chronic pelvic pain", "infertility"],
    summary:
      "Endometrial tissue grows outside the uterus → cyclic inflammation, scarring, infertility. Often takes 7-10 years to diagnose in India. Cycles aren't 'just supposed to hurt'.",
    symptoms: [
      "Severe period pain that disrupts daily life",
      "Pain during or after sex (dyspareunia)",
      "Pain with bowel movements during periods",
      "Chronic pelvic pain outside periods",
      "Heavy or irregular periods",
      "Difficulty conceiving",
      "Bloating, fatigue",
    ],
    tests: [
      { name: "Pelvic + transvaginal USG", approxRupees: 2000, what: "Detects endometriomas (chocolate cysts), not superficial lesions" },
      { name: "MRI pelvis", approxRupees: 8000, what: "Better for deep infiltrating endometriosis" },
      { name: "Diagnostic laparoscopy", approxRupees: 50000, what: "Gold standard but invasive — only when needed for management" },
    ],
    management: [
      "Anti-inflammatory diet: omega-3 (chia, flax, walnuts), turmeric, ginger.",
      "Reduce dairy + red meat — some evidence of symptom reduction.",
      "Heat therapy + magnesium 300-400 mg/day — reduces cramps.",
      "Pelvic floor physiotherapy if dyspareunia is prominent.",
      "Yoga + meditation reduces pain perception.",
    ],
    escalateWhen: [
      "Period pain that NSAIDs can't control — needs hormonal therapy (prescription)",
      "Trying to conceive >6 months with endometriosis — fertility specialist",
      "Suspected endometrioma >4 cm — surgical evaluation",
    ],
  },
];

export function findRelevantConditions(userMessage: string, max = 2): ConditionEntry[] {
  const text = userMessage.toLowerCase();
  const matches = CONDITIONS.map((c) => {
    const hits = c.triggers.filter((t) => text.includes(t.toLowerCase())).length;
    return { c, hits };
  })
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, max)
    .map((x) => x.c);
  return matches;
}

/** Render conditions as a context block for the system prompt. */
export function conditionsContextBlock(conditions: ConditionEntry[]): string {
  if (conditions.length === 0) return "";
  const blocks = conditions.map((c) => {
    return [
      `## ${c.name}${c.hindiName ? ` (${c.hindiName})` : ""}`,
      `Summary: ${c.summary}`,
      `Common symptoms (use to ask follow-up):\n${c.symptoms.map((s) => `  - ${s}`).join("\n")}`,
      `Recommended tests (ask user to upload these):\n${c.tests
        .map((t) => `  - ${t.name} (~₹${t.approxRupees}) — ${t.what}`)
        .join("\n")}`,
      `Lifestyle / dietary management:\n${c.management.map((m) => `  - ${m}`).join("\n")}`,
      `Real escalation criteria (ONLY these warrant "see a doctor"):\n${c.escalateWhen.map((e) => `  - ${e}`).join("\n")}`,
    ].join("\n");
  });
  return ["### CONDITION KNOWLEDGE (matched to user's message)", ...blocks].join("\n\n");
}
