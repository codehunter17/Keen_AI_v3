// ═══════════════════════════════════════════════════════════════════════════
// NutriMama — 40-week pregnancy clinical dataset
// Sources: Moore & Persaud (The Developing Human 10th Ed), ICMR RDA 2020,
//          WHO ANC Guidelines 2016, FOGSI 2023, ACOG Practice Bulletins
// Ported verbatim from keen_ai_compare/frontend/src/constants/data.js.
// Do not edit clinical content without re-checking the source citation.
// ═══════════════════════════════════════════════════════════════════════════

export interface FetalNutrient {
  name: string;
  dose: string;
  icmrValue: string;
  foods: string;
  reason: string;
}

export interface FetalWeek {
  week: number;
  babySize: { comparison: string; length_cm: string; weight_g: string };
  development: string;
  motherSymptoms: string[];
  nutrition: {
    focus: string;
    keyNutrients: FetalNutrient[];
    tip: string;
  };
  antenatalCare: string | null;
  warningSignsThisWeek: string[];
  source: string;
}

/** 40-week pregnancy dataset keyed by week (1-40). */
export const PREGNANCY_DATA: Record<number, FetalWeek> = {
  1: {
    week: 1,
    babySize: { comparison: "Not yet formed", length_cm: "Conception", weight_g: "<1" },
    development: "Sperm fertilizes egg. Zygote travels toward uterus. Cell division begins (Moore & Persaud, 10th Ed).",
    motherSymptoms: ["Fatigue", "Missed period coming soon"],
    nutrition: {
      focus: "Start folic acid supplementation immediately",
      keyNutrients: [
        { name: "Folic Acid", dose: "400 mcg", icmrValue: "400 mcg DFE/day", foods: "Fortified cereals, leafy greens, lentils", reason: "Prevents neural tube defects (FOGSI 2023)" },
        { name: "Iron", dose: "27 mg", icmrValue: "35 mg/day", foods: "Red meat, spinach, dal", reason: "Support increased blood volume (ICMR RDA 2020)" },
        { name: "Calcium", dose: "1000 mg", icmrValue: "1200 mg/day", foods: "Milk, yogurt, paneer, sesame seeds", reason: "Foundation for fetal skeleton (ICMR RDA 2020)" }
      ],
      tip: "Begin prenatal vitamins with folic acid today if trying to conceive or just confirmed pregnancy."
    },
    antenatalCare: null,
    warningSignsThisWeek: ["Heavy bleeding or cramping may indicate miscarriage — contact doctor"],
    source: "Moore & Persaud 10th Ed; FOGSI 2023"
  },

  2: {
    week: 2,
    babySize: { comparison: "Pinpoint", length_cm: "0.1", weight_g: "<1" },
    development: "Blastocyst implants into uterine wall. Placenta begins forming. Amniotic sac appears (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Breast tenderness", "Mild cramping", "Fatigue increasing"],
    nutrition: {
      focus: "Maintain consistent micronutrient intake",
      keyNutrients: [
        { name: "Protein", dose: "60 g", icmrValue: "78 g/day", foods: "Eggs, milk, dal, chicken, paneer", reason: "Building blocks for fetal tissues (ICMR RDA 2020)" },
        { name: "Vitamin B12", dose: "2.6 mcg", icmrValue: "2.6 mcg/day", foods: "Eggs, milk, fish, meat", reason: "Red blood cell formation (ICMR RDA 2020)" },
        { name: "Iodine", dose: "220 mcg", icmrValue: "220 mcg/day", foods: "Iodized salt, seaweed", reason: "Fetal thyroid and brain development (FOGSI 2023)" }
      ],
      tip: "Use iodized salt exclusively — critical for fetal neurodevelopment."
    },
    antenatalCare: null,
    warningSignsThisWeek: ["Severe abdominal pain", "Heavy vaginal bleeding beyond normal implantation spotting"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020"
  },

  3: {
    week: 3,
    babySize: { comparison: "Grain of rice", length_cm: "0.2", weight_g: "<1" },
    development: "Bilaminar disc forms. Primitive streak appears (notochord begins). Three primary germ layers forming (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Nausea starting", "Mood swings", "Fatigue"],
    nutrition: {
      focus: "Combat morning sickness; maintain calories",
      keyNutrients: [
        { name: "Vitamin B6", dose: "1.9 mg", icmrValue: "1.9 mg/day", foods: "Chickpeas, bananas, potatoes, salmon", reason: "Reduces nausea by 25–30% (RCT evidence)" },
        { name: "Ginger", dose: "1–2 g", icmrValue: "Non-ICMR; traditional", foods: "Fresh ginger, ginger tea, ginger biscuits", reason: "Safe herbal remedy for nausea in pregnancy (WHO approved)" },
        { name: "Energy", dose: "1900 kcal", icmrValue: "2200 kcal/day (T1 baseline)", foods: "Small frequent meals", reason: "T1 caloric needs similar to non-pregnant; increase from T2 (ICMR RDA 2020)" }
      ],
      tip: "Eat small meals every 2 hours. Ginger biscuits or dry toast upon waking reduces nausea significantly."
    },
    antenatalCare: null,
    warningSignsThisWeek: ["Inability to keep any food or fluids down — contact doctor"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020"
  },

  4: {
    week: 4,
    babySize: { comparison: "Poppy seed", length_cm: "0.4–1", weight_g: "<1" },
    development: "Neural tube closes. Heart tube begins beating (~100 bpm visible on Doppler). Arm and leg buds emerge. Embryonic period begins formally (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Morning sickness peaks", "Food aversions", "Breast enlargement", "Frequent urination"],
    nutrition: {
      focus: "Prevent neural tube defects; establish supplement routine",
      keyNutrients: [
        { name: "Folic Acid", dose: "400 mcg", icmrValue: "570 mcg DFE/day total (400 mcg supplement recommended periconceptionally)", foods: "Fortified grains, dal, spinach, asparagus", reason: "NTD prevention window closes by Week 28 (ICMR/FOGSI)" },
        { name: "Zinc", dose: "12 mg", icmrValue: "12 mg/day", foods: "Pumpkin seeds, chickpeas, oysters (if available)", reason: "Immune function and organ formation (ICMR RDA 2020)" },
        { name: "Vitamin C", dose: "60 mg", icmrValue: "60 mg/day", foods: "Oranges, guava, tomato, bell peppers", reason: "Iron absorption; collagen synthesis for placenta (ICMR RDA 2020)" }
      ],
      tip: "Take folic acid supplement with breakfast daily. Pair iron with citrus for better absorption."
    },
    antenatalCare: "Book first ANC appointment if not done — get dating scan.",
    warningSignsThisWeek: ["Severe abdominal cramping or vaginal bleeding"],
    source: "Moore & Persaud 10th Ed; FOGSI 2023; ICMR RDA 2020"
  },

  5: {
    week: 5,
    babySize: { comparison: "Apple seed", length_cm: "2–3", weight_g: "~1" },
    development: "Heart has 4 chambers now. Brain, spinal cord, and organs developing. Fingers and toes starting to form. Embryonic folds visible (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Severe nausea and vomiting", "Extreme fatigue", "Breast tenderness worsens"],
    nutrition: {
      focus: "Manage hyperemesis gravidarum symptoms",
      keyNutrients: [
        { name: "Ginger Root", dose: "1–2 g", icmrValue: "Non-ICMR; traditional", foods: "Ginger tea with honey, fresh ginger slices", reason: "Reduces nausea by 25–30%; safe in pregnancy (WHO)" },
        { name: "Vitamin B1 (Thiamine)", dose: "1.4 mg", icmrValue: "1.4 mg/day", foods: "Whole wheat, pork, legumes", reason: "Energy metabolism; deficiency worsens nausea" },
        { name: "Electrolytes", dose: "Ad libitum", icmrValue: "Sodium, potassium balance critical", foods: "Coconut water, buttermilk, oral rehydration solution", reason: "Prevent dehydration if vomiting severe (FOGSI guideline)" }
      ],
      tip: "If vomiting >3 times/day or unable to keep fluids down, contact OB/GYN — may need IV hydration."
    },
    antenatalCare: "First ANC visit should be booked if not already done.",
    warningSignsThisWeek: ["Persistent vomiting with weight loss", "Dark urine indicating dehydration", "Abdominal pain"],
    source: "Moore & Persaud 10th Ed; FOGSI 2023"
  },

  6: {
    week: 6,
    babySize: { comparison: "Pea", length_cm: "4–6", weight_g: "~1" },
    development: "Heart beats visibly on Doppler (110–120 bpm). Arm and leg buds form distinct digits. Eyes, nose, mouth becoming visible. Blood circulation established (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Nausea persistent", "Fatigue severe", "Dizziness possibly"],
    nutrition: {
      focus: "Maximize nutrient absorption despite nausea",
      keyNutrients: [
        { name: "Iron", dose: "27 mg", icmrValue: "35 mg/day", foods: "Fortified cereals, red lentils, jaggery with sesame", reason: "Expanded blood volume requires 25–30% more iron (ICMR RDA 2020)" },
        { name: "DHA", dose: "Not yet critical", icmrValue: "200 mg/day from Week 20", foods: "Fatty fish (safe types), flax seeds, walnuts", reason: "DHA critical from Week 20 for fetal brain development (FOGSI)" },
        { name: "Magnesium", dose: "350 mg", icmrValue: "350 mg/day", foods: "Pumpkin seeds, almonds, leafy greens, dark chocolate", reason: "Muscle relaxation; supports morning sickness reduction" }
      ],
      tip: "Small, frequent meals of easily digestible foods. Cold foods often better tolerated than hot. Ginger and lemon helpful."
    },
    antenatalCare: "Schedule dating ultrasound (Week 8–12) to confirm dates.",
    warningSignsThisWeek: ["Severe dizziness or chest pain", "Vaginal bleeding"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023"
  },

  7: {
    week: 7,
    babySize: { comparison: "Blueberry", length_cm: "8–10", weight_g: "~1" },
    development: "All major organs forming. Fingers and toes distinct now. Brain hemisphere developing. Eyelids starting to form, still fused (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Nausea may peak", "Fatigue continues", "Constipation starting (iron supplements)"],
    nutrition: {
      focus: "Prevent constipation; maintain iron supplementation",
      keyNutrients: [
        { name: "Fiber", dose: "25–30 g/day", icmrValue: "Recommended addition to RDA", foods: "Whole wheat, oats, isabgol (psyllium), prunes, beans", reason: "Iron supplements cause constipation; fiber prevents (25–30 g recommended)" },
        { name: "Iron (IFA supplement)", dose: "60 mg elemental", icmrValue: "35 mg/day (WHO recommends 30–60 mg supplement)", foods: "Iron tablet + 500 mcg folic acid daily", reason: "Prevention of IDA in pregnancy; universal in India (National Iron Plus Initiative)" },
        { name: "Water & Fluids", dose: "8–10 glasses", icmrValue: "Ad libitum", foods: "Water, coconut water, buttermilk, herbal teas", reason: "Prevent dehydration from morning sickness and increasing blood volume" }
      ],
      tip: "Take IFA tablet with orange juice or vitamin C source on empty stomach for best absorption. Increase fluids and fiber to offset constipation."
    },
    antenatalCare: null,
    warningSignsThisWeek: ["Sudden cessation of nausea (may indicate miscarriage) — see doctor"],
    source: "ICMR RDA 2020; National Iron Plus Initiative India; FOGSI 2023"
  },

  8: {
    week: 8,
    babySize: { comparison: "Raspberry", length_cm: "14–20", weight_g: "~1" },
    development: "Embryo now called fetus. All organ systems initiated. Fingers and toes webbing disappearing. External genitalia still indifferent. Pituitary gland forming (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Nausea may start improving", "Extreme fatigue", "Mood swings"],
    nutrition: {
      focus: "Begin comprehensive micronutrient monitoring",
      keyNutrients: [
        { name: "Calcium", dose: "1000 mg", icmrValue: "1200 mg/day", foods: "Milk (2 cups), curd, paneer, sesame seeds (til), ragi", reason: "Critical for fetal skeleton formation beginning now; 1200 mg mandatory (ICMR RDA 2020)" },
        { name: "Vitamin D", dose: "600 IU", icmrValue: "600 IU/day", foods: "Egg yolks, fortified milk, sunlight exposure (15 min/day)", reason: "Calcium absorption depends on Vitamin D (ICMR RDA 2020)" },
        { name: "Omega-3 (ALA)", dose: "1.4 g/day", icmrValue: "1.4 g/day", foods: "Flax seeds, walnuts, mustard oil", reason: "Fetal nervous system development (ICMR RDA 2020)" }
      ],
      tip: "Dating ultrasound should be done by end of Week 12. Get 15–20 minutes sunlight daily for Vitamin D synthesis."
    },
    antenatalCare: "Confirm pregnancy dating. Blood group, Hb, urine, HIV, syphilis screening should be done by Week 12 (WHO ANC 2016).",
    warningSignsThisWeek: ["Severe abdominal pain", "Vaginal bleeding with cramping"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; WHO ANC 2016"
  },

  9: {
    week: 9,
    babySize: { comparison: "Grape", length_cm: "21–23", weight_g: "~2" },
    development: "Facial features more human-like. Eyes moving toward front of face. Ears forming. Fingers and toes forming distinct nails (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Nausea improving in some", "Breast changes continue", "Mood swings"],
    nutrition: {
      focus: "Transition: increase calories gradually",
      keyNutrients: [
        { name: "Protein", dose: "65 g", icmrValue: "78 g/day", foods: "Dhal (40 g), milk (200 ml), eggs (1–2), chicken (50 g)", reason: "Building fetal tissues; immune system development (ICMR RDA 2020)" },
        { name: "Vitamin B12", dose: "2.6 mcg", icmrValue: "2.6 mcg/day", foods: "Eggs, milk, fish, fortified cereals", reason: "Fetal nerve development; deficiency causes cognitive delays (ICMR RDA 2020)" },
        { name: "Folate (continued)", dose: "400 mcg supplement", icmrValue: "570 mcg DFE/day total", foods: "Leafy greens, dal, fortified grains, supplement", reason: "Continue until Week 12 minimum for neural tube closure (FOGSI)" }
      ],
      tip: "Nausea often eases Week 8–12. Resume normal diet if improving. Check Hemoglobin levels at first ANC visit."
    },
    antenatalCare: "First ANC visit should be completed with all screenings (WHO ANC 2016).",
    warningSignsThisWeek: ["Heavy bleeding (more than normal period)", "Severe cramps"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023"
  },

  10: {
    week: 10,
    babySize: { comparison: "Strawberry", length_cm: "30–35", weight_g: "~4" },
    development: "Fingernails forming. External genitalia visible but sex not yet determinable. Kidneys producing urine. Bone development beginning (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Nausea often resolves", "Fatigue improving", "Urinary frequency continues"],
    nutrition: {
      focus: "Consolidate first-trimester nutrition gains",
      keyNutrients: [
        { name: "Calcium", dose: "1000 mg", icmrValue: "1200 mg/day", foods: "Milk, curd, paneer, ragi, sesame seeds", reason: "Fetal skeleton hardening; maternal bone protection (ICMR RDA 2020)" },
        { name: "Iron IFA", dose: "60 mg elemental + 500 mcg folic acid", icmrValue: "35 mg/day; 570 mcg DFE/day", foods: "IFA tablet (1/day)", reason: "Prevent IDA; universal protocol in India (National Iron Plus Initiative)" },
        { name: "Energy Increase", dose: "1900–2000 kcal", icmrValue: "2200 kcal/day from Week 14 onward", foods: "Begin gradual increase from T1 baseline", reason: "Metabolic rate increasing; T1 nearing end" }
      ],
      tip: "End of first trimester approaching. Most women feel much better now. Miscarriage risk drops to <1% from Week 13."
    },
    antenatalCare: "Nuchal translucency scan (11–14 weeks) for Down syndrome screening can be offered.",
    warningSignsThisWeek: ["Reduced urinary output despite adequate fluids", "Severe headache"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020"
  },

  11: {
    week: 11,
    babySize: { comparison: "Fig", length_cm: "35–38", weight_g: "~7" },
    development: "All organ systems present. Teeth starting to form inside gums. Reproductive system differentiating. Movements increasing but not yet felt (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Nausea mostly gone", "Fatigue improving", "Mood stabilizing"],
    nutrition: {
      focus: "Prepare for second trimester energy needs",
      keyNutrients: [
        { name: "Energy", dose: "2000–2100 kcal", icmrValue: "2200 kcal/day (T2 onwards)", foods: "Grains, legumes, oils, fruits, vegetables", reason: "Ramp up by +300 kcal above baseline from Week 14 (ICMR RDA 2020)" },
        { name: "Carbohydrates", dose: "300–320 g/day", icmrValue: "Included in kcal target", foods: "Whole wheat roti, rice, oats, sweet potato, fruits", reason: "Fetal brain glucose demands increasing; prevent ketosis" },
        { name: "Multivitamin (if not adequate from diet)", dose: "Check micronutrients", icmrValue: "IFA supplement mandatory; others as needed", foods: "Continue existing supplements + assess adequacy", reason: "Ensure all RDA targets met (ICMR RDA 2020)" }
      ],
      tip: "First trimester complete. Risk of miscarriage now very low (<0.1% per week). Pregnancy becomes more visible."
    },
    antenatalCare: "Nuchal translucency screening Window closes Week 14. Book if interested.",
    warningSignsThisWeek: ["Sudden onset headache or vision changes", "Vaginal bleeding"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020"
  },

  12: {
    week: 12,
    babySize: { comparison: "Lime", length_cm: "50–55", weight_g: "~14" },
    development: "End of first trimester formally. Baby can make facial expressions. Fingers separate from webbing completely. Kidneys actively producing urine. Brain growth rapid (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Energy returning", "Bump visible", "Mood improving", "Second trimester 'glow' begins"],
    nutrition: {
      focus: "Maximize nutrient density; prepare for rapid growth phase",
      keyNutrients: [
        { name: "Protein", dose: "70 g/day", icmrValue: "78 g/day", foods: "Dhal (2 bowls), milk (1.5 cups), eggs (1–2), paneer, chicken (50 g)", reason: "Fetal tissue growth accelerating in T2 (ICMR RDA 2020)" },
        { name: "Calcium", dose: "1000 mg", icmrValue: "1200 mg/day", foods: "Milk, curd, paneer, leafy greens, ragi, sesame", reason: "Peak fetal skeletal mineralization begins T2 (ICMR RDA 2020)" },
        { name: "Iron IFA", dose: "Continue 60 mg + 500 mcg folic acid", icmrValue: "35 mg/day + 570 mcg DFE/day", foods: "IFA tablet daily throughout pregnancy", reason: "Prevent IDA; protect maternal health (National Iron Plus Initiative)" }
      ],
      tip: "T1 complete — congratulations! Energy boost is real. Can now increase food intake gradually to +300 kcal/day target."
    },
    antenatalCare: "First trimester screening complete. Second trimester planning begins. ANC contact 2 scheduled for Week 20 (anomaly scan).",
    warningSignsThisWeek: ["Sudden severe headache or vision changes — call 108"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; WHO ANC 2016"
  },

  13: {
    week: 13,
    babySize: { comparison: "Peach", length_cm: "65–70", weight_g: "~23" },
    development: "Second trimester begins. Bone hardening accelerating. Vocal cords forming. Baby beginning to suck thumb. Fingerprints forming (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Energy much improved", "Appetite increasing", "Ligament pain may start (round ligament stretch)", "Nasal congestion from increased estrogen"],
    nutrition: {
      focus: "Increase calories to +300 kcal/day now",
      keyNutrients: [
        { name: "Energy", dose: "2200 kcal/day", icmrValue: "2200 kcal/day (T2 onwards)", foods: "+300 kcal from non-pregnant baseline = extra snack daily", reason: "Fetal rapid growth phase; increased maternal metabolism (ICMR RDA 2020)" },
        { name: "Calcium + Vitamin D", dose: "1000 mg Ca + 600 IU Vit D", icmrValue: "1200 mg Ca, 600 IU Vit D", foods: "Fortified milk, paneer, sesame, sunlight 15 min/day", reason: "Skeleton mineralization peak (ICMR RDA 2020)" },
        { name: "Iron", dose: "27 mg food + 60 mg supplement", icmrValue: "35 mg/day total", foods: "IFA tablet + spinach, dal, raisins, pomegranate", reason: "Prevent IDA; prepare for increased blood loss at delivery (FOGSI 2023)" }
      ],
      tip: "Add extra snacks: a piece of fruit, handful of nuts, slice of paneer, or small yogurt. Round ligament pain feels like sharp ache in groin — normal, not dangerous."
    },
    antenatalCare: null,
    warningSignsThisWeek: ["Severe sharp pain in abdomen (not just round ligament stretch)", "Vaginal bleeding"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020"
  },

  14: {
    week: 14,
    babySize: { comparison: "Lemon", length_cm: "80–85", weight_g: "~43" },
    development: "Sex may now be visible on USS (baby's genitalia clearly differentiated). Baby can hear low frequencies. Taste buds forming. Hair growth beginning (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Appetite strong", "Weight gain visible", "Nasal congestion", "Some women report improved mood (hormonal stability)"],
    nutrition: {
      focus: "Establish sustainable eating pattern for T2",
      keyNutrients: [
        { name: "Balanced Macros", dose: "Carbs 300 g, Protein 78 g, Fat 70 g", icmrValue: "Within 2200 kcal ICMR RDA", foods: "3 meals + 2 snacks daily", reason: "Support rapid fetal growth and maternal changes (ICMR RDA 2020)" },
        { name: "Folate", dose: "400 mcg supplement + 170 mcg from diet", icmrValue: "570 mcg DFE/day", foods: "Leafy greens, dal, fortified grains, supplement", reason: "Continue through T2 (not just T1) for fetal development (FOGSI)" },
        { name: "Zinc", dose: "12 mg/day", icmrValue: "12 mg/day", foods: "Chickpeas, sesame, cashews, chicken, eggs", reason: "Immune function, protein synthesis (ICMR RDA 2020)" }
      ],
      tip: "Baby can hear now. Sing, read, play music — all beneficial. Weight gain T2 should be ~0.5 lb/week or ~6 kg over T2."
    },
    antenatalCare: null,
    warningSignsThisWeek: ["Persistent headache", "Vision changes or blurred vision"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023"
  },

  15: {
    week: 15,
    babySize: { comparison: "Apple", length_cm: "100–110", weight_g: "~70" },
    development: "Lanugo (fine hair) covering body. Eyebrows and eyelashes visible. Movements increasing but still not felt by mother. Skeleton hardening (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Quickening possible but not yet in first pregnancy", "Round ligament pain", "Occasional Braxton Hicks may start"],
    nutrition: {
      focus: "Maintain consistent micronutrient intake",
      keyNutrients: [
        { name: "Iron (sustained)", dose: "27 mg food + 60 mg IFA supplement", icmrValue: "35 mg/day", foods: "IFA tablet daily + spinach, beetroot, poultry, legumes", reason: "Over 50% Indian pregnant women anemic; prevention critical (NFHS-5 2021)" },
        { name: "Vitamin C", dose: "60 mg/day", icmrValue: "60 mg/day", foods: "Citrus, guava, tomato, bell pepper", reason: "Enhances iron absorption; collagen for placental integrity (ICMR RDA 2020)" },
        { name: "Magnesium", dose: "350 mg/day", icmrValue: "350 mg/day", foods: "Pumpkin seeds, almonds, leafy greens, dark chocolate", reason: "Muscle relaxation; may reduce cramps and Braxton Hicks (ICMR RDA 2020)" }
      ],
      tip: "Quickening (fetal movement felt by mother) typically begins Week 16–20 for first pregnancy, Week 13–14 for subsequent ones."
    },
    antenatalCare: null,
    warningSignsThisWeek: ["Vaginal bleeding", "Severe abdominal pain"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; NFHS-5 2021"
  },

  16: {
    week: 16,
    babySize: { comparison: "Avocado", length_cm: "110–120", weight_g: "~100" },
    development: "Baby can hear sounds from outside. Skeleton hardening rapidly. Swallowing amniotic fluid beginning. Movements still not felt by mother (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Quickening likely beginning", "Ligament pain continues", "Occasional Braxton Hicks", "Growing belly"],
    nutrition: {
      focus: "Support rapid bone mineralization",
      keyNutrients: [
        { name: "Calcium", dose: "1000 mg", icmrValue: "1200 mg/day", foods: "Milk (2 cups), curd, paneer, ragi, sesame, almonds", reason: "Peak fetal bone mineralization; prevent maternal bone loss (ICMR RDA 2020)" },
        { name: "Phosphorus", dose: "1000 mg", icmrValue: "Adequate if Ca intake sufficient", foods: "Present in protein sources: milk, eggs, meat, legumes", reason: "Works with calcium for skeletal development (ICMR RDA 2020)" },
        { name: "DHA (Omega-3 long-chain)", dose: "200 mg/day", icmrValue: "200 mg/day from Week 20 (FOGSI recommends earlier)", foods: "Fatty fish (salmon, mackerel — safe types), algae supplements", reason: "Fetal brain and eye development accelerating (FOGSI 2023)" }
      ],
      tip: "Baby hears you now. Sensory experiences matter. Encourage father/partner to talk to belly. Hearing develops from this point."
    },
    antenatalCare: null,
    warningSignsThisWeek: ["Heavy vaginal bleeding (>1 pad/hour)", "Sudden severe abdominal pain"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023"
  },

  17: {
    week: 17,
    babySize: { comparison: "Pear", length_cm: "120–130", weight_g: "~140" },
    development: "Fat deposits beginning beneath skin (brown fat for temperature regulation). Vernix caseosa (protective waxy coating) beginning to cover skin. Movements stronger (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Quickening feeling stronger", "Itching (especially belly) from skin stretching", "Back pain may increase", "Ligament stretches"],
    nutrition: {
      focus: "Prevent obstetric cholestasis; manage itching",
      keyNutrients: [
        { name: "Omega-3 (DHA)", dose: "200 mg/day", icmrValue: "200 mg/day", foods: "Fatty fish, walnuts, flax, DHA supplement", reason: "Fetal brain 60% DHA; dry skin improved with omega-3 (FOGSI 2023)" },
        { name: "Vitamin E", dose: "15 mg/day", icmrValue: "15 mg/day", foods: "Nuts, seeds, vegetable oils, whole grains", reason: "Skin health; antioxidant for placental function (ICMR RDA 2020)" },
        { name: "Hydration", dose: "8–10 glasses water/day", icmrValue: "Ad libitum", foods: "Water, coconut water, herbal teas, milk", reason: "Skin elasticity; prevent itching from dryness (general obstetric wisdom)" }
      ],
      tip: "Itching usually normal from stretching. Apply coconut oil, cocoa butter daily. Severe itching (whole body, at night) can indicate cholestasis — inform doctor."
    },
    antenatalCare: null,
    warningSignsThisWeek: ["Severe persistent itching (whole body, especially palms/soles) — may indicate cholestasis"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023"
  },

  18: {
    week: 18,
    babySize: { comparison: "Sweet potato", length_cm: "140–150", weight_g: "~190" },
    development: "Yawning and hiccuping visible on USS. Fingerprints fully formed. Ears repositioned to final location on head (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Quickening now clear and regular", "Back and hip pain increasing", "Swelling possible (feet, hands)", "Constipation from iron supplements"],
    nutrition: {
      focus: "Support bone development; manage pregnancy discomforts",
      keyNutrients: [
        { name: "Calcium", dose: "1000 mg", icmrValue: "1200 mg/day", foods: "Milk, paneer, curd, leafy greens, ragi, sesame, almonds", reason: "Fetal bone mineralization peak (ICMR RDA 2020)" },
        { name: "Fiber", dose: "25–30 g/day", icmrValue: "Recommended addition", foods: "Whole wheat roti, oats, vegetables, prunes, isabgol", reason: "Combat constipation from iron supplements (25–30 g daily)" },
        { name: "Sodium (controlled)", dose: "≤2300 mg/day", icmrValue: "Limit to prevent preeclampsia", foods: "Avoid excess salt; use iodized salt in moderation", reason: "Excessive sodium worsens swelling and hypertension risk (ACOG 2020)" }
      ],
      tip: "Gestational diabetes screening begins Week 24. Maintain healthy weight gain (~0.5 lb/week T2). Back pain common — prenatal yoga or physical therapy helps."
    },
    antenatalCare: null,
    warningSignsThisWeek: ["Swelling of face/hands (sudden onset) — may indicate preeclampsia", "BP elevation"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; ACOG 2020"
  },

  19: {
    week: 19,
    babySize: { comparison: "Mango", length_cm: "150–160", weight_g: "~240" },
    development: "Vernix caseosa increasing (protective coating). Skin still thin and translucent, but becoming less so. Baby moving vigorously (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Quickening strong and regular", "Back pain worsening", "Swelling increasing", "Mood generally positive"],
    nutrition: {
      focus: "Prepare for anomaly scan nutrition requirements",
      keyNutrients: [
        { name: "Protein", dose: "78 g/day", icmrValue: "78 g/day", foods: "Dhal (2 servings), milk (200 ml), eggs (1–2), paneer (100 g), chicken (75 g)", reason: "Fetal tissue growth accelerating; maternal plasma expansion (ICMR RDA 2020)" },
        { name: "Iron (critical check)", dose: "27 mg food + 60 mg supplement", icmrValue: "35 mg/day", foods: "IFA tablet daily; spinach, beetroot, pomegranate, raisins", reason: "Hemoglobin check Week 20; prevent anemia for scan prep (FOGSI 2023)" },
        { name: "Vitamin A", dose: "770 mcg RAE/day", icmrValue: "770 mcg RAE/day", foods: "Sweet potato, carrots, spinach, pumpkin, mango, papaya", reason: "Fetal eye development; immune function (ICMR RDA 2020)" }
      ],
      tip: "Anomaly scan (Level II USS) scheduled Week 20. Ensure good hydration for clear imaging. Practice kick counts (should feel 10+ movements in 2 hours)."
    },
    antenatalCare: "Anomaly scan scheduled for Week 20.",
    warningSignsThisWeek: ["Reduced fetal movement (fewer than 10 in 2 hours) — contact doctor"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023"
  },

  20: {
    week: 20,
    babySize: { comparison: "Banana", length_cm: "160–170", weight_g: "~300" },
    development: "Halfway point! Vernix caseosa covers entire skin. Amniotic fluid swallowing increasing. Lanugo covering body completely. Bone marrow beginning to produce blood cells (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Fetal movement strong and regular", "Back pain significant", "Swelling continuing", "Possible shortness of breath"],
    nutrition: {
      focus: "Start DHA supplementation; support fetal brain development peak",
      keyNutrients: [
        { name: "DHA (Omega-3 long-chain)", dose: "200 mg/day", icmrValue: "200 mg/day from Week 20 (FOGSI 2023)", foods: "Fatty fish, algae-based DHA supplement, walnuts, flax (less bioavailable)", reason: "Fetal brain 60% DHA; development accelerating; improve from Week 20 (FOGSI 2023)" },
        { name: "Calcium + Vitamin D", dose: "1000 mg Ca + 600 IU Vit D", icmrValue: "1200 mg Ca + 600 IU Vit D", foods: "Milk (2 cups), paneer (100 g), fortified milk, sunlight 15 min/day", reason: "Peak fetal bone mineralization; prevent maternal osteoporosis (ICMR RDA 2020)" },
        { name: "Energy", dose: "2200 kcal/day", icmrValue: "2200 kcal/day", foods: "Maintain +300 kcal above non-pregnant baseline", reason: "Fetal and maternal growth accelerating (ICMR RDA 2020)" }
      ],
      tip: "Halfway! Baby weighing ~300 g. Anomaly scan should confirm normal development. DHA is critical from now for baby's brain. Continue IFA supplement through entire pregnancy."
    },
    antenatalCare: "ANC Contact 2: Level II (anomaly) USS. Assess fetal growth, anatomy, amniotic fluid. BP, Hb screening. Discuss birth plan.",
    warningSignsThisWeek: ["Heavy vaginal bleeding", "Sudden abdominal pain (not just Braxton Hicks)", "Persistent headache with vision changes"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023; WHO ANC 2016"
  },

  21: {
    week: 21,
    babySize: { comparison: "Carrot", length_cm: "260", weight_g: "~360" },
    development: "Baby gaining weight rapidly now (gaining ~100 g/week from this point). Eyelids still fused but eye movement beginning. Meconium forming in intestines (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Strong regular fetal movement", "Braxton Hicks may become more frequent", "Back and pelvic pain", "Possible heartburn increasing"],
    nutrition: {
      focus: "Prevent gestational diabetes; manage heartburn",
      keyNutrients: [
        { name: "Whole Grains", dose: "6–8 servings/day", icmrValue: "Part of 2200 kcal target", foods: "Brown rice, whole wheat roti, oats, jowar, bajra", reason: "Low glycemic index reduces GDM risk (FOGSI 2023)" },
        { name: "Fiber", dose: "25–30 g/day", icmrValue: "Recommended addition", foods: "Vegetables, whole grains, legumes, fruits with skin", reason: "Reduce heartburn severity; support glucose control (ACOG 2020)" },
        { name: "DHA", dose: "200 mg/day", icmrValue: "200 mg/day", foods: "Fatty fish, DHA supplement", reason: "Continue through rest of pregnancy (FOGSI 2023)" }
      ],
      tip: "Heartburn due to progesterone relaxing esophageal sphincter + baby pressing on stomach. Small frequent meals, avoid spicy/fatty foods, elevate head while sleeping."
    },
    antenatalCare: null,
    warningSignsThisWeek: ["Severe heartburn unrelieved by lifestyle changes", "Difficulty swallowing"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023; ACOG 2020"
  },

  22: {
    week: 22,
    babySize: { comparison: "Papaya", length_cm: "275", weight_g: "~430" },
    development: "Sleep/wake cycles established (baby sleeps 20 min at a time, wakes 40 min). Eyelids still fused. Skin becoming less translucent as fat deposits increase (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Fetal sleep/wake patterns noticeable", "Increased hunger", "Back pain significant", "Swelling worsening", "Possible carpal tunnel syndrome (swelling at wrist)"],
    nutrition: {
      focus: "Maximize nutrient density; prepare for GDM screening",
      keyNutrients: [
        { name: "Protein", dose: "78 g/day", icmrValue: "78 g/day", foods: "Dhal (2 cups), milk, eggs, paneer, chicken, fish", reason: "Support fetal growth (~100 g/week); maintain maternal muscle (ICMR RDA 2020)" },
        { name: "Complex Carbohydrates", dose: "300–320 g/day", icmrValue: "Part of 2200 kcal", foods: "Whole grains, vegetables, legumes, limited simple sugars", reason: "Prepare body for GDM screening Week 24 (FOGSI 2023)" },
        { name: "Vitamin B6", dose: "1.9 mg/day", icmrValue: "1.9 mg/day", foods: "Chickpeas, bananas, potatoes, salmon, chicken", reason: "Reduce carpal tunnel syndrome symptoms (common in pregnancy)" }
      ],
      tip: "GDM screening (75 g OGTT) in 2 weeks. Avoid excess sugar now; establish healthy eating pattern. Carpal tunnel wrist splint at night helps."
    },
    antenatalCare: null,
    warningSignsThisWeek: ["Severe sudden pain in wrist/hand — may indicate severe carpal tunnel", "Severe swelling of feet/hands"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023"
  },

  23: {
    week: 23,
    babySize: { comparison: "Large mango", length_cm: "290", weight_g: "~500" },
    development: "Lungs developing rapidly (alveoli forming). Inner ear fully developed (balance and hearing refined). Baby's movements becoming stronger and more coordinated (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Rapid weight gain accelerating", "Swelling increasing", "Possible leg cramps at night", "Braxton Hicks more frequent"],
    nutrition: {
      focus: "Optimize nutrition for fetal viability threshold",
      keyNutrients: [
        { name: "Calcium + Magnesium", dose: "1000 mg Ca + 350 mg Mg", icmrValue: "1200 mg Ca, 350 mg Mg", foods: "Milk, sesame, almonds, leafy greens, dark chocolate, pumpkin seeds", reason: "Prevent leg cramps (combined Ca + Mg 40% effective); fetal skeleton support (ICMR RDA 2020)" },
        { name: "Iron", dose: "27 mg food + 60 mg supplement", icmrValue: "35 mg/day", foods: "IFA tablet daily; spinach, dal, raisins, meat", reason: "Prepare for blood loss at delivery; prevent severe anemia (FOGSI 2023)" },
        { name: "Protein + Calories", dose: "78 g protein, 2200 kcal", icmrValue: "ICMR RDA targets", foods: "3 meals + 2 snacks daily, nutrient-dense", reason: "Support rapid fetal growth (~100 g/week); improve outcomes at Week 24 viability (ACOG)" }
      ],
      tip: "Week 24 is viability threshold if baby born now (survival rate ~50–60% with NICU care). At this week, fetal viability approaching. Maintain excellent nutrition."
    },
    antenatalCare: "GDM screening (75 g OGTT) should be scheduled for Week 24–26.",
    warningSignsThisWeek: ["Severe leg cramps", "Swelling that doesn't improve with rest"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023; ACOG 2020"
  },

  24: {
    week: 24,
    babySize: { comparison: "Ear of corn", length_cm: "300", weight_g: "~600" },
    development: "VIABILITY THRESHOLD. Lungs starting surfactant production (critical for breathing). Eyelids opening for first time. Baby responsive to sounds and light through uterine wall (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Strong fetal movements", "Weight gain visible", "Swelling, leg cramps, back pain", "Sleep disturbances"],
    nutrition: {
      focus: "GDM screening; optimize for remainder of pregnancy",
      keyNutrients: [
        { name: "Carbohydrates (controlled)", dose: "300–320 g/day, low GI", icmrValue: "Part of 2200 kcal", foods: "Whole grains, oats, legumes, vegetables; minimize refined sugars", reason: "GDM screening Week 24–26 (75g OGTT); establish low-GI eating pattern (FOGSI 2023)" },
        { name: "DHA", dose: "200 mg/day", icmrValue: "200 mg/day", foods: "Fatty fish (2× weekly), DHA supplement, algae supplement", reason: "Fetal brain continued critical development; viability threshold nutrition critical (FOGSI 2023)" },
        { name: "Fiber", dose: "25–30 g/day", icmrValue: "Recommended addition", foods: "Whole grains, vegetables, legumes, fruits", reason: "Constipation management; glucose control (ACOG 2020)" }
      ],
      tip: "GDM screening this week or next (75 g OGTT, fasting). Come well-rested, hydrated. If 1 value elevated, no treatment unless confirmed GDM (FOGSI). Viability nearly complete — odds improve daily."
    },
    antenatalCare: "ANC Contact 3: Week 26 (may be done earlier). GDM screening OGTT 75 g at 24–28 weeks. BP, urine protein check. Hb screening. Discuss birth plan.",
    warningSignsThisWeek: ["Elevated glucose on OGTT (fasting ≥92, 1 hr ≥180, 2 hr ≥153 = GDM diagnosis)", "Sudden abdominal pain"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023; GDM_THRESHOLDS"
  },

  25: {
    week: 25,
    babySize: { comparison: "Papaya", length_cm: "310", weight_g: "~670" },
    development: "Eyes now respond to light. Footprints and fingerprints fully unique and permanent. Brain rapidly developing — critical period for neuronal migration and synapse formation (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Very strong fetal kicks", "Shortness of breath (uterus compressing lungs)", "Back pain prominent", "Sleep very difficult", "Mood variable"],
    nutrition: {
      focus: "Support rapid brain development; manage dyspnea",
      keyNutrients: [
        { name: "DHA (critical now)", dose: "200 mg/day (consider 300 mg)", icmrValue: "200 mg/day; FOGSI recommends up to 300 mg", foods: "Fatty fish 2× weekly, DHA supplement", reason: "Brain 60% DHA; Week 25–36 peak neuronal development period (FOGSI 2023)" },
        { name: "Iron", dose: "27 mg food + 60 mg supplement", icmrValue: "35 mg/day", foods: "IFA tablet daily (critical at this stage)", reason: "Prevent dyspnea from severe anemia; support oxygen delivery (FOGSI 2023)" },
        { name: "Small Frequent Meals", dose: "6 small meals vs 3 large", icmrValue: "Total 2200 kcal distributed", foods: "Smaller portions to reduce stomach compression", reason: "Shortness of breath from uterus pressing lungs; small meals easier to digest (ACOG 2020)" }
      ],
      tip: "Shortness of breath normal Week 25–36 (baby pushing lungs up). Multiple small meals help. Sleep propped up on left side. Do not restrict fluids — they help."
    },
    antenatalCare: null,
    warningSignsThisWeek: ["Severe shortness of breath at rest (chest pain) — may indicate PE or preeclampsia"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023; ACOG 2020"
  },

  26: {
    week: 26,
    babySize: { comparison: "Zucchini", length_cm: "320", weight_g: "~760" },
    development: "Eyes fully open. Brain growth explosive. Taste receptors functional (baby tastes amniotic fluid flavors). Survival rate if born now ~80% with NICU (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Very active baby", "Severe back/pelvic pain", "Swelling increasing", "Sleeping difficult", "Possible gestational diabetes symptoms if GDM"],
    nutrition: {
      focus: "GDM management if diagnosed; support fetal development",
      keyNutrients: [
        { name: "Protein", dose: "80–90 g/day if GDM", icmrValue: "78 g/day baseline (increase if GDM)", foods: "Lean meat, fish, eggs, Greek yogurt, legumes, paneer", reason: "If GDM diagnosed: higher protein, lower carbs helps glucose control (ADA 2023)" },
        { name: "Carbohydrates (low GI)", dose: "Adjust if GDM", icmrValue: "If GDM: ≤40% calories from carbs, low GI", foods: "Whole grains, legumes, non-starchy vegetables, limited fruit", reason: "GDM management: blood sugar control prevents complications (FOGSI 2023)" },
        { name: "Omega-3 (continued)", dose: "200 mg DHA/day", icmrValue: "200 mg/day", foods: "Fatty fish, algae DHA supplement", reason: "Fetal brain and eye development peak (FOGSI 2023)" }
      ],
      tip: "If GDM diagnosed (1 elevated OGTT value), consult diabetologist. Often managed with diet alone. Check blood sugar pattern. Continue excellent nutrition — GDM is manageable."
    },
    antenatalCare: "ANC Contact 3 (if not done Week 24): BP, urine protein, Hb screening. GDM results review. If GDM, referral to diabetic clinic.",
    warningSignsThisWeek: ["If GDM confirmed: blood glucose >180 mg/dL fasting or 2hr postprandial — contact diabetologist", "Severe headache + vision changes (preeclampsia screening)"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023; GDM_THRESHOLDS; ADA 2023"
  },

  27: {
    week: 27,
    babySize: { comparison: "Large turnip", length_cm: "335", weight_g: "~875" },
    development: "Eyes fully functional. Brain layer formation continues (cortical folding accelerating). Movements coordinated and purposeful. Baby responds to external stimuli (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Baby very active", "Severe fatigue returning", "Sleep severely disrupted", "Anxiety about birth approaching may increase"],
    nutrition: {
      focus: "Mental health support; optimize micronutrients",
      keyNutrients: [
        { name: "Omega-3 (DHA + EPA)", dose: "200 mg DHA + EPA", icmrValue: "DHA 200 mg/day", foods: "Fatty fish, fish oil supplement, algae supplement", reason: "Omega-3 supports maternal mental health and fetal brain (FOGSI 2023)" },
        { name: "Vitamin B Complex", dose: "B vitamins adequate", icmrValue: "IFA provides B12; ensure B6, B1, B2", foods: "Whole grains, eggs, milk, meat, legumes", reason: "Prevent antenatal depression and anxiety (common Week 27–28)" },
        { name: "Magnesium", dose: "350 mg/day", icmrValue: "350 mg/day", foods: "Pumpkin seeds, almonds, dark chocolate, leafy greens", reason: "Muscle relaxation; anxiety reduction (supports mental health)" }
      ],
      tip: "Third trimester anxiety common and normal. Sleep disruption frequent — try naps, relaxation techniques. Partner massage and prenatal yoga help. Fatigue is real; rest when possible."
    },
    antenatalCare: null,
    warningSignsThisWeek: ["Severe anxiety or depression — contact OB/GYN; mental health support available"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023; ACOG 2020"
  },

  28: {
    week: 28,
    babySize: { comparison: "Eggplant", length_cm: "350", weight_g: "~1000" },
    development: "THIRD TRIMESTER BEGINS. Brain development continues rapidly. Bones hardening. Baby typically turns head-down (vertex position) around this time. Brain contains billions of neurons (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Heavy baby", "Severe fatigue", "Sleep very difficult", "Swelling prominent", "May feel Braxton Hicks regularly"],
    nutrition: {
      focus: "Prepare for labor; prevent anemia",
      keyNutrients: [
        { name: "Iron (critical now)", dose: "27 mg food + 60 mg supplement", icmrValue: "35 mg/day (critical T3)", foods: "IFA tablet daily; spinach, dal, pomegranate, raisins, meat", reason: "Prevent severe anemia at delivery; support fetal well-being in T3 (FOGSI 2023)" },
        { name: "Protein", dose: "78 g/day", icmrValue: "78 g/day", foods: "Dhal, eggs, milk, paneer, meat, fish", reason: "Support fetal growth in T3 (~100 g/week still); prepare for labor (ICMR RDA 2020)" },
        { name: "Calcium + Magnesium", dose: "1000 mg Ca + 350 mg Mg", icmrValue: "1200 mg Ca, 350 mg Mg", foods: "Milk, paneer, sesame, almonds, leafy greens", reason: "Support muscle function; prevent leg cramps; prepare for labor contractions" }
      ],
      tip: "Sleep on left side to maximize blood flow to baby. Place pillow between knees for comfort. Kick count monitoring increases — should feel 10+ movements in 2 hours; report if reduced."
    },
    antenatalCare: "ANC Contact 4: Week 30. Fundal height measurement. Fetal lie (position check). BP, Hb, urine. Iron compliance check. Discuss any concerns.",
    warningSignsThisWeek: ["Reduced fetal movement (<10 movements in 2 hours) — contact hospital for kick count assessment", "Severe abdominal pain"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023; WHO ANC 2016"
  },

  29: {
    week: 29,
    babySize: { comparison: "Small butternut squash", length_cm: "365", weight_g: "~1150" },
    development: "Baby weighing ~1 kg. Bone marrow producing red blood cells. Toenails fully grown. Brain size increasing rapidly (20% of final size at birth) (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Very heavy baby", "Extreme fatigue", "Swelling worsening", "Back pain severe", "Possible Braxton Hicks painful"],
    nutrition: {
      focus: "Support rapid brain growth in final weeks",
      keyNutrients: [
        { name: "DHA (critical)", dose: "200 mg/day (up to 300 mg)", icmrValue: "200 mg/day; FOGSI up to 300 mg T3", foods: "Fatty fish 2× weekly, DHA supplement, algae supplement", reason: "Brain 20% of size at birth; Week 29–36 peak neuronal density period (FOGSI 2023)" },
        { name: "Protein", dose: "78 g/day", icmrValue: "78 g/day", foods: "Dhal (2 cups), milk (200 ml), eggs (1–2), paneer (100 g)", reason: "Rapid fetal brain growth requires amino acids (ICMR RDA 2020)" },
        { name: "Energy", dose: "2200 kcal/day", icmrValue: "2200 kcal/day", foods: "3 meals + 2 snacks, nutrient-dense", reason: "Support fetal growth at ~100–120 g/week in T3 (ICMR RDA 2020)" }
      ],
      tip: "Braxton Hicks may feel uncomfortable or regular now. If painful and regular (every 5–10 minutes), contact hospital to rule out preterm labor."
    },
    antenatalCare: null,
    warningSignsThisWeek: ["Regular painful contractions before Week 37 — may indicate preterm labor", "Gush of fluid or bleeding"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023"
  },

  30: {
    week: 30,
    babySize: { comparison: "Zucchini", length_cm: "380", weight_g: "~1300" },
    development: "Bone marrow producing red blood cells independently. Baby gaining ~200 g/week from this point. Lanugo (fine hair) beginning to disappear. Brain very active (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Extreme discomfort", "Swelling severe", "Back pain intense", "Frequent urination and defecation", "Sleep very poor"],
    nutrition: {
      focus: "Maximize nutrition in final 10 weeks; manage discomforts",
      keyNutrients: [
        { name: "Protein (high quality)", dose: "78 g/day", icmrValue: "78 g/day", foods: "Eggs (1–2), milk (200 ml), paneer (100 g), dhal (2 servings), chicken (75 g)", reason: "Support fetal rapid growth (~200 g/week); prepare for labor demands (ICMR RDA 2020)" },
        { name: "Iron + Vitamin C", dose: "27 mg food + 60 mg IFA + 60 mg Vit C", icmrValue: "35 mg Fe, 60 mg Vit C/day", foods: "IFA tablet + citrus at each meal", reason: "Critical in final weeks; severe anemia at delivery life-threatening (FOGSI 2023)" },
        { name: "Calcium (final push)", dose: "1000 mg/day", icmrValue: "1200 mg/day", foods: "Milk (2 cups), paneer (100 g), sesame (30 g), leafy greens", reason: "Fetal skeleton completing mineralization in final 10 weeks (ICMR RDA 2020)" }
      ],
      tip: "Final 10 weeks critical for fetal development. Ensure excellent nutrition. Discomfort is normal — nearing the finish line. Pelvic floor exercises help with delivery preparation."
    },
    antenatalCare: "ANC Contact 4: Week 30. Fundal height. Fetal lie/presentation. BP, Hb recheck. Birth plan discussion. Iron compliance.",
    warningSignsThisWeek: ["Severe headache with vision changes (preeclampsia screening critical)", "Heavy vaginal bleeding"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023; WHO ANC 2016"
  },

  31: {
    week: 31,
    babySize: { comparison: "Small pumpkin", length_cm: "395", weight_g: "~1500" },
    development: "Baby gaining ~200 g/week. Reflexes sharpening. Brain connections forming rapidly. Toenails and fingernails fully grown (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Extreme discomfort from size", "Difficulty moving", "Swelling worsening", "Shortness of breath severe", "Heartburn intense"],
    nutrition: {
      focus: "Maintain high protein and iron through final 9 weeks",
      keyNutrients: [
        { name: "Protein", dose: "78 g/day", icmrValue: "78 g/day", foods: "High-quality sources: eggs, milk, paneer, dhal, fish, chicken", reason: "Fetal growth ~200 g/week; maternal reserves for labor (ICMR RDA 2020)" },
        { name: "Iron (check Hb)", dose: "27 mg food + 60 mg IFA", icmrValue: "35 mg/day", foods: "IFA mandatory daily; spinach, dal, pomegranate", reason: "Hb check important now; prepare for blood loss at delivery (FOGSI 2023)" },
        { name: "DHA (final weeks critical)", dose: "200 mg/day", icmrValue: "200 mg/day", foods: "Fatty fish, DHA supplement, algae", reason: "Brain development completing; neurotransmitter formation (FOGSI 2023)" }
      ],
      tip: "Final 9 weeks make huge difference to baby's outcomes. Excellent nutrition now directly improves fetal brain, lungs, immune system. Do not skip meals or supplements."
    },
    antenatalCare: null,
    warningSignsThisWeek: ["Severe headache + vision changes + swelling (preeclampsia red flags)", "Heavy bleeding"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023"
  },

  32: {
    week: 32,
    babySize: { comparison: "Squash (small)", length_cm: "410", weight_g: "~1700" },
    development: "Baby practicing breathing movements (visible on USS). Nails fully grown. Lanugo mostly gone. Central nervous system nearly mature. Pupillary light reflex present (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Extreme discomfort", "Shortness of breath", "Sleeping almost impossible", "May feel baby has shifted lower (lightening)"],
    nutrition: {
      focus: "Final 8 weeks: optimize all nutrients",
      keyNutrients: [
        { name: "Protein", dose: "78 g/day", icmrValue: "78 g/day", foods: "Eggs (1–2), milk (200 ml), paneer (100 g), dhal (2 servings), fish/chicken (75 g)", reason: "Rapid fetal growth continues; maternal preparation for delivery (ICMR RDA 2020)" },
        { name: "DHA + Iron (both critical)", dose: "200 mg DHA + 27 mg Fe (food) + 60 mg (IFA)", icmrValue: "As per RDA", foods: "Fatty fish 2×/week, IFA daily, citrus for absorption", reason: "Brain maturation; prevent maternal anemia at delivery (FOGSI 2023)" },
        { name: "Calcium (final mineralization)", dose: "1000 mg/day", icmrValue: "1200 mg/day", foods: "Milk, paneer, sesame, leafy greens", reason: "Fetal skeleton completing final mineralization (ICMR RDA 2020)" }
      ],
      tip: "If baby hasn't dropped yet, may happen Week 32–36. This relieves lung pressure (breathing easier) but increases pelvic pressure. Lightening is good sign of labor preparation."
    },
    antenatalCare: "ANC Contact 5: Week 34. Growth USS if indicated. GBS (Group B Strep) screening typically Week 35–37. Birth preparedness counselling.",
    warningSignsThisWeek: ["Baby not moving as much (reduced from baseline) — monitor carefully", "Sudden severe pain"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023; WHO ANC 2016"
  },

  33: {
    week: 33,
    babySize: { comparison: "Pineapple", length_cm: "425", weight_g: "~1900" },
    development: "Baby gaining ~200 g/week. Skeleton fully hardened but skull bones unfused (to allow passage through birth canal). Lungs nearly ready (surfactant production peak) (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Extreme discomfort", "Sleeping severely disrupted", "Possible baby-low position relief", "Braxton Hicks may be stronger"],
    nutrition: {
      focus: "Final 7 weeks: sustain excellent nutrition",
      keyNutrients: [
        { name: "Protein + Calories", dose: "78 g protein, 2200 kcal", icmrValue: "ICMR RDA targets", foods: "3 meals + 2 snacks of nutrient-dense foods", reason: "Support fetal final development and maternal reserves (ICMR RDA 2020)" },
        { name: "Iron (critical check now)", dose: "27 mg food + 60 mg IFA", icmrValue: "35 mg/day", foods: "IFA mandatory; dark leafy greens, dal, meat", reason: "Prepare for blood loss at delivery (2–3 liters normal); prevent severe anemia (FOGSI 2023)" },
        { name: "Calcium + DHA", dose: "1000 mg Ca + 200 mg DHA", icmrValue: "As RDA", foods: "Dairy, sesame, fatty fish, algae supplement", reason: "Final bone mineralization; brain completion (ICMR RDA 2020; FOGSI 2023)" }
      ],
      tip: "Baby skeleton fully hardened now. Brain 80% of final size. Excellent nutrition in these final weeks has documented impact on baby's long-term health outcomes."
    },
    antenatalCare: null,
    warningSignsThisWeek: ["Vaginal bleeding >1 pad/hour", "Severe abdominal pain"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023"
  },

  34: {
    week: 34,
    babySize: { comparison: "Cantaloupe", length_cm: "440", weight_g: "~2100" },
    development: "Baby is 2.1 kg, gaining ~200 g/week. Most organs fully mature. Lungs almost ready. Pupillary reflexes functional. Brain rapid development continues (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Still very uncomfortable", "Swelling at maximum", "Braxton Hicks strong", "Preparing mentally for labor"],
    nutrition: {
      focus: "Sustain nutrition; prepare for labor",
      keyNutrients: [
        { name: "Protein (labor prep)", dose: "78 g/day", icmrValue: "78 g/day", foods: "Dhal, eggs, milk, paneer, meat, fish", reason: "Support fetal rapid growth; maternal reserve for labor (ICMR RDA 2020)" },
        { name: "Iron (final weeks critical)", dose: "27 mg food + 60 mg IFA", icmrValue: "35 mg/day", foods: "IFA daily; spinach, pomegranate, raisins, meat", reason: "Severe anemia (Hb <7) at delivery requires transfusion; prevent now (FOGSI 2023)" },
        { name: "Carbohydrates", dose: "300–320 g/day", icmrValue: "Part of 2200 kcal", foods: "Whole grains, fruits, vegetables", reason: "Energy stores for labor (carbohydrates are preferred fuel during contractions)" }
      ],
      tip: "Final 6 weeks! Baby considered late preterm now (survival >95% if born). Continue all supplements. Pelvic floor exercises, walking, and gentle yoga prepare for labor."
    },
    antenatalCare: "ANC Contact 5: Week 34. Growth USS if indicated. GBS screening (Week 35–37). Birth plan finalized. Signs of labour education.",
    warningSignsThisWeek: ["Persistent severe headache (preeclampsia)", "Heavy vaginal bleeding"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023; WHO ANC 2016"
  },

  35: {
    week: 35,
    babySize: { comparison: "Cantaloupe (large)", length_cm: "455", weight_g: "~2300" },
    development: "Lungs producing surfactant actively. Central nervous system mature. Immune system improved (maternal antibodies crossing placenta). Baby ready for birth from Week 37 (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Extreme physical discomfort", "Anxiety about labor increasing", "May experience Braxton Hicks regularly (painful)"],
    nutrition: {
      focus: "Final push: complete nutrition support",
      keyNutrients: [
        { name: "Protein", dose: "78 g/day", icmrValue: "78 g/day", foods: "Eggs, milk, paneer, dhal, meat, fish", reason: "Support fetal development to term; maternal strength for labor (ICMR RDA 2020)" },
        { name: "Iron (last critical weeks)", dose: "27 mg food + 60 mg IFA", icmrValue: "35 mg/day", foods: "IFA mandatory until 6 months postpartum", reason: "Prepare for blood loss; prevent life-threatening anemia at delivery (FOGSI 2023)" },
        { name: "Energy (maintain)", dose: "2200 kcal/day", icmrValue: "2200 kcal/day", foods: "3 meals + 2 snacks daily", reason: "Support baby's final growth and maternal energy reserves (ICMR RDA 2020)" }
      ],
      tip: "Final 5 weeks! Labor can start anytime after Week 37 (term). Ensure hospital bag packed. Know labor signs. Continue all supplements. GBS status typically known by now."
    },
    antenatalCare: "GBS screening (Group B Strep) — Week 35–37 if not done. Results guide labor management.",
    warningSignsThisWeek: ["Preterm labor signs: regular painful contractions before Week 37", "Heavy bleeding or gush of fluid"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023"
  },

  36: {
    week: 36,
    babySize: { comparison: "Papaya (large)", length_cm: "470", weight_g: "~2600" },
    development: "Fetal organs mature. Considered late preterm (excellent survival >99% if born now). Brain development slowing (most neurons formed). Baby moving lower into pelvis (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Extreme discomfort from size", "Frequent urination (baby on bladder)", "May have strong nesting urge", "Anxiety about labor", "Braxton Hicks very frequent"],
    nutrition: {
      focus: "Final 4 weeks: complete pregnancy nutrition",
      keyNutrients: [
        { name: "Protein", dose: "78 g/day", icmrValue: "78 g/day", foods: "Complete protein sources: eggs, milk, paneer, legumes, meat", reason: "Final fetal growth; maternal muscle preparation for labor (ICMR RDA 2020)" },
        { name: "Iron (absolutely critical)", dose: "27 mg food + 60 mg IFA", icmrValue: "35 mg/day", foods: "IFA daily (continue 6 months postpartum per protocol)", reason: "Severe anemia at delivery (<7 g/dL) can be life-threatening; prevent now (FOGSI 2023)" },
        { name: "Fluids (essential)", dose: "8–10 glasses/day", icmrValue: "Ad libitum", foods: "Water, coconut water, herbal teas, milk", reason: "Support placental function; hydration for labor (critical in final weeks)" }
      ],
      tip: "Final 4 weeks. Fetal position should be head-down by now (vertex). If breech, discuss options with OB. Hospital bag should be ready. Know when to go to hospital."
    },
    antenatalCare: "ANC Contact 6: Week 36. Fetal presentation (head-down or breech). Birth plan finalized. Signs of labour education. Hospital bag readiness discussion.",
    warningSignsThisWeek: ["Breech presentation identified (discuss options)", "Preeclampsia signs: BP ≥140/90, severe headache, vision changes, swelling"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023; WHO ANC 2016"
  },

  37: {
    week: 37,
    babySize: { comparison: "Winter melon", length_cm: "485", weight_g: "~2800" },
    development: "FULL TERM THRESHOLD (Week 37+). Baby ready for labor. Brain and lungs fully mature. All systems ready. Baby moving lower (engagement) (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Extreme physical discomfort", "Frequent Braxton Hicks", "Cervical changes beginning (softening, effacement, dilation)", "Nesting urge strong", "Anxiety mixed with excitement"],
    nutrition: {
      focus: "Final 3 weeks: optimize for labor",
      keyNutrients: [
        { name: "Protein", dose: "78 g/day", icmrValue: "78 g/day", foods: "Eggs, milk, paneer, dhal, fish, chicken", reason: "Support maternal strength and stamina for labor (ICMR RDA 2020)" },
        { name: "Iron (non-negotiable)", dose: "27 mg food + 60 mg IFA", icmrValue: "35 mg/day", foods: "IFA tablet daily (continue 6 months postpartum)", reason: "Prevent blood loss complications at delivery (FOGSI 2023)" },
        { name: "Carbohydrates (labor energy)", dose: "300–320 g/day", icmrValue: "Part of 2200 kcal", foods: "Whole grains, fruits, honey (quick energy for labor)", reason: "Primary fuel for muscle contractions during labor (5–20 hours typical)" }
      ],
      tip: "TERM! Baby can be born any day now and be healthy. Cervix changes beginning (Braxton Hicks feel different as they approach). Know labor signs: regular contractions 5–1–1 rule, bloody show, water breaking."
    },
    antenatalCare: "ANC Contact 7: Week 38. BP, fetal movement, presentation check. Hospital bag confirmed ready. Know when to go to hospital (contractions 5 min apart × 1 hour, bleeding, water breaking).",
    warningSignsThisWeek: ["Signs of labour: contractions 5 min apart for 1 hour", "Bloody show or water breaking", "Severe pain or heavy bleeding"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023; WHO ANC 2016"
  },

  38: {
    week: 38,
    babySize: { comparison: "Large winter melon", length_cm: "495", weight_g: "~3000" },
    development: "Full term. Brain 90% of final size. All organ systems ready. Maternal antibodies transferred to baby (immunity for first months). Ready for labour (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Extreme discomfort", "Braxton Hicks very frequent (may be labor)", "Cervical changes accelerating", "Loss of mucus plug possible", "Bloody show possible"],
    nutrition: {
      focus: "Final 2 weeks: prepare for imminent labor",
      keyNutrients: [
        { name: "Protein (strength)", dose: "78 g/day", icmrValue: "78 g/day", foods: "Eggs, milk, paneer, dhal, fish, chicken", reason: "Support maternal endurance for labor (hours of contractions require strength)" },
        { name: "Iron (final check)", dose: "27 mg food + 60 mg IFA", icmrValue: "35 mg/day", foods: "IFA daily (continue 6 months postpartum per Indian national protocol)", reason: "Final preparation for blood loss at delivery (average 2–3 liters) (FOGSI 2023)" },
        { name: "Calcium + Magnesium (muscle function)", dose: "1000 mg Ca + 350 mg Mg", icmrValue: "1200 mg Ca, 350 mg Mg", foods: "Dairy, sesame, almonds, leafy greens", reason: "Support uterine muscle contractions and maternal stamina (ICMR RDA 2020)" }
      ],
      tip: "Final 2 weeks! Labor very likely now. Braxton Hicks feel very strong but typically stop if you move. Real labor: contractions continue and increase. Know the signs and trust your body."
    },
    antenatalCare: "ANC Contact 7 (if not done Week 37): BP, fetal movement, presentation. Hospital bag ready. Labour signs education. Know when to go to hospital.",
    warningSignsThisWeek: ["True labour: contractions 5 min apart for 1 hour, bloody show, or water breaking", "Heavy vaginal bleeding (>1 pad/hour) — go to hospital"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023; WHO ANC 2016"
  },

  39: {
    week: 39,
    babySize: { comparison: "Small pumpkin", length_cm: "505", weight_g: "~3200" },
    development: "Baby fully ready for labor. Brain ~95% final size. All systems ready. Vernix caseosa still protective. Lanugo almost completely gone. Newborn reflexes established (Moore & Persaud 10th Ed).",
    motherSymptoms: ["Extreme discomfort", "Cervical changes accelerating", "Labor likely very soon", "Possible bloody show or mucus plug loss", "Final surge of energy (nesting)"],
    nutrition: {
      focus: "Final week before labor",
      keyNutrients: [
        { name: "Protein", dose: "78 g/day", icmrValue: "78 g/day", foods: "Eggs, milk, paneer, dhal, fish, chicken", reason: "Final maternal strength preparation for labor (ICMR RDA 2020)" },
        { name: "Iron (absolutely final)", dose: "27 mg food + 60 mg IFA", icmrValue: "35 mg/day", foods: "IFA tablet daily (continue 6 months postpartum per protocol)", reason: "Final prevention of severe anemia at delivery (FOGSI 2023)" },
        { name: "Carbohydrates (energy)", dose: "300–320 g/day", icmrValue: "Part of 2200 kcal", foods: "Whole grains, fruits, honey for quick energy", reason: "Labor requires 5–20 hours; carbohydrates are primary fuel (ACOG 2020)" }
      ],
      tip: "Week 39! Due date very near (Week 40 = 280 days from last period). Labor can start any moment. Contractions 5 min apart for 1 hour = go to hospital. Trust your instincts."
    },
    antenatalCare: "ANC Contact 8: Week 40 (may be this week if labor imminent). Monitor if post-dates management needed.",
    warningSignsThisWeek: ["True labour: regular painful contractions, bloody show, or water breaking", "Heavy vaginal bleeding"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023"
  },

  40: {
    week: 40,
    babySize: { comparison: "Watermelon", length_cm: "510", weight_g: "~3400" },
    development: "DUE DATE. Baby fully ready for birth. Brain 100% of final size. Skull bones unfused to allow passage through birth canal. Ready. Labour can begin anytime (Moore & Persaud 10th Ed).",
    motherSymptoms: ["May be in early labor", "Contractions may be beginning", "Cervix dilating", "Mucus plug likely lost", "Bloody show likely"],
    nutrition: {
      focus: "READY FOR LABOR",
      keyNutrients: [
        { name: "Protein (last meal before labor)", dose: "20–25 g at last meal", icmrValue: "Support for labor", foods: "Eggs, milk, paneer, dhal, fish, chicken", reason: "Adequate calories/protein for labor endurance (ACOG 2020)" },
        { name: "Iron (protect from blood loss)", dose: "Take IFA tonight", icmrValue: "35 mg/day (take final dose before labor)", foods: "IFA tablet", reason: "Final protection against severe anemia at delivery (FOGSI 2023)" },
        { name: "Hydration", dose: "Drink plenty", icmrValue: "Ad libitum", foods: "Water, coconut water, electrolyte solutions", reason: "Hydration critical for labor stamina and placental perfusion (ACOG 2020)" }
      ],
      tip: "DUE DATE! Baby is ready. Labour may start today or within next 2 weeks (post-dates management Week 42). You have completed pregnancy nutrition beautifully. Your body is prepared. Trust yourself. Time to meet your baby!"
    },
    antenatalCare: "ANC Contact 8: Week 40. NST (fetal heart rate monitoring) if indicated. Post-dates management plan if no labour by Week 42. Discuss induction options if needed.",
    warningSignsThisWeek: ["Labour beginning: regular contractions 5 min apart for 1 hour, bloody show, or water breaking — GO TO HOSPITAL NOW", "Heavy bleeding (>1 pad/hour)", "No fetal movement (>12 hours) — contact hospital immediately"],
    source: "Moore & Persaud 10th Ed; ICMR RDA 2020; FOGSI 2023; WHO ANC 2016"
  }
};

// ── EXPORT FUNCTIONS ──────────────────────────────────────────────────────
export const getPregnancyInfo = (week: number): FetalWeek => {
  const weekNum = Math.max(1, Math.min(40, Math.round(week)));
  return PREGNANCY_DATA[weekNum] || PREGNANCY_DATA[1];
};

export const getWarningSignsForWeek = (week: number): string[] => {
  const weekNum = Math.max(1, Math.min(40, Math.round(week)));
  const data = PREGNANCY_DATA[weekNum];
  return data ? data.warningSignsThisWeek : [];
};

export interface ANCContact {
  contact: number;
  timing: string;
  key: string;
}
export interface ANCSchedule {
  source: string;
  minimumContacts: number;
  schedule: ANCContact[];
}

export const getANCSchedule = (): ANCSchedule => {
  return {
    source: "WHO Recommendations on Antenatal Care for a Positive Pregnancy Experience, 2016",
    minimumContacts: 8,
    schedule: [
      { contact: 1, timing: "< 12 weeks", key: "First ANC. Blood group, Hb, urine, syphilis, HIV, USS dating scan. Start IFA supplements." },
      { contact: 2, timing: "20 weeks",   key: "Anomaly USS (Level II). Assess fetal growth. Check BP. Anaemia screening." },
      { contact: 3, timing: "26 weeks",   key: "BP, urine protein, Hb. GDM screening (75g OGTT). Discuss birth plan." },
      { contact: 4, timing: "30 weeks",   key: "Fundal height, fetal lie, BP. Repeat Hb. Iron compliance check." },
      { contact: 5, timing: "34 weeks",   key: "Growth USS if indicated. GBS screen. Birth preparedness counselling." },
      { contact: 6, timing: "36 weeks",   key: "Fetal presentation. Birth plan finalised. Signs of labour education." },
      { contact: 7, timing: "38 weeks",   key: "BP, fetal movement, presentation. Hospital bag ready." },
      { contact: 8, timing: "40 weeks",   key: "Post-dates management plan. NST / BPP if indicated." },
    ]
  };
};

// ── OFFLINE REMEDIES (multilingual Q&A — works offline) ──────────────────
export interface RemedyQA { q: string; a: string }
export const REMEDIES: Record<string, RemedyQA[]> = {
  en: [
    { q: "Period cramps", a: "Apply warm compress on lower abdomen. Ginger tea with honey helps. Light walking reduces cramps." },
    { q: "Nausea in pregnancy", a: "Eat small meals every 2 hours. Ginger biscuits or plain toast first thing morning. Cold water sips." },
    { q: "Iron deficiency", a: "Eat spinach, beetroot, pomegranate, jaggery. Always pair with Vitamin C (lemon juice) for better absorption." },
    { q: "Missed period (stress)", a: "Stress is a common cause. Practice deep breathing. Ashwagandha tea may help. If 2 weeks late, take a test." },
    { q: "Backache in pregnancy", a: "Sit straight, sleep with pillow between knees. Warm mustard oil massage. Avoid standing too long." },
    { q: "Calcium deficiency", a: "Milk, curd, sesame seeds (til), ragi, broccoli. Sunlight for Vitamin D helps calcium absorb." },
    { q: "Fatigue", a: "Iron deficiency is common. Include dates, raisins, green leafy vegetables daily. Rest when needed." },
  ],
  hi: [
    { q: "पीरियड दर्द", a: "पेट के निचले हिस्से पर गर्म सिकाई करें। अदरक-शहद की चाय पिएं। हल्की चहलकदमी से दर्द कम होता है।" },
    { q: "गर्भावस्था में मतली", a: "हर 2 घंटे में थोड़ा खाएं। सुबह उठते ही अदरक बिस्किट खाएं। ठंडे पानी के घूंट लें।" },
    { q: "आयरन की कमी", a: "पालक, चुकंदर, अनार, गुड़ खाएं। विटामिन C के साथ लेने से बेहतर अवशोषण होता है।" },
    { q: "पीरियड मिस (तनाव से)", a: "तनाव एक सामान्य कारण है। गहरी सांस लें। अश्वगंधा चाय मदद कर सकती है।" },
    { q: "गर्भावस्था में कमर दर्द", a: "सीधे बैठें, घुटनों के बीच तकिया रखकर सोएं। गर्म सरसों तेल से मालिश करें।" },
  ],
  gu: [
    { q: "માસિક દુખાવો", a: "પેટ પર ગરમ શેક કરો. આદુ-મધની ચા પીઓ. હળવી ચાલ ફ઼ાાયદો કરે છે." },
    { q: "ઉબકા", a: "દર 2 કલાકે થોડું ખાઓ. સવારે આદુ બિસ્કિટ ખાઓ. ઠંડા પાણીના ઘૂંટ લો." },
    { q: "લોહ ની ઉણપ", a: "પાલક, બીટ, દાળ, ગોળ ખાઓ. વિટામિન C સાથે લો." },
  ]
};
