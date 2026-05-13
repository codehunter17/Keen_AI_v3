// Live stat strip for the homepage. Reads aggregate counts from the DB
// and renders them. Numbers are intentionally rounded to the nearest 10
// so we don't expose tiny counts in early days — and they're cached for
// 1 hour via `revalidate` so the strip updates throughout the day without
// hammering the database on every visit.
//
// Server component — no client JS shipped.

import { prisma } from "@/lib/prisma";
import { startOfDay } from "date-fns";

export const revalidate = 3600; // 1 hour ISR cache

// Round down to the nearest 10 / 100 so day-zero counts don't read awkwardly
// (e.g. "3 women" feels small; "10+" feels honest without overclaiming).
function roundFloor(n: number, bucket: number): number {
  return Math.floor(n / bucket) * bucket;
}

async function fetchStats() {
  try {
    const [users, reports, chatsToday, cycleLogs] = await Promise.all([
      prisma.user.count(),
      prisma.report.count({ where: { aiAnalysis: { not: null } } }),
      prisma.chatMessage.count({
        where: { role: "user", createdAt: { gte: startOfDay(new Date()) } },
      }),
      prisma.cycleLog.count(),
    ]);
    return { users, reports, chatsToday, cycleLogs };
  } catch {
    // DB hiccup — render a graceful zero state. Better than 500'ing the
    // entire landing page.
    return { users: 0, reports: 0, chatsToday: 0, cycleLogs: 0 };
  }
}

function format(n: number, bucket: number): string {
  if (n < bucket) return `${bucket}+`;
  const rounded = roundFloor(n, bucket);
  if (rounded >= 1000) return `${(rounded / 1000).toFixed(1).replace(/\.0$/, "")}k+`;
  return `${rounded}+`;
}

export async function LiveStatsStrip() {
  const s = await fetchStats();

  const items: { label: string; value: string }[] = [
    { label: "Indian women onboard", value: format(s.users, 10) },
    { label: "AI chats today", value: format(s.chatsToday, 10) },
    { label: "Cycles tracked", value: format(s.cycleLogs, 10) },
    { label: "Reports analysed", value: format(s.reports, 10) },
  ];

  return (
    <section className="border-y border-border/60 bg-card/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {items.map((it) => (
            <div key={it.label} className="text-center">
              <p className="font-heading text-3xl sm:text-4xl text-primary tracking-tight">
                {it.value}
              </p>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-semibold text-muted-foreground mt-1">
                {it.label}
              </p>
            </div>
          ))}
        </div>
        <p className="text-center text-[10px] text-muted-foreground/70 mt-4 uppercase tracking-widest">
          Live · updated hourly · DPDP-compliant aggregates
        </p>
      </div>
    </section>
  );
}
