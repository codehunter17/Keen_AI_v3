// Server component — pulls together cycle prediction + selfcare tip +
// remedy of the day + streak. Drop into the dashboard root page.

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { predictNextCycle } from "@/lib/actions/cycle";
import { getStreak, getTodaysHydration } from "@/lib/actions/wellness";
import { selfcareForUser } from "@/lib/selfcare";
import { DEFICIENCY_REMEDIES } from "@/lib/medical-kb";
import { ageFromDob, type LifeStage, type CycleStage } from "@/lib/lifecycle";
import { format, formatDistanceToNow } from "date-fns";

export async function DailyPlan() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) return null;

  const u = await prisma.user.findUnique({
    where: { id: s.user.id },
    select: {
      name: true,
      dob: true,
      lifeStage: true,
      cycleStage: true,
      tier: true,
    },
  });
  if (!u?.dob) return null;

  const age = ageFromDob(u.dob);
  if (age < 18) return null;

  // Defensive: each tile fetches independently. One failure doesn't blank
  // out the whole hero — you still see the rest of your day at a glance.
  const [cycle, streak, hydration] = await Promise.all([
    predictNextCycle().catch(() => null),
    getStreak().catch(() => ({ currentDays: 0, longestDays: 0, lastCheckIn: null })),
    getTodaysHydration().catch(() => ({ ml: 0, target: 2500, percent: 0 })),
  ]);

  const tips = selfcareForUser({
    lifeStage: (u.lifeStage as LifeStage | null) ?? undefined,
    cycleStage: (u.cycleStage as CycleStage | null) ?? undefined,
  });
  const tipOfDay = tips[new Date().getDate() % Math.max(1, tips.length)];

  // Remedy of the day — rotate by date for consistency within a day.
  const nutrients = Object.keys(DEFICIENCY_REMEDIES);
  const remedyKey = nutrients[new Date().getDate() % nutrients.length];
  const remedy = DEFICIENCY_REMEDIES[remedyKey];

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <section className="rounded-2xl surface-premium lift-strong p-5 sm:p-6">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <div>
          <p className="font-heading text-2xl sm:text-3xl text-primary">
            {greeting}, {(u.name ?? "").split(" ")[0] || "friend"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {format(new Date(), "EEEE, dd MMMM yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Stat label="streak" value={`${streak.currentDays}🔥`} />
          <Stat label="water" value={`${hydration.percent}%`} />
        </div>
      </div>

      <div className="mt-5 grid sm:grid-cols-3 gap-3">
        {/* Cycle card */}
        <Tile
          title="Your cycle"
          href="/dashboard/cycle"
          accent="bg-card"
        >
          {cycle?.nextPredictedStart ? (
            <>
              <p className="font-heading text-lg">
                {formatDistanceToNow(new Date(cycle.nextPredictedStart))}
              </p>
              <p className="text-[11px] text-muted-foreground">
                until your next period
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Log your last period to start predictions →
            </p>
          )}
        </Tile>

        {/* Self-care */}
        {tipOfDay && (
          <Tile
            title="Today's ritual"
            href="/dashboard/selfcare"
            accent="bg-card"
          >
            <p className="font-medium text-sm">{tipOfDay.title}</p>
            <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">
              {tipOfDay.body}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {tipOfDay.durationMin} min · {tipOfDay.category.toLowerCase()}
            </p>
          </Tile>
        )}

        {/* Remedy */}
        <Tile
          title={`Today: ${remedy.name}`}
          href="/dashboard/remedies"
          accent="surface-gold"
        >
          <p className="text-sm">{remedy.gharelu[0]}</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            tap for ayurveda + medicine layers
          </p>
        </Tile>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <p className="font-heading text-xl">{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

function Tile({
  title,
  href,
  accent,
  children,
}: {
  title: string;
  href: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={`rounded-xl ${accent} lift p-4 hover:lift-strong transition-shadow block`}
    >
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
        {title}
      </p>
      <div>{children}</div>
    </a>
  );
}
