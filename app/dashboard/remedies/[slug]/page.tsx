// Condition detail page — full GhareLU / Ayurveda / Modern / Emergency tabs.

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CONDITIONS,
  CONDITIONS_BY_SLUG,
  CONDITIONS_BY_ID,
} from "@/lib/conditions";
import {
  MedicalContentGate,
  MedicalDisclaimerBanner,
} from "@/components/medical-content-gate";
import { ConditionDetailTabs } from "./condition-detail-tabs";
import { ChevronLeft, AlertTriangle, Phone } from "lucide-react";

// Pre-generate all 30 detail pages at build time — fast + SEO-friendly.
export function generateStaticParams() {
  return CONDITIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = CONDITIONS_BY_SLUG[slug];
  if (!c) return { title: "Not found — NutriMama" };
  return {
    title: `${c.name} — NutriMama`,
    description: c.summary,
  };
}

export default async function ConditionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const condition = CONDITIONS_BY_SLUG[slug];
  if (!condition) notFound();

  const redFlags = condition.emergency.filter((e) => e.severity === "RED");
  const yellowFlags = condition.emergency.filter((e) => e.severity === "YELLOW");

  const related = condition.relatedIds
    .map((id) => CONDITIONS_BY_ID[id])
    .filter(Boolean);

  return (
    <MedicalContentGate>
      <article className="max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-5">
        {/* Breadcrumb / back */}
        <Link
          href="/dashboard/remedies"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-4 h-4" />
          All remedies
        </Link>

        {/* Header */}
        <header className="space-y-3">
          <div className="flex items-start gap-3">
            <div
              className="text-3xl sm:text-5xl leading-none shrink-0"
              aria-hidden
            >
              {condition.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-heading text-xl sm:text-3xl font-bold text-foreground leading-tight break-words">
                {condition.name}
              </h1>
              {(condition.nameHi || condition.nameGu) && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                  {[condition.nameHi, condition.nameGu]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
            </div>
          </div>

          <p className="text-sm text-foreground/85 leading-relaxed">
            {condition.summary}
          </p>

          {condition.whoGetsIt && (
            <details className="rounded-2xl border border-border bg-card/40 p-3 text-sm">
              <summary className="cursor-pointer font-medium text-foreground/90">
                Who gets this?
              </summary>
              <div className="mt-2 text-foreground/80 whitespace-pre-line leading-relaxed">
                {condition.whoGetsIt}
              </div>
            </details>
          )}
        </header>

        {/* Disclaimer banner */}
        <MedicalDisclaimerBanner />

        {/* Red flag callout if present */}
        {redFlags.length > 0 && (
          <div className="rounded-2xl border border-red-300 dark:border-red-800/60 bg-red-50 dark:bg-red-950/30 p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-red-900 dark:text-red-200 font-bold">
              <AlertTriangle className="w-5 h-5" />
              <span>Red-flag signs — call a doctor</span>
            </div>
            <ul className="space-y-1.5 text-sm text-red-900/90 dark:text-red-100/90">
              {redFlags.map((e, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-red-500 select-none">🔴</span>
                  <span>{e.text}</span>
                </li>
              ))}
            </ul>
            <a
              href="tel:108"
              className="inline-flex items-center gap-2 mt-1 h-11 px-5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition"
            >
              <Phone className="w-4 h-4" />
              In emergency, call 108
            </a>
          </div>
        )}

        {/* Tabs */}
        <ConditionDetailTabs
          sections={condition.sections}
          yellowFlags={yellowFlags}
          redFlags={redFlags}
        />

        {/* Related */}
        {related.length > 0 && (
          <section className="space-y-2 pt-2">
            <h2 className="font-heading text-base font-bold text-foreground">
              Related conditions
            </h2>
            <div className="flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/dashboard/remedies/${r.slug}`}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-card border border-border hover:border-primary/30 text-sm transition"
                >
                  <span aria-hidden>{r.emoji}</span>
                  <span>{r.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </MedicalContentGate>
  );
}
