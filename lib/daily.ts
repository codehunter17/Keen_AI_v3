// Deterministic daily content rotation.
//
// Every page that wants to feel "alive" picks from a curated content pool
// using today's date as a seed. So on 2026-05-14 everyone sees entry N;
// on 2026-05-15 everyone sees entry N+1. This is:
//   - Cacheable (same output for a 24h window — friendly to Vercel ISR)
//   - Deterministic (no client/server hydration mismatch)
//   - Honest (content is real, just rotated — no fake personalisation)
//
// Use it for:
//   - Homepage hero callouts (AI tip + report finding examples)
//   - Dashboard "today's tip" rotators
//   - Daily nutrition focus on the chat starter
//
// Do NOT use it for anything user-specific (personalised plans, real logs).
// That's a different code path that hits the DB.

const MS_PER_DAY = 86400_000;

/**
 * Days since the Unix epoch in UTC. Stable across server and client because
 * it does not depend on local timezone — we treat the calendar as UTC.
 */
export function dayIndex(date: Date = new Date()): number {
  return Math.floor(date.getTime() / MS_PER_DAY);
}

/**
 * Pick a deterministic item from a list using today's date.
 * Optional `offset` lets you pick a *different* item for a different slot
 * on the same day (e.g. tip A and tip B side-by-side, both rotating daily
 * but never identical).
 */
export function pickDaily<T>(pool: readonly T[], offset = 0): T {
  if (pool.length === 0) {
    throw new Error("pickDaily: empty pool");
  }
  const idx = (dayIndex() + offset) % pool.length;
  return pool[idx];
}

/**
 * Same as pickDaily but seeded by a string (e.g. user ID). The same string
 * gets the same rotation across reloads, but two users see different items.
 */
export function pickDailyForKey<T>(pool: readonly T[], key: string): T {
  if (pool.length === 0) {
    throw new Error("pickDailyForKey: empty pool");
  }
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(dayIndex() + hash) % pool.length;
  return pool[idx];
}

// ─────────────────────────────────────────────────────────────────────
// Content pools
// ─────────────────────────────────────────────────────────────────────

// Hero "AI today" callouts. Each entry has English + Hindi.
// Keep these grounded in ICMR-NIN 2020 nutrient guidance + Indian kitchen
// staples. Rotates one per day so the homepage isn't frozen content.
export const HERO_AI_TIPS: { en: string; hi: string }[] = [
  {
    en: "You need 36 mg iron today — methi + chana + gur.",
    hi: "आज 36 mg लोहा चाहिए — मेथी + चना + गुड़।",
  },
  {
    en: "Calcium target: 1000 mg. Try ragi roti + curd at lunch.",
    hi: "कैल्शियम 1000 mg चाहिए — दोपहर में रागी रोटी + दही।",
  },
  {
    en: "Folate-rich day: spinach dal + boiled egg covers 60%.",
    hi: "फोलेट दिन: पालक दाल + उबला अंडा 60% पूरा करता है।",
  },
  {
    en: "Vitamin D low in winter — 20 min sun + fortified milk.",
    hi: "सर्दी में विटामिन D कम — 20 मिनट धूप + फोर्टिफाइड दूध।",
  },
  {
    en: "Hydration first: 2.5 L water, add lemon + saunf seeds.",
    hi: "पानी सबसे पहले: 2.5 लीटर, नींबू + सौंफ डालें।",
  },
  {
    en: "Magnesium for cramps: bajra khichdi + til ki chutney.",
    hi: "ऐंठन के लिए मैग्नीशियम: बाजरा खिचड़ी + तिल चटनी।",
  },
  {
    en: "Protein gap? Moong sprouts + paneer = 22 g in one meal.",
    hi: "प्रोटीन कम? मूंग अंकुरित + पनीर = एक मील में 22 ग्राम।",
  },
  {
    en: "Zinc + iron combo today: pumpkin seeds + jaggery laddoo.",
    hi: "जिंक + आयरन: कद्दू के बीज + गुड़ का लड्डू।",
  },
  {
    en: "Fibre target 30 g: oats + ghee + banana at breakfast.",
    hi: "फाइबर 30 ग्राम: नाश्ते में जई + घी + केला।",
  },
  {
    en: "B12 reminder — curd + milk + idli batter (fermented).",
    hi: "B12 याद रहे — दही + दूध + इडली बैटर (खमीर वाला)।",
  },
];

// Hero "Report finding" examples. These are *example* findings, marked as
// such — we never claim they're the visitor's real data.
export const HERO_REPORT_FINDINGS: {
  label: { en: string; hi: string };
  value: string;
  note: { en: string; hi: string };
}[] = [
  {
    label: { en: "Hb 9.8 g/dL", hi: "Hb 9.8 g/dL" },
    value: "Hb 9.8 g/dL",
    note: { en: "Mild anaemia — flagged", hi: "हल्की एनीमिया" },
  },
  {
    label: { en: "TSH 4.6 mIU/L", hi: "TSH 4.6 mIU/L" },
    value: "TSH 4.6 mIU/L",
    note: { en: "Borderline — recheck", hi: "सीमा रेखा — दोबारा जांच" },
  },
  {
    label: { en: "Vit D 18 ng/mL", hi: "Vit D 18 ng/mL" },
    value: "Vit D 18 ng/mL",
    note: { en: "Deficient — supplement", hi: "कमी — पूरक लें" },
  },
  {
    label: { en: "B12 210 pg/mL", hi: "B12 210 pg/mL" },
    value: "B12 210 pg/mL",
    note: { en: "Low — eat fermented", hi: "कम — खमीर वाला खाएं" },
  },
  {
    label: { en: "Fasting glucose 108", hi: "Fasting glucose 108" },
    value: "FBS 108 mg/dL",
    note: { en: "Pre-diabetic range", hi: "प्री-डायबिटिक" },
  },
  {
    label: { en: "Ferritin 14 ng/mL", hi: "Ferritin 14 ng/mL" },
    value: "Ferritin 14 ng/mL",
    note: { en: "Iron stores low", hi: "आयरन स्टोर कम" },
  },
  {
    label: { en: "HDL 38 mg/dL", hi: "HDL 38 mg/dL" },
    value: "HDL 38 mg/dL",
    note: { en: "Below target — walk daily", hi: "लक्ष्य से कम" },
  },
];

// Dashboard "Today's Tip" pool — short, life-stage-agnostic micro-tips
// that show as a small card on the dashboard. One per day, sliced by life
// stage so a pregnancy user doesn't see a menopause tip.

type Tip = { en: string; hi: string };

export const DAILY_TIPS_GENERIC: Tip[] = [
  { en: "Drink one extra glass of water before each meal.", hi: "हर भोजन से पहले एक अतिरिक्त गिलास पानी पिएं।" },
  { en: "Walk 10 minutes after dinner — better sleep, lower sugar.", hi: "रात के खाने के बाद 10 मिनट टहलें।" },
  { en: "Add one fistful of greens to dal or sabzi today.", hi: "आज दाल या सब्ज़ी में एक मुट्ठी हरी सब्ज़ी डालें।" },
  { en: "Replace one sugary drink with nimbu pani.", hi: "एक मीठा पेय हटाकर नींबू पानी पिएं।" },
  { en: "Sleep 30 minutes earlier — your hormones thank you.", hi: "30 मिनट जल्दी सोएं।" },
  { en: "Sit in sunlight for 15 min — free vitamin D.", hi: "15 मिनट धूप में बैठें — मुफ्त विटामिन D।" },
  { en: "Soak chana overnight — better iron absorption.", hi: "रात भर चना भिगोएं — आयरन बेहतर मिलेगा।" },
];

export const DAILY_TIPS_PREGNANT: Tip[] = [
  { en: "Folic acid 400 mcg today — beetroot + spinach helps.", hi: "आज फोलिक एसिड 400 mcg — चुकंदर + पालक।" },
  { en: "Iron at lunch + vitamin C (nimbu) doubles absorption.", hi: "दोपहर में आयरन + नींबू = दोगुना अवशोषण।" },
  { en: "Small frequent meals beat morning sickness.", hi: "थोड़ा-थोड़ा खाएं — सुबह की मतली कम।" },
  { en: "Avoid raw papaya and untested street water.", hi: "कच्चा पपीता और बिना जांचा पानी न लें।" },
  { en: "Kegels for 5 minutes — pelvic floor matters.", hi: "5 मिनट केगल व्यायाम।" },
];

export const DAILY_TIPS_MENOPAUSE: Tip[] = [
  { en: "Calcium 1200 mg today — ragi + curd + til.", hi: "आज कैल्शियम 1200 mg — रागी + दही + तिल।" },
  { en: "Weight-bearing walk 20 min — bones love it.", hi: "20 मिनट तेज़ चलें — हड्डियों के लिए।" },
  { en: "Soy + flax help with hot flashes — try linseed roti.", hi: "अलसी + सोया गर्म तरंगों में मदद करते हैं।" },
  { en: "Hydrate before bed — fewer night sweats.", hi: "सोने से पहले पानी — रात का पसीना कम।" },
];

export const DAILY_TIPS_CYCLE: Tip[] = [
  { en: "Track flow heaviness today — patterns matter.", hi: "आज प्रवाह की भारीता ट्रैक करें।" },
  { en: "Heat pad + ginger tea for cramps.", hi: "ऐंठन के लिए गर्म पैड + अदरक चाय।" },
  { en: "Iron-rich lunch on day 1-3 of your period.", hi: "मासिक के पहले 3 दिन आयरन वाला दोपहर का भोजन।" },
  { en: "Magnesium-rich snacks help PMS mood swings.", hi: "PMS मूड स्विंग्स के लिए मैग्नीशियम।" },
];

/**
 * Pick a daily tip relevant to the user's life stage. Falls back to the
 * generic pool when life stage isn't known yet (new user / onboarding).
 */
export function pickDailyTip(lifeStage?: string | null): Tip {
  switch (lifeStage) {
    case "PREGNANT":
      return pickDaily(DAILY_TIPS_PREGNANT);
    case "MENOPAUSE":
    case "PERIMENOPAUSE":
      return pickDaily(DAILY_TIPS_MENOPAUSE);
    case "ADULT_MENSTRUATING":
    case "TRYING_TO_CONCEIVE":
      return pickDaily(DAILY_TIPS_CYCLE);
    default:
      return pickDaily(DAILY_TIPS_GENERIC);
  }
}

// ─────────────────────────────────────────────────────────────────────
// Nutrition "focus nutrient of the day" — shown on /dashboard/nutrition.
// Each entry is the nutrient + an Indian-kitchen source list so users
// can act on it without leaving home.
// ─────────────────────────────────────────────────────────────────────
export interface NutrientFocus {
  nutrient: string;
  target: string;          // e.g. "1000 mg" — short label
  sources: string;         // comma-separated Indian foods
  why: string;             // one-line "why care today"
}

export const DAILY_NUTRIENT_FOCUS: NutrientFocus[] = [
  {
    nutrient: "Iron",
    target: "27 mg",
    sources: "Methi, palak, chana, gur, ragi, anaar",
    why: "Most Indian women run low — energy + period flow depend on it.",
  },
  {
    nutrient: "Calcium",
    target: "1000 mg",
    sources: "Curd, ragi, til, dudhi, paneer, sahjan leaves",
    why: "Bone strength + cramp relief — peaks in your 30s, then declines.",
  },
  {
    nutrient: "Folate",
    target: "400 mcg",
    sources: "Palak, beetroot, masoor dal, mungphali, oranges",
    why: "Critical before and during pregnancy. Useful for everyone — DNA repair.",
  },
  {
    nutrient: "Vitamin D",
    target: "600 IU",
    sources: "20 min sun, fortified milk, mushrooms, egg yolk",
    why: "1 in 2 Indian women are deficient. Mood + bones + immunity.",
  },
  {
    nutrient: "Magnesium",
    target: "310 mg",
    sources: "Bajra, til chutney, kaju, halim seeds, dark chocolate",
    why: "Cramp relief + better sleep + glucose control.",
  },
  {
    nutrient: "Vitamin B12",
    target: "2.4 mcg",
    sources: "Curd, paneer, idli/dosa batter (fermented), eggs, milk",
    why: "Vegetarians often run low — affects energy + nerve health.",
  },
  {
    nutrient: "Omega-3",
    target: "1.1 g",
    sources: "Alsi (flaxseed), akhrot, chia seeds, sarso oil",
    why: "Lowers inflammation. Useful for PCOS + perimenopause mood.",
  },
  {
    nutrient: "Zinc",
    target: "8 mg",
    sources: "Kaddu seeds, chana, kaju, til, sprouted moong",
    why: "Skin, hair, immunity, and ovulation hormones.",
  },
];

// ─────────────────────────────────────────────────────────────────────
// "Did you know?" facts — shown on /dashboard/learn and other content
// pages. Indian-context women's health facts, sourced from ICMR-NIN,
// WHO, FOGSI, or peer-reviewed India-specific studies.
// ─────────────────────────────────────────────────────────────────────
export interface DailyFact {
  title: string;
  body: string;
  source: string;
}

export const DAILY_FACTS: DailyFact[] = [
  {
    title: "Anaemia hits 57% of Indian women",
    body: "More than half of women aged 15-49 in India are anaemic. Iron + vitamin C together absorb 3x better than iron alone.",
    source: "NFHS-5, 2019-21",
  },
  {
    title: "1 in 5 Indian women has PCOS",
    body: "Polycystic ovary syndrome affects 9-22% of Indian women — often undiagnosed until fertility problems arise.",
    source: "Indian Journal of Medical Research, 2021",
  },
  {
    title: "Menarche has shifted earlier",
    body: "Indian girls now get their first period at 12.3 years on average — down from 14.6 a generation ago. Nutrition + screen exposure both play roles.",
    source: "AIIMS adolescent health survey, 2019",
  },
  {
    title: "Vitamin D deficiency: 70-90% prevalence",
    body: "Most Indian adults — across all socioeconomic groups — are vitamin D deficient. 20 minutes of midday sun + fortified milk closes the gap.",
    source: "Indian J Endocrinol Metab, 2018",
  },
  {
    title: "Maternal mortality dropped 70%",
    body: "India's maternal mortality ratio fell from 384 (1990) to 97 (2020) per 100,000 live births. Iron + folate + skilled birth attendance drove the change.",
    source: "SRS Bulletin, 2022",
  },
  {
    title: "Cycle length varies by 7+ days",
    body: "A normal cycle is 21-35 days. Stress, weight changes, and travel can shift yours by a week without anything being wrong.",
    source: "ACOG Practice Bulletin",
  },
  {
    title: "Soy + flax help hot flashes",
    body: "Phytoestrogens in soy and flaxseed reduce hot flash frequency by ~26% in perimenopausal women — a daily linseed roti is enough.",
    source: "Menopause Journal meta-analysis, 2020",
  },
  {
    title: "Pre-pregnancy folate cuts birth defects 50-70%",
    body: "400 mcg folic acid daily for 3 months before conception reduces neural tube defects dramatically. Spinach, beetroot, and fortified atta count.",
    source: "WHO antenatal care guidelines, 2016",
  },
];

// ─────────────────────────────────────────────────────────────────────
// AI chat starter prompts — shown as suggested chips on /dashboard/chat
// when the user has no chat history yet. Three per day, rotating, so
// the first interaction never feels canned.
// ─────────────────────────────────────────────────────────────────────
export const CHAT_STARTERS: { en: string; hi: string }[] = [
  { en: "What should I eat today based on my cycle?", hi: "मेरे साइकल के हिसाब से आज क्या खाऊं?" },
  { en: "Why am I feeling extra tired this week?", hi: "इस हफ्ते इतनी थकान क्यों है?" },
  { en: "Best home remedy for period cramps?", hi: "मासिक दर्द के लिए सबसे अच्छा घरेलू उपाय?" },
  { en: "Am I getting enough iron in my meals?", hi: "क्या मुझे पर्याप्त आयरन मिल रहा है?" },
  { en: "How do I tell PCOS from regular irregular periods?", hi: "PCOS और अनियमित मासिक में क्या फर्क है?" },
  { en: "Foods that help with hormonal acne?", hi: "हार्मोनल पिंपल्स के लिए कौनसे खाद्य?" },
  { en: "What should I track this week?", hi: "इस हफ्ते मुझे क्या ट्रैक करना चाहिए?" },
  { en: "Why are my breasts sore mid-cycle?", hi: "साइकल के बीच में स्तन दर्द क्यों?" },
  { en: "Safe foods during my first trimester?", hi: "पहली तिमाही में कौनसे सुरक्षित खाद्य?" },
  { en: "Best magnesium-rich Indian foods?", hi: "मैग्नीशियम से भरपूर भारतीय खाद्य?" },
  { en: "Is my cycle length normal?", hi: "क्या मेरी साइकल लंबाई सामान्य है?" },
  { en: "How to manage hot flashes naturally?", hi: "हॉट फ्लैशेस को प्राकृतिक रूप से कैसे संभालें?" },
];

/** Pick three different chat starters per day. */
export function pickThreeChatStarters(): { en: string; hi: string }[] {
  // Three different offsets so they're guaranteed different items
  return [
    pickDaily(CHAT_STARTERS, 0),
    pickDaily(CHAT_STARTERS, 4),
    pickDaily(CHAT_STARTERS, 7),
  ];
}
