"use client";
import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/lib/actions/dashboard";
import {
  Calendar as CalendarIcon,
  MessageSquare,
  Moon,
  Heart,
  Move,
  Sparkles,
  MoreVertical,
  ChevronRight,
  MessageCircle,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteCalendarEvent, type CalendarEvent } from "@/lib/actions/calendar";
import { CreateEventModal } from "@/components/calendar/create-event-modal";
import { Loader } from "@/components/ui/loader";
import { type Tier } from "@/lib/tiers";
import { pickDailyTip } from "@/lib/daily";
import { CyclePhaseStrip } from "@/components/cycle-phase-strip";

const TIER_BADGE: Record<Tier, { label: string; className: string }> = {
  FREE: {
    label: "Free",
    className:
      "text-muted-foreground bg-muted border-border",
  },
  CARE_49: {
    label: "Care",
    className:
      "text-white bg-primary border-primary shadow-sm",
  },
  PRO_99: {
    label: "Pro",
    className:
      "text-white bg-gradient-to-r from-primary to-emerald-600 border-primary shadow-sm",
  },
};

export default function OverviewClient() {
  const { data: session, isPending: sessionLoading } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["dashboard", session?.user?.id],
    queryFn: async () => await getDashboardData(),
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (!sessionLoading && !session) {
      router.push("/auth/sign-in");
    } else if (!isLoading && data && !data.user?.lifeStage) {
      // Gate onboarding on lifeStage (set in step 1) — pregnancyStage is
      // always "PRE_PREGNANT" for non-pregnant users so it's not a good gate.
      router.push("/onboarding");
    }
  }, [session, sessionLoading, data, isLoading, router]);

  if (isLoading || sessionLoading) {
    return <Loader />;
  }

  const lifeStage = data?.user?.lifeStage;
  const isPregnant = data?.user?.pregnancyStage === "PREGNANT";
  const isPostpartum = data?.user?.pregnancyStage === "POST_PARTUM";

  const week = data?.user?.pregnancyWeek || 0;
  const progressPercent = isPregnant
    ? Math.min(Math.round((week / 40) * 100), 100)
    : 0;
  const trimester = week <= 12 ? 1 : week <= 26 ? 2 : 3;

  const dueDate = data?.user?.dueDate ? new Date(data.user.dueDate) : null;
  const daysToBaby = dueDate
    ? Math.max(
        0,
        Math.ceil(
          (dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
        ),
      )
    : null;

  const xp =
    (data?.reportsCount || 0) * 20 +
    (isPregnant ? week * 5 : 0) +
    (data?.todayLog ? 10 : 0);

  const formatSleep = (duration?: string | number | null) => {
    if (duration == null) return null;
    const d = parseFloat(duration.toString());
    if (!Number.isFinite(d) || d <= 0) return null;
    const hours = Math.floor(d);
    const minutes = Math.round((d - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  // Welcome subtitle varies by life stage. We never tell a menopause user
  // they're "X weeks along".
  const subtitle = (() => {
    if (isPregnant) {
      return `You're ${week} weeks along. Today is about nurturing both you and your little one.`;
    }
    if (isPostpartum) {
      return "Recovery takes time. Today, pick one thing that's just for you.";
    }
    switch (lifeStage) {
      case "TRYING_TO_CONCEIVE":
        return "Your body is preparing. Track, learn, and breathe.";
      case "PERIMENOPAUSE":
        return "Your hormones are shifting. Track the changes — knowledge is power.";
      case "MENOPAUSE":
        return "A new chapter. Care for the body that's carried you this far.";
      case "ADULT_MENSTRUATING":
        return "Track your cycle, learn your body, fuel it well.";
      default:
        return "Today's a great day to log how you're feeling.";
    }
  })();

  // Daily-rotating tip relevant to user's life stage. Refreshes every UTC
  // midnight — keeps the dashboard from looking frozen between sessions.
  const dailyTip = pickDailyTip(lifeStage);

  // Compute current cycle day from the user's most recent period log.
  // Shown to menstruating users only — not relevant for pregnancy/menopause.
  const isMenstruating =
    !isPregnant &&
    !isPostpartum &&
    (lifeStage === "ADULT_MENSTRUATING" ||
      lifeStage === "TRYING_TO_CONCEIVE" ||
      lifeStage === "PERIMENOPAUSE");
  const lastCycleStart = data?.lastCycleStart
    ? new Date(data.lastCycleStart)
    : null;
  const cycleDay = lastCycleStart
    ? Math.max(1, Math.floor(
        (Date.now() - lastCycleStart.getTime()) / 86_400_000,
      ) + 1)
    : null;
  const normalizedCycleDay = cycleDay ? ((cycleDay - 1) % 28) + 1 : null;
  const nextPeriodInDays = normalizedCycleDay
    ? Math.max(0, 28 - normalizedCycleDay + 1)
    : null;

  const sleepStr = formatSleep(data?.user?.sleepDuration);
  const moodStr = data?.user?.mood ?? null;
  const moveMins = data?.user?.movementDuration ?? null;

  // Metrics show only if real data exists. No fake trends, no fake percents.
  type Metric = {
    label: string;
    value: string;
    icon: typeof Moon;
    color: string;
    percent: number;
  };
  const METRICS: Metric[] = [];
  if (sleepStr) {
    METRICS.push({
      label: "Restful Sleep",
      value: sleepStr,
      icon: Moon,
      color: "bg-primary",
      percent: Math.min(
        (parseFloat(data?.user?.sleepDuration?.toString() || "0") / 10) * 100,
        100,
      ),
    });
  }
  if (moodStr) {
    METRICS.push({
      label: "Mood Today",
      value: moodStr,
      icon: Heart,
      color: "bg-secondary",
      percent: 100,
    });
  }
  if (moveMins != null && Number(moveMins) > 0) {
    METRICS.push({
      label: "Movement",
      value: `${moveMins} min`,
      icon: Move,
      color: "bg-accent",
      percent: Math.min((Number(moveMins) / 60) * 100, 100),
    });
  }
  const hasAnyMetrics = METRICS.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-3">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
            Welcome home,{" "}
            <span className="text-primary">
              {data?.user?.name?.split(" ")[0] || "friend"}
            </span>
            .
          </h1>
          <p className="text-muted-foreground text-lg font-medium opacity-80">
            {subtitle}
          </p>
          {/* Daily-rotating tip ribbon — different content every day */}
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-card border border-border/60 px-4 py-1.5 text-xs text-foreground/80 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Today
            </span>
            <span className="text-muted-foreground">·</span>
            <span>{dailyTip.en}</span>
          </div>
        </motion.div>

        {/* Progress Ring Card — pregnancy only */}
        {isPregnant && week > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card p-6 rounded-4xl border border-border flex items-center space-x-6 shadow-sm"
          >
            <div className="relative w-20 h-20">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-secondary/10 stroke-current"
                  strokeWidth="8"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                ></circle>
                <circle
                  className="text-secondary stroke-current transition-all duration-1000"
                  strokeWidth="8"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * progressPercent) / 100}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
                {progressPercent}%
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                Trimester {trimester}
              </p>
              <p className="text-lg font-bold text-foreground leading-tight">
                Week {week} of 40
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content (Left) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Live cycle phase strip — for menstruating users only.
              Different visual language from the big ring on /dashboard/cycle:
              horizontal wave bars with pulsing today-marker. */}
          {isMenstruating && (
            <CyclePhaseStrip
              cycleDay={normalizedCycleDay}
              nextPeriodInDays={nextPeriodInDays}
            />
          )}

          {/* Metric Bars — render only metrics with real user data */}
          {hasAnyMetrics ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {METRICS.map((metric, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={metric.label}
                  className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col justify-between h-40"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <metric.icon className="w-5 h-5 text-foreground/60" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      {metric.label}
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {metric.value}
                    </p>
                    <div className="w-full h-1.5 bg-muted rounded-full mt-3 overflow-hidden">
                      <div
                        className={`h-full ${metric.color} opacity-80 rounded-full transition-all duration-1000`}
                        style={{ width: `${metric.percent}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <Link
              href="/dashboard/wellness"
              className="block bg-card p-6 rounded-3xl border border-dashed border-border text-center hover:bg-accent/40 transition-colors"
            >
              <Sparkles className="w-8 h-8 text-primary/30 mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">
                Log today&apos;s sleep, mood, and movement
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Once you log a few days, your trends will show up here.
              </p>
            </Link>
          )}

          {/* Today's focus — life-stage-aware nudge, no fake personalization claims */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl"
          >
            <div className="relative z-10 space-y-5">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-7 h-7 text-secondary" />
                <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
                  Today&apos;s Focus
                </h2>
              </div>
              <p className="text-lg md:text-xl font-medium leading-normal opacity-95">
                {(() => {
                  if (isPregnant && week > 0) {
                    return `You're in week ${week} (trimester ${trimester}). Open your chat and ask what to eat or watch for this week — NutriMama answers in your context.`;
                  }
                  if (isPostpartum) {
                    return "Recovery, sleep, and feeding questions — ask the AI anything. We'll respond with India-specific guidance.";
                  }
                  if (lifeStage === "TRYING_TO_CONCEIVE") {
                    return "Ask about your fertile window, supplements (folate, iron), or what to track this cycle.";
                  }
                  if (lifeStage === "PERIMENOPAUSE" || lifeStage === "MENOPAUSE") {
                    return "Ask about hot flashes, sleep, bone health, or anything else you're navigating right now.";
                  }
                  return "Log your cycle, mood, or meals — then ask the AI anything about what you're noticing.";
                })()}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard/chat"
                  className="bg-white text-primary px-6 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-xl active:scale-95 text-sm"
                >
                  Open AI Chat
                </Link>
                <Link
                  href="/dashboard/nutrition"
                  className="bg-white/10 border border-white/30 text-white px-6 py-3 rounded-full font-bold hover:bg-white/20 transition-all text-sm"
                >
                  Nutrition Plan
                </Link>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          </motion.div>

          {/* Journey Calendar */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between md:flex-row flex-col gap-2 px-1">
              <h2 className="text-[26px] font-bold font-heading text-[#B8572A]">
                Your Journey Calendar
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-10 h-10 rounded-full bg-[#B8572A]/10 text-[#B8572A] flex items-center justify-center hover:bg-[#B8572A] hover:text-white transition-all shadow-sm cursor-pointer"
                  title="Add Event"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <Link
                  href="/dashboard/schedule"
                  className="text-sm font-bold bg-primary/10 border p-2 rounded-2xl text-[#B8572A] flex items-center hover:opacity-80 transition-opacity"
                >
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              {(data?.calendarEvents?.length
                ? data.calendarEvents.map(
                    (event: CalendarEvent) => ({
                      id: event.id,
                      dateStr: new Date(event.date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                        },
                      ),
                      dayStr: new Date(event.date).getDate(),
                      title: event.title,
                      time: event.timeString,
                      place: event.location,
                    }),
                  )
                : []
              ).map(
                (
                  event: {
                    id: string;
                    dateStr: string;
                    dayStr: number;
                    title: string;
                    time: string;
                    place: string | null;
                  },
                  i: number,
                ) => (
                  <div
                    key={event.id || i}
                    className="bg-primary/10  p-5 rounded-[2rem] border border-primary/5 flex items-center justify-between shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)] transition-all"
                  >
                    <div className="flex items-center">
                      <div className="text-center w-[60px]">
                        <p className="text-[10px] font-bold tracking-widest text-primary uppercase">
                          {event.dateStr}
                        </p>
                        <p className="text-2xl font-bold text-primary/90 leading-none mt-1">
                          {event.dayStr}
                        </p>
                      </div>
                      <div className="w-[1px] h-10 bg-primary mx-4"></div>
                      <div>
                        <h4 className="font-heading font-semibold text-lg text-primary">
                          {event.title}
                        </h4>
                        <p className="text-sm text-primary/80 font-medium mt-0.5">
                          {event.time} • {event.place}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {event.id && !event.id.startsWith("demo") && (
                        <button
                          onClick={async () => {
                            if (confirm("Remove this milestone?")) {
                              await deleteCalendarEvent(event.id);
                              router.refresh();
                            }
                          }}
                          className="p-3 rounded-xl hover:bg-red-500/10 text-red-500/60 hover:text-red-500 transition-colors"
                          title="Delete Milestone"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      )}
                      {(!event.id || event.id.startsWith("demo")) && (
                        <MoreVertical className="text-[#8B7C70] w-5 h-5 cursor-pointer hover:text-[#6D5A4D] transition-colors" />
                      )}
                    </div>
                  </div>
                ),
              )}
              {(!data?.calendarEvents || data.calendarEvents.length === 0) && (
                <div className="text-center py-10 bg-primary/5 rounded-[2rem] border border-dashed border-primary/20">
                  <CalendarIcon className="w-10 h-10 text-primary/20 mx-auto mb-3" />
                  <p className="text-sm font-medium text-primary/40">
                    No upcoming milestones. Click + to add one.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm text-center relative overflow-hidden group"
          >
            <div className="relative z-10 space-y-6">
              <div className="relative w-28 h-28 mx-auto">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
                <div className="relative w-full h-full bg-primary/10 rounded-full flex items-center justify-center text-4xl border-4 border-primary/20 shadow-lg text-primary overflow-hidden">
                  {data?.user?.name?.charAt(0) || "M"}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-heading">
                  {data?.user?.name || "Friend"}
                </h3>
                {(() => {
                  const tierKey: Tier = (data?.user?.tier as Tier) || "FREE";
                  const badge = TIER_BADGE[tierKey] ?? TIER_BADGE.FREE;
                  return (
                    <p
                      className={`text-xs font-semibold uppercase tracking-wider px-4 py-1 rounded-full inline-block mt-2 border ${badge.className}`}
                    >
                      {badge.label} Member
                    </p>
                  );
                })()}
              </div>
              <div className="grid grid-cols-2 divide-x divide-border pt-4">
                <div className="px-2">
                  {isPregnant && daysToBaby != null ? (
                    <>
                      <p className="text-2xl font-bold text-foreground">
                        {daysToBaby}
                      </p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                        Days to Baby
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-foreground">
                        {data?.reportsCount ?? 0}
                      </p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                        Reports
                      </p>
                    </>
                  )}
                </div>
                <div className="px-2">
                  <p className="text-2xl font-bold text-foreground">{xp}</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                    NutriMama XP
                  </p>
                </div>
              </div>
            </div>
            {/* BG decorative */}
            <div className="absolute top-0 right-0 w-full h-full bg-linear-to-b from-secondary/5 to-transparent"></div>
          </motion.div>

          {/* AI Chat shortcut — real, working feature */}
          <div className="bg-[#EEF1FF] dark:bg-card p-8 rounded-[2.5rem] border border-border/50 shadow-sm space-y-5">
            <div className="flex items-center space-x-2 text-[#4C5BB4]">
              <MessageSquare className="w-5 h-5 fill-current" />
              <h3 className="font-bold uppercase tracking-widest text-[11px]">
                Ask NutriMama
              </h3>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Cycle questions, pregnancy week-by-week, nutrition for your stage,
              or anything you&apos;d normally Google — ask it here. We answer
              in your context and flag anything urgent.
            </p>
            <Link
              href="/dashboard/chat"
              className="block text-center w-full bg-[#4C5BB4] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#4C5BB4]/20 hover:scale-[1.02] active:scale-95 transition-all text-sm"
            >
              Start a chat
            </Link>
          </div>

          {/* Community — honest "coming soon" */}
          <div className="bg-[#FAEED1] dark:bg-secondary/10 p-8 rounded-[2.5rem] border border-border/50 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-[#9A7B31]">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-widest text-[11px]">
                  Community
                </h3>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-[#9A7B31]/15 text-[#9A7B31] px-2 py-0.5 rounded-full">
                Coming soon
              </span>
            </div>
            <p className="text-[13px] text-[#9A7B31] font-medium leading-relaxed">
              Anonymous peer conversations, moderated by certified maternal
              health experts. We&apos;ll open this once we have a safe
              moderation layer in place.
            </p>
          </div>
        </div>
      </div>
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
