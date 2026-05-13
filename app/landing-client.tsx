"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Splash } from "@/components/splash";
import { pickDaily, HERO_AI_TIPS, HERO_REPORT_FINDINGS } from "@/lib/daily";

// Designed for two audiences at once:
//  • Rural Indian women  → big touch targets, plain Hindi/English copy,
//    region-aware remedies, voice-friendly, low-data PWA install.
//  • Urban Indian women  → premium aesthetic, ICMR-sourced data,
//    PCOS / pregnancy / fertility, AI chat, paid tier value.

export default function LandingPageClient({
  statsSlot,
}: {
  statsSlot?: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [lang, setLang] = useState<"en" | "hi">("en");

  const t = (en: string, hi: string) => (lang === "hi" ? hi : en);

  // Hero callouts rotate daily — deterministic by UTC day, so everyone
  // sees the same card on a given date but it refreshes overnight.
  const todaysTip = pickDaily(HERO_AI_TIPS);
  const todaysFinding = pickDaily(HERO_REPORT_FINDINGS, 3); // offset = different from tip slot

  const ctaHref = session ? "/dashboard" : "/auth/sign-up";
  const ctaLabel = session
    ? t("Open NutriMama", "NutriMama खोलें")
    : t("Start free — no card", "मुफ्त शुरू करें");

  return (
    <>
      <Splash />
      <div className="min-h-screen bg-background text-foreground">
        {/* ─── Top bar ─────────────────────────────────────── */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl surface-premium lift flex items-center justify-center">
                <span className="font-heading font-bold text-primary text-lg">N</span>
              </div>
              <span className="font-heading font-bold text-xl tracking-tight">
                NutriMama
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">{t("Features", "विशेषताएं")}</a>
              <a href="#how" className="text-muted-foreground hover:text-foreground transition-colors">{t("How it works", "कैसे काम करता है")}</a>
              <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">{t("Plans", "योजनाएं")}</Link>
              <Link href="/legal/privacy" className="text-muted-foreground hover:text-foreground transition-colors">{t("Privacy", "गोपनीयता")}</Link>
            </nav>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLang(lang === "en" ? "hi" : "en")}
                className="chip cursor-pointer text-xs"
                aria-label="Toggle language"
              >
                {lang === "en" ? "हिन्दी" : "English"}
              </button>
              <ThemeToggle />
              {session ? (
                <Link href="/dashboard" className="hidden sm:inline-flex rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:scale-[1.02] transition">
                  {t("Dashboard", "डैशबोर्ड")}
                </Link>
              ) : (
                <Link href="/auth/sign-in" className="hidden sm:inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted transition">
                  {t("Sign in", "लॉगिन")}
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* ─── Hero ───────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 surface-premium opacity-40" />
          <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-16 sm:pt-20 sm:pb-24">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center lg:text-left"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card px-3 py-1 text-xs font-medium text-primary mb-4">
                  {/* Indian-flag mini-bar — works on every browser without emoji rendering */}
                  <span className="inline-flex h-3 w-4 overflow-hidden rounded-sm shadow-sm" aria-hidden>
                    <span className="flex-1 bg-[#FF9933]" />
                    <span className="flex-1 bg-white relative">
                      <span className="absolute inset-0 m-auto w-1 h-1 rounded-full bg-[#000080]" />
                    </span>
                    <span className="flex-1 bg-[#138808]" />
                  </span>
                  {t("Made for India · DPDP-compliant", "भारत के लिए · DPDP नियमों के अनुसार")}
                </span>
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
                  {t("Your body, ", "आपका शरीर, ")}
                  <span className="text-primary">{t("understood.", "समझा गया।")}</span>
                </h1>
                <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                  {t(
                    "From your first period to motherhood — AI-powered cycle tracking, PCOS screening, pregnancy care, and gharelu remedies that actually work in your kitchen.",
                    "पहले मासिक धर्म से माँ बनने तक — AI साइकल ट्रैकिंग, PCOS स्क्रीनिंग, गर्भावस्था देखभाल, और घरेलू नुस्खे जो आपकी रसोई में काम करते हैं।",
                  )}
                </p>
                <div className="mt-7 flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Link
                    href={ctaHref}
                    className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-base font-semibold lift hover:scale-[1.02] transition"
                  >
                    {ctaLabel} →
                  </Link>
                  <a
                    href="#how"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-base font-semibold hover:bg-muted transition"
                  >
                    {t("See how it works", "कैसे काम करता है देखें")}
                  </a>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground justify-center lg:justify-start">
                  <span>✓ {t("No credit card", "कार्ड नहीं चाहिए")}</span>
                  <span>✓ {t("Hindi + English", "हिन्दी + अंग्रेज़ी")}</span>
                  <span>✓ {t("Works offline", "ऑफलाइन काम करता है")}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="relative"
              >
                <div className="relative mx-auto w-full max-w-[460px] aspect-square">
                  {/* Single soft brand glow — restrained, not three layers */}
                  <div className="absolute inset-4 bg-linear-to-br from-primary/15 via-secondary/15 to-gold/10 rounded-full blur-3xl opacity-80" />

                  {/* Cycle ring — the visual anchor */}
                  <div className="absolute inset-[10%] flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <svg viewBox="-25 -25 250 250" className="w-full h-full -rotate-90" overflow="visible">
                        {/* Background ring */}
                        <circle
                          cx="100"
                          cy="100"
                          r="92"
                          fill="none"
                          stroke="oklch(0.95 0.012 85)"
                          strokeWidth="6"
                        />
                        {/* Phase tick marks (28 days) */}
                        {Array.from({ length: 28 }).map((_, i) => {
                          const angle = (i / 28) * 360;
                          const rad = (angle * Math.PI) / 180;
                          const x1 = +(100 + 86 * Math.cos(rad)).toFixed(4);
                          const y1 = +(100 + 86 * Math.sin(rad)).toFixed(4);
                          const x2 = +(100 + 92 * Math.cos(rad)).toFixed(4);
                          const y2 = +(100 + 92 * Math.sin(rad)).toFixed(4);
                          return (
                            <line
                              key={i}
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke="oklch(0.85 0.012 85)"
                              strokeWidth="1.5"
                            />
                          );
                        })}
                        {/* Period segment (days 1-5) — red/blush */}
                        <circle
                          cx="100"
                          cy="100"
                          r="92"
                          fill="none"
                          stroke="oklch(0.55 0.18 25)"
                          strokeWidth="14"
                          strokeLinecap="round"
                          strokeDasharray={`${(5 / 28) * 578} ${578}`}
                          strokeDashoffset={0}
                        />
                        {/* Follicular (6-13) — green */}
                        <circle
                          cx="100"
                          cy="100"
                          r="92"
                          fill="none"
                          stroke="oklch(0.45 0.10 160)"
                          strokeWidth="14"
                          strokeLinecap="round"
                          strokeDasharray={`${(8 / 28) * 578} ${578}`}
                          strokeDashoffset={`${-(5 / 28) * 578}`}
                          opacity="0.85"
                        />
                        {/* Ovulation (14-15) — gold */}
                        <circle
                          cx="100"
                          cy="100"
                          r="92"
                          fill="none"
                          stroke="oklch(0.78 0.085 80)"
                          strokeWidth="14"
                          strokeLinecap="round"
                          strokeDasharray={`${(2 / 28) * 578} ${578}`}
                          strokeDashoffset={`${-(13 / 28) * 578}`}
                        />
                        {/* Luteal (16-28) — blush */}
                        <circle
                          cx="100"
                          cy="100"
                          r="92"
                          fill="none"
                          stroke="oklch(0.86 0.05 25)"
                          strokeWidth="14"
                          strokeLinecap="round"
                          strokeDasharray={`${(13 / 28) * 578} ${578}`}
                          strokeDashoffset={`${-(15 / 28) * 578}`}
                          opacity="0.85"
                        />

                        {/* Current-day dot indicator at day 22 */}
                        {(() => {
                          const angle = (22 / 28) * 360 - 90; // SVG starts at top
                          const rad = (angle * Math.PI) / 180;
                          const cx = +(100 + 92 * Math.cos(rad)).toFixed(4);
                          const cy = +(100 + 92 * Math.sin(rad)).toFixed(4);
                          return (
                            <g>
                              <circle cx={cx} cy={cy} r="14" fill="white" />
                              <circle cx={cx} cy={cy} r="10" fill="oklch(0.40 0.07 160)" />
                              <circle cx={cx} cy={cy} r="14" fill="none" stroke="oklch(0.40 0.07 160)" strokeWidth="2" opacity="0.4">
                                <animate attributeName="r" values="14;22;14" dur="2.5s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
                              </circle>
                            </g>
                          );
                        })()}
                      </svg>

                      {/* Center content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-14">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
                          {t("Day", "दिन")} 22 / 28
                        </p>
                        <p className="font-heading text-5xl sm:text-6xl text-primary mt-3 tracking-tight">
                          {t("Luteal", "ल्यूटियल")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-3 leading-snug max-w-[180px]">
                          {t("Period in 6 days. Iron + magnesium ease cramps.", "6 दिन में मासिक · लोहा + मैग्नीशियम")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Two orbiting cards — kept minimal so the ring breathes.
                      Removed the streak and voice cards (visual noise + fake for
                      day-zero users). The two we kept show the *core* value prop:
                      "AI knows your cycle context" + "We read your reports". */}

                  {/* Top-left: AI chat */}
                  <motion.div
                    initial={{ opacity: 0, x: -20, y: -10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="absolute -top-2 -left-2 sm:-left-6 bg-card border border-border/60 shadow-lg rounded-2xl p-3.5 max-w-[200px]"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-bold">
                        AI
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                        {t("Today", "आज")}
                      </span>
                    </div>
                    <p className="text-[12px] leading-snug text-foreground/90">
                      {t(todaysTip.en, todaysTip.hi)}
                    </p>
                  </motion.div>

                  {/* Bottom-right: AI report finding (rotates daily) */}
                  <motion.div
                    initial={{ opacity: 0, x: 20, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="absolute -bottom-2 -right-2 sm:-right-6 bg-card border border-border/60 shadow-lg rounded-2xl p-3.5 max-w-[180px]"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-primary">
                        {t("Report finding", "रिपोर्ट")}
                      </span>
                    </div>
                    <p className="font-heading text-xl text-foreground leading-tight">
                      {todaysFinding.value}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {t(todaysFinding.note.en, todaysFinding.note.hi)}
                    </p>
                  </motion.div>

                  {/* ICMR credibility badge — small, no rotation */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-card border border-border shadow-sm rounded-full px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {t("Backed by ICMR-NIN 2020", "ICMR-NIN 2020 आधारित")}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Live stats strip (server-rendered, ISR 1h) ─── */}
        {statsSlot}

        {/* ─── Pillars: rural + urban ─────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
          <div className="grid sm:grid-cols-3 gap-4">
            <Pillar
              emoji="🏡"
              title={t("Built for every village", "हर गाँव के लिए")}
              body={t(
                "Voice logging, big buttons, regional meal plans for Punjab, Bengal, Tamil Nadu and 6 more. Works on slow networks.",
                "आवाज़ से लॉगिंग, बड़े बटन, पंजाब, बंगाल, तमिलनाडु और 6 और राज्यों के लिए क्षेत्रीय भोजन।",
              )}
            />
            <Pillar
              emoji="🏢"
              title={t("Made for the city too", "शहर के लिए भी")}
              body={t(
                "AI report analysis, PCOS screening, pregnancy risk prediction, premium UI. Cancel anytime.",
                "AI रिपोर्ट विश्लेषण, PCOS स्क्रीनिंग, गर्भावस्था जोखिम भविष्यवाणी, प्रीमियम UI।",
              )}
            />
            <Pillar
              emoji="🛡️"
              title={t("Your data, your rules", "आपका डेटा, आपके नियम")}
              body={t(
                "DPDP Act 2023 compliant. Encrypted. Never sold. Delete anytime in Settings.",
                "DPDP एक्ट 2023 के अनुसार। एन्क्रिप्टेड। कभी नहीं बेचा जाता।",
              )}
            />
          </div>
        </section>

        {/* ─── Features grid ──────────────────────────────── */}
        <section id="features" className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
          <div className="text-center mb-10">
            <span className="chip border-primary/30 text-primary">{t("Features", "विशेषताएं")}</span>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl tracking-tight">
              {t("Everything in one place", "सब कुछ एक जगह")}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard emoji="🌙" title={t("Cycle tracking", "मासिक चक्र")} desc={t("Log periods, track symptoms, predict your next cycle.", "मासिक धर्म लॉग करें, अगला चक्र अनुमान।")} />
            <FeatureCard emoji="🌸" title={t("PCOS screening", "PCOS जाँच")} desc={t("9-question Rotterdam-style screen.", "9-प्रश्न रोटरडैम स्क्रीन।")} />
            <FeatureCard emoji="🤰" title={t("Pregnancy mode", "गर्भावस्था")} desc={t("Week-by-week growth, ICMR meal plans, AI risk prediction.", "हफ़्ते-दर-हफ़्ते विकास, ICMR भोजन योजना।")} />
            <FeatureCard emoji="🥗" title={t("3-layer remedies", "3-स्तरीय नुस्खे")} desc={t("Gharelu + ayurveda + medicine. Pick what fits you.", "घरेलू + आयुर्वेद + दवा। आप जो चाहें चुनें।")} />
            <FeatureCard emoji="💧" title={t("Daily wellness", "दैनिक देखभाल")} desc={t("Water, mood, BMI, streaks. Tiny actions, big change.", "पानी, मूड, BMI, स्ट्रीक।")} />
            <FeatureCard emoji="💬" title={t("AI companion", "AI साथी")} desc={t("Empathetic, evidence-based, never generic.", "सहानुभूतिपूर्ण, साक्ष्य-आधारित, कभी सामान्य नहीं।")} />
            <FeatureCard emoji="🩺" title={t("Medical reports", "मेडिकल रिपोर्ट")} desc={t("Upload a blood test — get findings in plain language.", "ब्लड टेस्ट अपलोड करें — सरल भाषा में रिपोर्ट।")} />
            <FeatureCard emoji="🚨" title={t("Safety net", "सुरक्षा कवच")} desc={t("Emergency keyword detection routes you to 102 / 112 / iCall.", "आपात पर तुरंत 102/112/iCall पर भेजा जाएगा।")} />
            <FeatureCard emoji="📲" title={t("Install on phone", "फ़ोन पर इंस्टॉल")} desc={t("PWA — installs from browser. No App Store, no ads.", "ब्राउज़र से इंस्टॉल। न App Store, न विज्ञापन।")} />
          </div>
        </section>

        {/* ─── How it works ───────────────────────────────── */}
        <section id="how" className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
          <div className="text-center mb-10">
            <span className="chip border-primary/30 text-primary">{t("How it works", "कैसे काम करता है")}</span>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl tracking-tight">
              {t("3 steps to your daily plan", "आपके प्लान के 3 कदम")}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Step n="1" title={t("Tell us your stage", "अपना चरण बताएं")} body={t("Cycle, trying-to-conceive, pregnant, postpartum or menopause.", "मासिक, गर्भधारण की कोशिश, गर्भवती, प्रसवोत्तर या रजोनिवृत्ति।")} />
            <Step n="2" title={t("Log a few things", "कुछ चीज़ें लॉग करें")} body={t("Period, water, mood, symptoms. Voice or tap. 60 seconds a day.", "मासिक, पानी, मूड, लक्षण। आवाज़ या टैप।")} />
            <Step n="3" title={t("Get your plan", "अपना प्लान पाएं")} body={t("Region-specific meal plan, remedies, AI insights — never generic.", "क्षेत्र-विशिष्ट भोजन, नुस्खे, AI सलाह — कभी सामान्य नहीं।")} />
          </div>
        </section>

        {/* ─── How AI personalizes ─────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
          <div className="rounded-3xl surface-premium lift-strong p-6 sm:p-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="chip border-primary/30 text-primary">
                  {t("How the AI personalizes", "AI कैसे काम करता है")}
                </span>
                <h2 className="mt-3 font-heading text-3xl tracking-tight">
                  {t("Zero generalization. Zero hallucination.", "कोई सामान्य सलाह नहीं। कोई अनुमान नहीं।")}
                </h2>
                <p className="mt-3 text-sm text-foreground/80 leading-relaxed">
                  {t(
                    'NutriMama isn\'t a generic chatbot wearing a health badge. Every answer is anchored to your exact biological phase — Luteal Day 22, Pregnancy Week 14 — and to ICMR-NIN 2020 nutrient targets. Not "drink water" but "your plan needs 3 mg more iron — eat methi + nimbu in lunch."',
                    'NutriMama कोई सामान्य चैटबॉट नहीं है। हर सलाह आपके सटीक चरण से जुड़ी है। "पानी पियो" नहीं, बल्कि "3 mg लोहा कम है — मेथी + नीम्बू खाएं।"',
                  )}
                </p>
              </div>
              <ul className="space-y-3">
                <Bullet emoji="🎯" title={t("Phase-aware", "चरण-जागरूक")} body={t("Your trimester or cycle day filters every reply.", "आपका तिमाही या साइकल दिन हर जवाब बनाता है।")} />
                <Bullet emoji="🔢" title={t("Math-anchored", "गणित-आधारित")} body={t("Macros + micros from ICMR-NIN. Numbers don't move.", "ICMR-NIN से मात्रा। नंबर नहीं बदलते।")} />
                <Bullet emoji="🛡️" title={t("Server-side proxy", "सर्वर-सुरक्षित")} body={t("API keys never reach your browser.", "API keys ब्राउज़र तक नहीं जाते।")} />
                <Bullet emoji="🔁" title={t("3 AI providers", "3 AI प्रदाता")} body={t("Groq → Gemini → Claude failover.", "एक प्रदाता बंद हो तो दूसरा चलता है।")} />
              </ul>
            </div>
          </div>
        </section>

        {/* ─── Trust strip ─────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <Badge label={t("ICMR-NIN aligned", "ICMR-NIN संरेखित")} />
            <Badge label={t("WHO + FOGSI 2023", "WHO + FOGSI 2023")} />
            <Badge label="DPDP Act 2023" />
            <Badge label={t("UPI · Cards · Netbanking", "UPI · कार्ड")} />
          </div>
        </section>

        {/* ─── Pricing nudge ─────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
          <div className="rounded-3xl bg-card lift p-6 sm:p-10 text-center">
            <h3 className="font-heading text-2xl sm:text-3xl tracking-tight">
              {t("Free forever for the basics.", "बेसिक हमेशा मुफ्त।")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t(
                "Care ₹49/mo: 10 chats/day, 5 reports + 4 meal plans monthly. Pro ₹99/mo: 15 chats/day, unlimited reports + meal plans, partner access.",
                "Care ₹49/महीना: 10 चैट/दिन, 5 रिपोर्ट + 4 भोजन योजना। Pro ₹99/महीना: 15 चैट/दिन, अनलिमिटेड + पार्टनर एक्सेस।",
              )}
            </p>
            <Link
              href="/pricing"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold lift hover:scale-[1.02] transition"
            >
              {t("Compare plans", "योजनाएं देखें")} →
            </Link>
          </div>
        </section>

        {/* ─── Final CTA ─────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-5 sm:px-8 py-16 text-center">
          <h2 className="font-heading text-3xl sm:text-5xl tracking-tight">
            {t("Start today.", "आज शुरू करें।")}
            <br />
            <span className="text-primary">{t("Your future self will thank you.", "भविष्य की आप शुक्रिया कहेंगी।")}</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t("60 seconds to sign up. No card. Cancel any day.", "साइन अप 60 सेकंड में। कार्ड नहीं चाहिए।")}
          </p>
          <Link
            href={ctaHref}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-4 text-lg font-semibold lift-strong hover:scale-[1.02] transition"
          >
            {ctaLabel} →
          </Link>
        </section>

        {/* ─── Footer ─────────────────────────────── */}
        <footer className="border-t border-border/60 mt-10">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 grid sm:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div>
              <p className="font-heading font-bold text-foreground text-lg">NutriMama</p>
              <p className="text-xs mt-1">{t("Made in India · with love for women's health", "भारत में बनी · महिलाओं के स्वास्थ्य के लिए")}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-2">{t("Product", "प्रोडक्ट")}</p>
              <ul className="space-y-1">
                <li><a href="#features" className="hover:text-foreground">{t("Features", "विशेषताएं")}</a></li>
                <li><Link href="/pricing" className="hover:text-foreground">{t("Pricing", "कीमत")}</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-2">{t("Legal", "कानूनी")}</p>
              <ul className="space-y-1">
                <li><Link href="/legal/privacy" className="hover:text-foreground">{t("Privacy Policy", "गोपनीयता नीति")}</Link></li>
                <li><Link href="/legal/terms" className="hover:text-foreground">{t("Terms of Use", "उपयोग की शर्तें")}</Link></li>
                <li className="pt-2 text-xs">{t("Emergency: 112 · 102 · 1091", "आपातकाल: 112 · 102 · 1091")}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} NutriMama · {t("Not medical advice. Always consult a qualified doctor.", "चिकित्सा सलाह नहीं। हमेशा डॉक्टर से सलाह लें।")}
          </div>
        </footer>
      </div>
    </>
  );
}

function Pillar({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-card lift p-5">
      <div className="text-3xl mb-2">{emoji}</div>
      <p className="font-heading text-lg text-primary">{title}</p>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

function FeatureCard({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-card lift p-5 hover:lift-strong transition-shadow">
      <div className="text-2xl mb-1.5">{emoji}</div>
      <p className="font-heading text-base">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-card lift p-5">
      <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading text-lg mb-3">
        {n}
      </div>
      <p className="font-heading text-lg">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function Bullet({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <li className="flex items-start gap-3 rounded-2xl bg-card/70 p-3">
      <span className="text-xl leading-none mt-0.5">{emoji}</span>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{body}</p>
      </div>
    </li>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
