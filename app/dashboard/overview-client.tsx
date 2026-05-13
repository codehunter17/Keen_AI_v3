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
  Smile,
  Plus,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteCalendarEvent, type CalendarEvent } from "@/lib/actions/calendar";
import { CreateEventModal } from "@/components/calendar/create-event-modal";
import { Loader } from "@/components/ui/loader";

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
    } else if (!isLoading && data && !data.user?.pregnancyStage) {
      router.push("/onboarding");
    }
  }, [session, sessionLoading, data, isLoading, router]);

  if (isLoading || sessionLoading) {
    return <Loader />;
  }

  const week = data?.user?.pregnancyWeek || 1;
  const progressPercent = Math.min(Math.round((week / 40) * 100), 100);
  const trimester = week <= 12 ? 1 : week <= 26 ? 2 : 3;

  const dueDate = data?.user?.dueDate ? new Date(data.user.dueDate) : null;
  const daysToBaby = dueDate
    ? Math.max(
        0,
        Math.ceil(
          (dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
        ),
      )
    : "--";

  const xp =
    (data?.reportsCount || 0) * 20 + week * 5 + (data?.todayLog ? 10 : 0);

  const formatSleep = (duration?: string | number | null) => {
    const d = parseFloat(duration?.toString() || "8");
    const hours = Math.floor(d);
    const minutes = Math.round((d - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  const METRICS = [
    {
      label: "Restful Sleep",
      value: formatSleep(data?.user?.sleepDuration),
      icon: Moon,
      color: "bg-primary",
      trend: "+12%",
      percent: Math.min(
        (parseFloat(data?.user?.sleepDuration?.toString() || "8") / 10) * 100,
        100,
      ),
    },
    {
      label: "Emotional Balance",
      value: data?.user?.mood || "Refreshed",
      icon: Heart,
      color: "bg-secondary",
      trend: "Steady",
      percent: 85,
    },
    {
      label: "Gentle Movement",
      value: `${data?.user?.movementDuration || 30} min`,
      icon: Move,
      color: "bg-accent",
      trend: "Active",
      percent: Math.min(
        (parseInt(data?.user?.movementDuration?.toString() || "30") / 60) * 100,
        100,
      ),
    },
  ];

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
              {data?.user?.name?.split(" ")[0] || "Mama"}
            </span>
            .
          </h1>
          <p className="text-muted-foreground text-lg font-medium opacity-80">
            You&apos;re {week} weeks along. Take a deep breath—today is about
            nurturing both you and your little one.
          </p>
        </motion.div>

        {/* Progress Ring Card */}
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content (Left) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Metric Bars */}
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
                  <span className="text-[10px] font-bold text-primary/60 bg-primary/5 px-2 py-1 rounded-full uppercase">
                    {metric.trend}
                  </span>
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

          {/* Personalized Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary text-white rounded-3xl p-4 md:p-8  relative overflow-hidden shadow-2xl"
          >
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-8 h-8 text-secondary" />
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
                    Personalized NutriMama Insights
                  </h2>
                </div>
                <p className="text-2xl font-medium leading-normal italic opacity-95">
                  &quot;Based on your hydration levels and recent activity, we
                  recommend a vitamin-rich smoothie today to maintain your
                  energy for the third trimester.&quot;
                </p>
                <Link
                  href="/dashboard/nutrition"
                  className="bg-white text-primary px-6 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-xl active:scale-95"
                >
                  Get Nutrition Recipe
                </Link>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 md:p-8 border border-white/20 self-center">
                <p className="text-md font-bold uppercase underline underline-offset-2 text-white mb-2 opacity-80">
                  Nutrition Focus
                </p>
                <p className="text-lg font-medium leading-relaxed">
                  Increase iron and magnesium intake this week to support muscle
                  development and reduce nightly leg cramps.
                </p>
              </div>
            </div>
            {/* Abstract shape */}
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
                  {data?.user?.name || "Mami-to-be"}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-white bg-primary/5 px-4 py-1 rounded-full inline-block mt-2 border border-primary/10">
                  NutriMama {data?.user?.tier || "FREE"} Member
                </p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-border pt-4">
                <div className="px-2">
                  <p className="text-2xl font-bold text-foreground">
                    {daysToBaby}
                  </p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                    Days to Baby
                  </p>
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

          {/* Community Hub Card */}
          <div className="bg-[#EEF1FF] dark:bg-card p-8 rounded-[2.5rem] border border-border/50 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 text-[#4C5BB4]">
              <MessageCircle className="w-5 h-5 fill-current" />
              <h3 className="font-bold uppercase tracking-widest text-[11px]">
                Community Hub
              </h3>
            </div>

            <div className="space-y-4">
              <div className="bg-white dark:bg-muted/30 p-4 rounded-2xl rounded-tl-none shadow-sm text-sm leading-relaxed">
                <div className="flex items-center space-x-2 mb-2 text-[10px] font-bold text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                    S
                  </div>
                  <span>Sarah M.</span>
                </div>
                Anyone else feeling extra nesting urges this week?
              </div>
              <div className="bg-primary/95 text-white p-4 rounded-2xl rounded-tr-none shadow-md text-sm leading-relaxed ml-6">
                Yes! Just organized the nursery drawer for the third time!
              </div>
            </div>

            <Link
              href="/dashboard/chat"
              className="block text-center w-full bg-[#4C5BB4] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#4C5BB4]/20 hover:scale-[1.02] active:scale-95 transition-all text-sm"
            >
              Join Discussion
            </Link>
          </div>

          {/* Expert Concierge */}
          <div className="bg-[#FAEED1] dark:bg-secondary/10 p-8 rounded-[2.5rem] border border-border/50 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 text-[#9A7B31]">
              <Smile className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-widest text-[11px]">
                Expert Concierge
              </h3>
            </div>
            <p className="text-[13px] text-[#9A7B31] font-medium leading-relaxed italic">
              Connect with a certified midwife or lactation consultant
              instantly.
            </p>
            <div className="flex -space-x-3 overflow-hidden p-2">
              {[
                "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=100&h=100&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=100&h=100",
                "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=100&h=100",
              ].map((src, i) => (
                <div
                  key={i}
                  className="relative inline-block h-10 w-10 rounded-full ring-2 ring-white overflow-hidden shadow-sm"
                >
                  <Image
                    src={src}
                    alt={`Expert ${i + 1}`}
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </div>
              ))}
              <div className="flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white bg-secondary/80 text-white text-[10px] font-bold shadow-sm backdrop-blur-sm">
                +4
              </div>
            </div>
            <Link
              href="/dashboard/chat"
              className="w-full bg-[#603601] text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-[#603601]/20 hover:scale-[1.02] active:scale-95 transition-all text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Start Chat</span>
            </Link>
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
