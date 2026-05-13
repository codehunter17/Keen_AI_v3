// Server component — shows earned + locked badges. Drop into dashboard.

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getMyBadges, checkAndAwardBadges } from "@/lib/actions/badges";
import { badgeRarityClass } from "@/lib/badges";

export async function BadgeShelf() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) return null;

  // Run a check pass so badges feel "live" — auto-awards anything new
  // since last visit. Wrapped so a half-migrated schema can't crash
  // the dashboard.
  try {
    await checkAndAwardBadges();
  } catch {
    /* swallow */
  }

  let all: Awaited<ReturnType<typeof getMyBadges>> = [];
  try {
    all = await getMyBadges();
  } catch {
    return null;
  }
  const earned = all.filter((b) => b.earned);
  const locked = all.filter((b) => !b.earned).slice(0, 4);

  return (
    <section className="rounded-2xl bg-card lift p-5 sm:p-6">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Achievements
          </p>
          <p className="font-heading text-lg mt-0.5">
            {earned.length} of {all.length} earned
          </p>
        </div>
        <a
          href="/dashboard/badges"
          className="text-xs text-primary underline"
        >
          See all
        </a>
      </div>

      {/* Earned strip */}
      {earned.length > 0 ? (
        <div className="flex flex-wrap gap-2.5">
          {earned.slice(0, 8).map((b) => (
            <div
              key={b.id}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${badgeRarityClass(b.rarity)}`}
              title={b.description}
            >
              <span className="text-base leading-none">{b.emoji}</span>
              <span className="text-xs font-medium">{b.title}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No badges yet. Log a meal, finish onboarding, or take a PCOS screen to start.
        </p>
      )}

      {/* Up next */}
      {locked.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/60">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            Up next
          </p>
          <ul className="space-y-1.5">
            {locked.map((b) => (
              <li key={b.id} className="flex items-start gap-2.5 text-sm">
                <span className="text-base leading-none opacity-30">{b.emoji}</span>
                <div>
                  <p className="font-medium opacity-80">{b.title}</p>
                  <p className="text-xs text-muted-foreground">{b.unlockHint}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
