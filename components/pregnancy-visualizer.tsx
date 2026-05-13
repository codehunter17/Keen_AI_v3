// Server component — emotional progress visualizer for pregnant users.
// Shows current week + fruit-size analogue + key milestones from lib/fetal.ts.
// Vibrant colors when the user has hit today's hydration goal; muted otherwise.
// Skips rendering for users who aren't pregnant.

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { fetalInfoForWeek } from "@/lib/fetal";
import { dailyWaterTargetMl } from "@/lib/bmi";
import { startOfDay, endOfDay } from "date-fns";

const FRUIT_EMOJI: Record<string, string> = {
  "poppy seed": "·",
  lentil: "🫘",
  raspberry: "🍇",
  lime: "🍋",
  avocado: "🥑",
  banana: "🍌",
  "ear of corn": "🌽",
  eggplant: "🍆",
  jicama: "🥔",
  papaya: "🥭",
  pumpkin: "🎃",
};

export async function PregnancyVisualizer() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) return null;

  const user = await prisma.user.findUnique({
    where: { id: s.user.id },
    select: {
      lifeStage: true,
      pregnancyStage: true,
      pregnancyWeek: true,
      weight: true,
      dueDate: true,
    },
  });

  const isPregnant =
    user?.lifeStage === "PREGNANT" || user?.pregnancyStage === "PREGNANT";
  if (!isPregnant || !user?.pregnancyWeek) return null;

  const w = user.pregnancyWeek;
  const info = fetalInfoForWeek(w);
  const fruit = FRUIT_EMOJI[info.fetalSizeAnalogue] ?? "🌱";

  // Gold-emotional glow if user hit today's water goal already.
  const todayLog = await prisma.dailyLog.findFirst({
    where: {
      userId: s.user.id,
      date: { gte: startOfDay(new Date()), lte: endOfDay(new Date()) },
    },
    select: { waterGlasses: true },
  });
  const targetMl = dailyWaterTargetMl({
    weightKg: user.weight ?? 60,
    pregnant: true,
  });
  const ml = (todayLog?.waterGlasses ?? 0) * 250;
  const goalHit = ml >= targetMl;

  const progressPct = Math.min(100, Math.round((w / 40) * 100));
  const trimesterLabel =
    info.trimester === 1
      ? "First trimester"
      : info.trimester === 2
        ? "Second trimester"
        : "Third trimester";

  return (
    <section
      className={`rounded-2xl lift p-5 sm:p-6 transition-all ${
        goalHit ? "surface-gold" : "bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {trimesterLabel}
          </p>
          <p className="font-heading text-3xl sm:text-4xl mt-1">
            Week {w} of 40
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Baby is the size of a {info.fetalSizeAnalogue}.
          </p>
        </div>
        <div
          className={`text-6xl sm:text-7xl shrink-0 transition-all ${
            goalHit ? "" : "grayscale opacity-60"
          }`}
          aria-hidden
        >
          {fruit}
        </div>
      </div>

      {/* 40-week progress bar */}
      <div className="mt-4 h-2 w-full rounded-full bg-muted/60 overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>Week 1</span>
        <span>{progressPct}% of 40 weeks</span>
        <span>Week 40</span>
      </div>

      <div className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-card/70 p-3">
          <p className="font-medium text-primary">Baby this week</p>
          <p className="mt-1 text-muted-foreground">{info.fetalDevelopment}</p>
        </div>
        <div className="rounded-xl bg-card/70 p-3">
          <p className="font-medium text-primary">You this week</p>
          <p className="mt-1 text-muted-foreground">{info.maternalChanges}</p>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-card/70 p-3 text-sm">
        <p className="font-medium text-primary">Focus today</p>
        <p className="mt-1 text-muted-foreground">{info.whatToFocusOn}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {info.topNutrients.map((n) => (
            <span key={n} className="chip text-[10px] py-0.5">
              {n}
            </span>
          ))}
        </div>
      </div>

      {info.appointmentsDue && (
        <div className="mt-3 rounded-xl bg-secondary/20 border border-secondary/40 p-3 text-sm">
          <p className="font-medium">📅 Coming up</p>
          <p className="mt-1 text-foreground/80">{info.appointmentsDue}</p>
        </div>
      )}

      {!goalHit && (
        <p className="mt-3 text-[11px] text-muted-foreground">
          Hit today's {Math.round(targetMl / 250)} glasses of water to color this
          card gold.
        </p>
      )}
    </section>
  );
}
