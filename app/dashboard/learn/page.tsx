import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getRecommendedContent } from "@/lib/actions/content";
import { pickDaily, DAILY_FACTS } from "@/lib/daily";
import { CONDITIONS } from "@/lib/conditions";

export const metadata = { title: "Learn · NutriMama" };

export default async function LearnPage() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) redirect("/auth/sign-in");

  const items = await getRecommendedContent({ limit: 24 });
  // Today's "did you know" — rotates daily.
  const fact = pickDaily(DAILY_FACTS);

  return (
    <main className="p-4 sm:p-6 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="font-heading text-3xl text-primary">Learn</h1>
        <p className="text-sm text-muted-foreground">
          Hand-picked, doctor-reviewed articles and videos personalized to your
          stage of life.
        </p>
      </header>

      {/* Daily fact card — different fact every day */}
      <div className="mb-6 rounded-2xl bg-linear-to-br from-primary/10 via-secondary/10 to-gold/5 border border-primary/15 p-5">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-primary mb-2">
          Did you know · today
        </p>
        <h2 className="font-heading text-xl text-foreground leading-tight">
          {fact.title}
        </h2>
        <p className="text-sm text-foreground/80 mt-2 leading-relaxed">
          {fact.body}
        </p>
        <p className="text-[10px] text-muted-foreground mt-3 uppercase tracking-widest">
          Source · {fact.source}
        </p>
      </div>

      {/* Health Library — NutriMama's 30 curated condition guides.
          Pulled from lib/conditions.ts so we always have rich, scannable
          content regardless of whether external articles are seeded. */}
      <section className="mb-8 space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-heading text-xl text-foreground">Health library</h2>
          <Link
            href="/dashboard/remedies"
            className="text-xs font-semibold text-primary hover:underline"
          >
            See all 30 →
          </Link>
        </div>
        <p className="text-xs text-muted-foreground -mt-1.5">
          Gharelu home remedies, Ayurvedic options, and modern guidance —
          cited and reviewed.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CONDITIONS.slice(0, 9).map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/remedies/${c.slug}`}
              className="group rounded-2xl border border-border bg-card hover:bg-card/80 hover:border-primary/30 transition p-4 flex gap-3 active:scale-[0.99]"
            >
              <div className="text-3xl shrink-0 leading-none mt-0.5" aria-hidden>
                {c.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-sm font-bold text-foreground truncate">
                  {c.name}
                </h3>
                {c.nameHi && (
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    {c.nameHi}
                  </p>
                )}
                <p className="text-xs text-muted-foreground/90 mt-1 line-clamp-2 leading-relaxed">
                  {c.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <header className="mb-3">
        <h2 className="font-heading text-xl text-foreground">
          Articles &amp; videos
        </h2>
        <p className="text-xs text-muted-foreground">
          Hand-picked for your stage.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-card lift p-8 text-center">
          <p className="text-sm text-muted-foreground">
            We&apos;re curating content for your stage. Check back soon.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <a
              key={it.id}
              href={`/dashboard/learn/${it.slug}`}
              className="group rounded-2xl bg-card lift overflow-hidden hover:lift-strong transition-shadow"
            >
              {it.thumbnailUrl && (
                <div className="aspect-video bg-muted overflow-hidden">
                  <img
                    src={it.thumbnailUrl}
                    alt=""
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex flex-wrap gap-1 mb-2">
                  {it.topics.slice(0, 2).map((t) => (
                    <span key={t} className="chip text-[10px] py-0.5">{t}</span>
                  ))}
                  {it.parentalGuidance && (
                    <span className="chip text-[10px] py-0.5 bg-secondary/20 text-secondary-foreground border-secondary/30">
                      Parent co-watch
                    </span>
                  )}
                </div>
                <h2 className="font-heading text-lg text-foreground group-hover:text-primary transition-colors">
                  {it.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {it.summary}
                </p>
                {it.source && (
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    Source: {it.source}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
