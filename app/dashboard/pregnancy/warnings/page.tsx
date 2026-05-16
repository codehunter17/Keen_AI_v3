// Trimester Warning Signs — standalone module. Combines two data sources:
//   1. Per-week warning signs from lib/fetal-weeks.ts (FOGSI/ACOG curated)
//   2. RED-flag emergency lines from pregnancy-related KB conditions:
//      pregnancy-swelling, gestational-diabetes, pregnancy-back-pain,
//      morning-sickness, low-bp-dizziness, heavy-bleeding.
//
// Layout: 3 tabs (1st / 2nd / 3rd trimester). Each shows aggregated red
// flags. A persistent "Call 108" button stays at top. ASHA escalation
// note explains the next-step path for rural users.

import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getWarningSignsForWeek } from "@/lib/fetal-weeks";
import { CONDITIONS_BY_SLUG } from "@/lib/conditions";
import { TrimesterWarningsTabs } from "./trimester-warnings-tabs";
import { Phone, ChevronLeft, AlertTriangle } from "lucide-react";

export const metadata = { title: "Warning signs — NutriMama" };

const PREGNANCY_KB_SLUGS = [
  "pregnancy-swelling",
  "gestational-diabetes",
  "pregnancy-back-pain",
  "morning-sickness",
  "low-bp-dizziness",
  "heavy-bleeding",
  "uti",
];

function trimesterWeeks(t: 1 | 2 | 3): number[] {
  if (t === 1) return Array.from({ length: 12 }, (_, i) => i + 1);
  if (t === 2) return Array.from({ length: 14 }, (_, i) => i + 13);
  return Array.from({ length: 14 }, (_, i) => i + 27);
}

interface TrimesterPanel {
  trimester: 1 | 2 | 3;
  range: string;
  perWeekSigns: string[];
  redFlags: { text: string; conditionName: string; conditionSlug: string }[];
}

function buildPanel(t: 1 | 2 | 3): TrimesterPanel {
  const weeks = trimesterWeeks(t);
  // Dedupe per-week signs across the trimester.
  const seen = new Set<string>();
  const perWeekSigns: string[] = [];
  for (const w of weeks) {
    for (const s of getWarningSignsForWeek(w)) {
      const k = s.toLowerCase().trim();
      if (seen.has(k)) continue;
      seen.add(k);
      perWeekSigns.push(s);
    }
  }

  const redFlags: TrimesterPanel["redFlags"] = [];
  for (const slug of PREGNANCY_KB_SLUGS) {
    const cond = CONDITIONS_BY_SLUG[slug];
    if (!cond) continue;
    for (const a of cond.emergency) {
      if (a.severity !== "RED") continue;
      const key = a.text.toLowerCase().slice(0, 40);
      if (seen.has(key)) continue;
      seen.add(key);
      redFlags.push({
        text: a.text,
        conditionName: cond.name,
        conditionSlug: cond.slug,
      });
    }
  }

  return {
    trimester: t,
    range:
      t === 1 ? "Weeks 1–12" : t === 2 ? "Weeks 13–26" : "Weeks 27–40",
    perWeekSigns: perWeekSigns.slice(0, 20),
    redFlags,
  };
}

export default async function TrimesterWarningsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const me = session
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { pregnancyWeek: true, lifeStage: true },
      })
    : null;

  // Auto-select tab based on user's stage; fall back to T1.
  const week = me?.pregnancyWeek ?? null;
  const initialTrimester: 1 | 2 | 3 =
    week == null ? 1 : week <= 12 ? 1 : week <= 26 ? 2 : 3;

  const panels: Record<1 | 2 | 3, TrimesterPanel> = {
    1: buildPanel(1),
    2: buildPanel(2),
    3: buildPanel(3),
  };

  return (
    <div className="max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-5">
      <Link
        href="/dashboard/pregnancy"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to pregnancy
      </Link>

      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-300" />
          <h1 className="font-heading text-2xl sm:text-3xl text-foreground">
            Pregnancy warning signs
          </h1>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          What needs urgent attention, by trimester. If any of these happen,
          contact a doctor right away.
        </p>
      </header>

      {/* Persistent 108 + ASHA card */}
      <div className="rounded-3xl border border-red-300 dark:border-red-800/60 bg-red-50 dark:bg-red-950/30 p-5 space-y-3">
        <p className="text-sm font-semibold text-red-900 dark:text-red-100">
          In an emergency
        </p>
        <p className="text-sm text-red-900/90 dark:text-red-100/90 leading-relaxed">
          Call <strong>108</strong> for an ambulance, or contact your local{" "}
          <strong>ASHA worker</strong> — they can arrange transport and inform
          the nearest primary health centre.
        </p>
        <a
          href="tel:108"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition"
        >
          <Phone className="w-4 h-4" />
          Call 108 — Free ambulance
        </a>
      </div>

      <TrimesterWarningsTabs
        panels={panels}
        initialTrimester={initialTrimester}
      />

      <p className="pt-4 text-[11px] text-muted-foreground text-center">
        Informational only — not medical advice. Sources: WHO, FOGSI, ACOG,
        ICMR. NutriMama does not prescribe.
      </p>
    </div>
  );
}
