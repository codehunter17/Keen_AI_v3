import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { selfcareForUser } from "@/lib/selfcare";
import type { LifeStage, CycleStage } from "@/lib/lifecycle";

export const metadata = { title: "Self-care · NutriMama" };

export default async function SelfcarePage() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) redirect("/auth/login");
  const u = await prisma.user.findUnique({
    where: { id: s.user.id },
    select: { lifeStage: true, cycleStage: true },
  });

  const tips = selfcareForUser({
    lifeStage: (u?.lifeStage as LifeStage | null) ?? undefined,
    cycleStage: (u?.cycleStage as CycleStage | null) ?? undefined,
  });

  const buckets = {
    MOVEMENT: tips.filter((t) => t.category === "MOVEMENT"),
    BREATH: tips.filter((t) => t.category === "BREATH"),
    NUTRITION: tips.filter((t) => t.category === "NUTRITION"),
    SLEEP: tips.filter((t) => t.category === "SLEEP"),
    MIND: tips.filter((t) => t.category === "MIND"),
    RITUAL: tips.filter((t) => t.category === "RITUAL"),
  };

  const labels: Record<keyof typeof buckets, { emoji: string; label: string }> = {
    MOVEMENT: { emoji: "🧘", label: "Movement" },
    BREATH: { emoji: "🌬️", label: "Breath" },
    NUTRITION: { emoji: "🍵", label: "Food rituals" },
    SLEEP: { emoji: "🌙", label: "Sleep" },
    MIND: { emoji: "🧠", label: "Mind" },
    RITUAL: { emoji: "🪔", label: "Daily rituals" },
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <header>
        <h1 className="font-heading text-3xl text-primary">Self-care</h1>
        <p className="text-sm text-muted-foreground">
          Small, doable rituals tuned to where you are right now. Pick one a day.
        </p>
      </header>

      {(Object.keys(buckets) as (keyof typeof buckets)[]).map((k) => {
        const items = buckets[k];
        if (items.length === 0) return null;
        return (
          <section key={k}>
            <h2 className="font-heading text-lg text-primary flex items-center gap-2">
              <span>{labels[k].emoji}</span>
              <span>{labels[k].label}</span>
            </h2>
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              {items.map((t) => (
                <div key={t.id} className="rounded-2xl bg-card lift p-4">
                  <div className="flex items-start justify-between mb-1.5">
                    <p className="font-medium">{t.title}</p>
                    <span className="chip text-[10px] py-0.5">{t.durationMin} min</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.body}</p>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
