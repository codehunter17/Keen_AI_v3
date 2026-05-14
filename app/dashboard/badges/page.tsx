import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getMyBadges, checkAndAwardBadges } from "@/lib/actions/badges";
import { badgeRarityClass } from "@/lib/badges";
import { format } from "date-fns";

export const metadata = { title: "Achievements · NutriMama" };

export default async function BadgesPage() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) redirect("/auth/sign-in");
  await checkAndAwardBadges().catch(() => {});
  const all = await getMyBadges();
  const earned = all.filter((b) => b.earned);
  const locked = all.filter((b) => !b.earned);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 w-full">
      <header>
        <h1 className="font-heading text-3xl text-primary">Achievements</h1>
        <p className="text-sm text-muted-foreground">
          {earned.length} of {all.length} unlocked. Each one stands for a real
          habit, not just a tap.
        </p>
      </header>

      {earned.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Earned
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {earned.map((b) => (
              <div
                key={b.id}
                className={`rounded-2xl p-5 ${badgeRarityClass(b.rarity)}`}
              >
                <div className="text-3xl mb-2">{b.emoji}</div>
                <p className="font-heading text-lg">{b.title}</p>
                <p className="mt-1 text-sm">{b.description}</p>
                {b.awardedAt && (
                  <p className="mt-2 text-[11px] opacity-70">
                    Earned {format(new Date(b.awardedAt), "dd MMM yyyy")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {locked.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Locked · {locked.length}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {locked.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl bg-muted/40 border border-dashed border-border p-5"
              >
                <div className="text-3xl mb-2 grayscale opacity-30">{b.emoji}</div>
                <p className="font-heading text-lg opacity-70">{b.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {b.unlockHint}
                </p>
                <span className="mt-3 inline-block chip text-[10px]">
                  {b.rarity.toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
