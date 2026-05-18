"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ShieldCheck, Apple, Heart, Droplets, BookOpen, Star, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setDependentMenarche } from "@/lib/actions/dependent";
import type { UnlockedFeatures } from "@/lib/lifecycle";

interface ChildDashboardProps {
  dependent: {
    id: string;
    firstName: string;
    ageBand: string;
    hasMenarche: boolean;
    cycleTrackingEnabled: boolean;
  };
  age: number;
  features: UnlockedFeatures;
  hasParentalConsent: boolean;
}

// ── Good Touch / Bad Touch educational content ───────────────────────────────
const SAFETY_LESSONS = [
  {
    id: "private-parts",
    emoji: "🛡️",
    title: "Your body belongs to you",
    subtitle: "Learning about private parts",
    color: "from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-900/20 border-blue-200 dark:border-blue-800",
    textColor: "text-blue-700 dark:text-blue-300",
    content: [
      "Your body is yours — no one should touch your private parts.",
      "Private parts are the areas covered by your swimsuit.",
      "It is okay to say NO to any touch that feels wrong, even from someone you know.",
      "Always tell a trusted adult (parent, teacher) if someone touches you in a way that makes you uncomfortable.",
    ],
  },
  {
    id: "good-touch",
    emoji: "🤗",
    title: "Good Touch",
    subtitle: "Touches that feel safe and kind",
    color: "from-green-100 to-green-50 dark:from-green-900/40 dark:to-green-900/20 border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-300",
    content: [
      "A hug from your parent when you are sad.",
      "A doctor checking you when you are sick — with a parent present.",
      "A high-five from a friend after a game.",
      "Good touches make you feel safe, happy, or cared for.",
    ],
  },
  {
    id: "bad-touch",
    emoji: "🚫",
    title: "Bad Touch",
    subtitle: "Touches that are never okay",
    color: "from-red-100 to-red-50 dark:from-red-900/40 dark:to-red-900/20 border-red-200 dark:border-red-800",
    textColor: "text-red-700 dark:text-red-300",
    content: [
      "Any touch on your private parts that is NOT from a doctor with your parent there.",
      "Touches that hurt, feel scary, or make you feel bad inside.",
      "When someone asks you to keep a touch a secret from your parents.",
      "You are never wrong for saying NO and telling a trusted adult.",
    ],
  },
  {
    id: "speak-up",
    emoji: "📢",
    title: "Speak Up — It's Brave!",
    subtitle: "What to do if something feels wrong",
    color: "from-yellow-100 to-yellow-50 dark:from-yellow-900/40 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    textColor: "text-yellow-700 dark:text-yellow-300",
    content: [
      "TELL — Tell a trusted adult right away (parent, teacher, relative).",
      "YELL — Yell for help loudly if you are in danger.",
      "RUN — Run to a safe place as fast as you can.",
      "You will never be in trouble for speaking up. It is always the right thing to do.",
    ],
  },
];

// ── Nutrition tips for children ──────────────────────────────────────────────
const NUTRITION_TIPS = [
  { emoji: "🥗", title: "Eat the Rainbow", tip: "Try to eat vegetables and fruits of different colours every day. Each colour gives your body different vitamins." },
  { emoji: "💧", title: "Drink Water", tip: "Drink 6–8 glasses of water every day. Water keeps your brain sharp and your body strong." },
  { emoji: "🥛", title: "Milk & Dairy", tip: "Milk, curd, and paneer help build strong bones and teeth. Try to have them daily." },
  { emoji: "🌾", title: "Whole Grains", tip: "Roti, brown rice, and oats give you lasting energy for school and play." },
  { emoji: "🥚", title: "Protein Power", tip: "Eggs, dal, and rajma help your muscles and brain grow strong. Have them at lunch or dinner." },
  { emoji: "🍎", title: "Fruits are Superheroes", tip: "Bananas, apples, and mangoes fight germs and keep you healthy. Have 1–2 fruits every day." },
];

// ── Period education for teens ────────────────────────────────────────────────
const PERIOD_LESSONS = [
  {
    id: "what-is-period",
    emoji: "🌙",
    title: "What is a Period?",
    color: "from-pink-100 to-pink-50 dark:from-pink-900/40 dark:to-pink-900/20 border-pink-200 dark:border-pink-800",
    textColor: "text-pink-700 dark:text-pink-300",
    content: [
      "A period (menstruation) is when your uterus sheds its lining through the vagina each month.",
      "It usually lasts 3–7 days and happens every 21–35 days.",
      "It is completely normal — every girl gets her first period (menarche) between ages 9 and 16.",
      "Your first few periods might be irregular — that is completely normal.",
    ],
  },
  {
    id: "managing-period",
    emoji: "💪",
    title: "Managing Your Period",
    color: "from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-900/20 border-purple-200 dark:border-purple-800",
    textColor: "text-purple-700 dark:text-purple-300",
    content: [
      "Use a sanitary pad, tampon, or menstrual cup — ask your mother or a trusted adult which suits you.",
      "Change your pad every 4–6 hours to stay clean and comfortable.",
      "Mild cramps are normal. A warm water bottle on your tummy can help.",
      "Light exercise like walking or yoga can reduce discomfort.",
    ],
  },
  {
    id: "period-hygiene",
    emoji: "🚿",
    title: "Period Hygiene",
    color: "from-cyan-100 to-cyan-50 dark:from-cyan-900/40 dark:to-cyan-900/20 border-cyan-200 dark:border-cyan-800",
    textColor: "text-cyan-700 dark:text-cyan-300",
    content: [
      "Wash your private area with plain water — no harsh soaps needed.",
      "Change your pad/tampon regularly — every 4–6 hours, or sooner if needed.",
      "Wrap used pads in paper before disposing of them in a dustbin.",
      "Keep a small period kit in your school bag so you are always prepared.",
    ],
  },
  {
    id: "when-to-see-doctor",
    emoji: "🏥",
    title: "When to Talk to a Doctor",
    color: "from-rose-100 to-rose-50 dark:from-rose-900/40 dark:to-rose-900/20 border-rose-200 dark:border-rose-800",
    textColor: "text-rose-700 dark:text-rose-300",
    content: [
      "Very heavy bleeding (soaking more than 1 pad per hour for 2+ hours).",
      "Severe pain that stops you from going to school.",
      "No period by age 16 — or very irregular cycles after a year.",
      "Always tell your parent first and they will help you see a doctor.",
    ],
  },
];

export function ChildDashboard({
  dependent,
  age,
  features,
  hasParentalConsent,
}: ChildDashboardProps) {
  const [activeTab, setActiveTab] = useState<"safety" | "nutrition" | "period">("safety");
  const [openLesson, setOpenLesson] = useState<string | null>(null);
  const [showMenarchePrompt, setShowMenarchePrompt] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleMenarche = () => {
    startTransition(async () => {
      await setDependentMenarche({
        dependentId: dependent.id,
        enableCycleTracking: true,
      });
      setShowMenarchePrompt(false);
    });
  };

  const isUnder12 = age < 12;
  const isTeen = age >= 12;

  // Tabs available based on age
  const tabs = [
    { id: "safety" as const, label: "Body Safety", icon: ShieldCheck, always: true },
    { id: "nutrition" as const, label: "Nutrition", icon: Apple, always: true },
    { id: "period" as const, label: "Periods", icon: Heart, show: isTeen },
  ].filter((t) => t.always || t.show);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/family"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Family profiles
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
            {dependent.firstName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-heading text-xl text-foreground">
              {dependent.firstName}&apos;s Space
            </h1>
            <p className="text-xs text-muted-foreground">
              Age {age} · {isUnder12 ? "Child mode (parent-supervised)" : "Teen mode"}
            </p>
          </div>
        </div>
      </div>

      {/* First-period prompt (parent banner for teens who haven't confirmed menarche) */}
      {isTeen && !dependent.hasMenarche && !showMenarchePrompt && (
        <div className="rounded-xl bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 p-4 flex items-start gap-3">
          <Heart className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-pink-700 dark:text-pink-300">
              Has {dependent.firstName} had her first period?
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Confirming this unlocks cycle tracking and age-appropriate care tips.
            </p>
          </div>
          <button
            onClick={() => setShowMenarchePrompt(true)}
            className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline shrink-0"
          >
            Confirm
          </button>
        </div>
      )}

      {showMenarchePrompt && (
        <div className="rounded-xl bg-card border border-border p-4 space-y-3">
          <p className="text-sm font-medium">Confirm {dependent.firstName}&apos;s first period</p>
          <p className="text-xs text-muted-foreground">
            This enables period tracking and menstrual health education tailored for her.
            You can turn this off anytime in her profile.
          </p>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleMenarche} disabled={pending}>
              {pending ? "Saving…" : "Yes, confirm"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowMenarchePrompt(false)}>
              Not yet
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-card shadow text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Body Safety Tab ── */}
      {activeTab === "safety" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {isUnder12
              ? "Read these together with your child. Understanding body safety is one of the most important things a child can learn."
              : "Important body safety knowledge — always good to revisit."}
          </p>
          {SAFETY_LESSONS.map((lesson) => (
            <motion.div
              key={lesson.id}
              className={`rounded-2xl border bg-gradient-to-br ${lesson.color} overflow-hidden`}
              layout
            >
              <button
                className="w-full flex items-center gap-3 p-4 text-left"
                onClick={() => setOpenLesson(openLesson === lesson.id ? null : lesson.id)}
              >
                <span className="text-2xl">{lesson.emoji}</span>
                <div className="flex-1">
                  <p className={`font-semibold ${lesson.textColor}`}>{lesson.title}</p>
                  <p className="text-xs text-muted-foreground">{lesson.subtitle}</p>
                </div>
                <span className="text-muted-foreground text-sm">
                  {openLesson === lesson.id ? "▲" : "▼"}
                </span>
              </button>
              {openLesson === lesson.id && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="px-4 pb-4 space-y-2"
                >
                  {lesson.content.map((point, i) => (
                    <li key={i} className="flex gap-2 text-sm text-foreground">
                      <Star className="w-4 h-4 shrink-0 mt-0.5 text-yellow-500" />
                      {point}
                    </li>
                  ))}
                </motion.ul>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Nutrition Tab ── */}
      {activeTab === "nutrition" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Good food helps {dependent.firstName} grow strong, stay focused in school, and feel great every day.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {NUTRITION_TIPS.map((tip, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-4 space-y-2"
              >
                <div className="text-2xl">{tip.emoji}</div>
                <p className="font-semibold text-sm text-foreground">{tip.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{tip.tip}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 flex gap-2 text-xs text-green-700 dark:text-green-300">
            <Droplets className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              <strong>Hydration tip:</strong> {dependent.firstName} needs at least 6 glasses of water per day —
              more on hot or active days. Pack a water bottle to school!
            </p>
          </div>
        </div>
      )}

      {/* ── Period Education Tab (12+ only) ── */}
      {activeTab === "period" && isTeen && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Age-appropriate period education for {dependent.firstName}. Read together or let her explore independently.
          </p>
          {PERIOD_LESSONS.map((lesson) => (
            <motion.div
              key={lesson.id}
              className={`rounded-2xl border bg-gradient-to-br ${lesson.color} overflow-hidden`}
              layout
            >
              <button
                className="w-full flex items-center gap-3 p-4 text-left"
                onClick={() => setOpenLesson(openLesson === lesson.id ? null : lesson.id)}
              >
                <span className="text-2xl">{lesson.emoji}</span>
                <div className="flex-1">
                  <p className={`font-semibold ${lesson.textColor}`}>{lesson.title}</p>
                </div>
                <span className="text-muted-foreground text-sm">
                  {openLesson === lesson.id ? "▲" : "▼"}
                </span>
              </button>
              {openLesson === lesson.id && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="px-4 pb-4 space-y-2"
                >
                  {lesson.content.map((point, i) => (
                    <li key={i} className="flex gap-2 text-sm text-foreground">
                      <Star className="w-4 h-4 shrink-0 mt-0.5 text-yellow-500" />
                      {point}
                    </li>
                  ))}
                </motion.ul>
              )}
            </motion.div>
          ))}

          {/* Cycle tracker link if enabled */}
          {dependent.cycleTrackingEnabled && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-3">
              <Heart className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">Cycle tracker is on</p>
                <p className="text-xs text-muted-foreground">
                  You can log {dependent.firstName}'s periods from the parent dashboard.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Parental supervision note */}
      <div className="rounded-xl bg-muted/60 border border-border p-3 flex gap-2 text-xs text-muted-foreground">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
        <p>
          This is a parent-supervised profile. AI chat, health reports, and risk assessments are
          not available for dependent profiles. All data is stored under your account.
        </p>
      </div>
    </div>
  );
}
