// Supported app languages. Native-script label is what the user reads at
// pick-time; English label is the debug/admin name.
//
// Add a language here ONCE — all UI surfaces (onboarding, settings, greeting
// helpers) read from this single registry. Adding "kn" or "gu" later is a
// one-line change.

export const LANGUAGES = [
  { code: "en", label: "English", native: "English", rtl: false },
  { code: "hi", label: "Hindi", native: "हिन्दी", rtl: false },
  { code: "ta", label: "Tamil", native: "தமிழ்", rtl: false },
  { code: "te", label: "Telugu", native: "తెలుగు", rtl: false },
  { code: "bn", label: "Bengali", native: "বাংলা", rtl: false },
  { code: "mr", label: "Marathi", native: "मराठी", rtl: false },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const SUPPORTED_LANGUAGE_CODES: LanguageCode[] = LANGUAGES.map(
  (l) => l.code,
);

export function isSupportedLanguage(c: unknown): c is LanguageCode {
  return (
    typeof c === "string" &&
    (SUPPORTED_LANGUAGE_CODES as readonly string[]).includes(c)
  );
}

export function nativeLabel(code: string | null | undefined): string {
  const l = LANGUAGES.find((x) => x.code === code);
  return l?.native ?? "English";
}

// Time-of-day greeting in the user's language.
// "Good morning, Priya" / "शुभ प्रभात, प्रिया" etc.
// We deliberately keep these short — they fit on small phone widths.
const GREETINGS: Record<LanguageCode, { morning: string; afternoon: string; evening: string }> = {
  en: { morning: "Good morning",  afternoon: "Good afternoon",  evening: "Good evening"   },
  hi: { morning: "शुभ प्रभात",      afternoon: "नमस्ते",           evening: "शुभ संध्या"      },
  ta: { morning: "காலை வணக்கம்",   afternoon: "மதிய வணக்கம்",      evening: "மாலை வணக்கம்"   },
  te: { morning: "శుభోదయం",        afternoon: "నమస్కారం",         evening: "శుభ సాయంత్రం"  },
  bn: { morning: "সুপ্রভাত",        afternoon: "নমস্কার",          evening: "শুভ সন্ধ্যা"     },
  mr: { morning: "शुभ सकाळ",       afternoon: "नमस्कार",          evening: "शुभ संध्याकाळ"  },
};

export function timeOfDayGreeting(
  code: string | null | undefined,
  now: Date = new Date(),
): string {
  const lang = isSupportedLanguage(code) ? code : "en";
  const h = now.getHours();
  const g = GREETINGS[lang];
  if (h < 12) return g.morning;
  if (h < 17) return g.afternoon;
  return g.evening;
}

// Small dictionary of high-traffic strings that we want translated even
// before a full i18n rollout. Keep the keys short and stable.
const PHRASES = {
  welcomeHome: {
    en: "Welcome home",
    hi: "स्वागत है",
    ta: "வீட்டுக்கு வரவேற்கிறோம்",
    te: "స్వాగతం",
    bn: "স্বাগতম",
    mr: "स्वागत आहे",
  },
  yourName: {
    en: "Your name",
    hi: "आपका नाम",
    ta: "உங்கள் பெயர்",
    te: "మీ పేరు",
    bn: "আপনার নাম",
    mr: "तुमचे नाव",
  },
  loading: {
    en: "Loading…",
    hi: "लोड हो रहा है…",
    ta: "ஏற்றுகிறது…",
    te: "లోడ్ అవుతోంది…",
    bn: "লোড হচ্ছে…",
    mr: "लोड होत आहे…",
  },
} as const;

export type PhraseKey = keyof typeof PHRASES;

export function tr(code: string | null | undefined, key: PhraseKey): string {
  const lang = isSupportedLanguage(code) ? code : "en";
  return PHRASES[key][lang];
}
