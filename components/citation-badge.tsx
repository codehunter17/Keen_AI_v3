"use client";

// Tiny attribution pill that backs up a clinical claim with a registered
// source. Use it inline next to nutrient targets, ANC guidance, fetal
// development paragraphs, BMI cutoffs, etc.
//
//   <CitationBadge source="FOGSI_2023" />
//   <CitationBadge source="ICMR_RDA_2020" variant="solid" />
//   <CitationGroup raw="Moore & Persaud 10th Ed; FOGSI 2023" />
//
// Why a component (not a free-form string):
//   - Consistent visual everywhere
//   - One place to add a hover tooltip with the long-form title
//   - Easy to globally re-style or hide later

import { CITATIONS, parseCitationString, type CitationKey, type Citation } from "@/lib/citations";

type Variant = "subtle" | "solid" | "outline";

const BODY_COLORS: Record<string, { bg: string; text: string; border: string; solidBg: string }> = {
  WHO: { bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800", solidBg: "bg-blue-600 text-white" },
  ICMR: { bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-700 dark:text-rose-300", border: "border-rose-200 dark:border-rose-800", solidBg: "bg-rose-600 text-white" },
  FOGSI: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800", solidBg: "bg-emerald-600 text-white" },
  ACOG: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-800 dark:text-emerald-200", border: "border-emerald-200 dark:border-emerald-800", solidBg: "bg-emerald-700 text-white" },
  MOORE_PERSAUD: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800", solidBg: "bg-amber-600 text-white" },
  IADPSG: { bg: "bg-violet-50 dark:bg-violet-950/40", text: "text-violet-700 dark:text-violet-300", border: "border-violet-200 dark:border-violet-800", solidBg: "bg-violet-600 text-white" },
  AIIMS: { bg: "bg-cyan-50 dark:bg-cyan-950/40", text: "text-cyan-700 dark:text-cyan-300", border: "border-cyan-200 dark:border-cyan-800", solidBg: "bg-cyan-600 text-white" },
  NFHS: { bg: "bg-slate-50 dark:bg-slate-900/40", text: "text-slate-700 dark:text-slate-300", border: "border-slate-200 dark:border-slate-700", solidBg: "bg-slate-700 text-white" },
};

export function CitationBadge({
  source,
  variant = "subtle",
  className = "",
}: {
  source: CitationKey;
  variant?: Variant;
  className?: string;
}) {
  // Widen to the interface so `url?` is reachable across variants.
  const c: Citation = CITATIONS[source];
  const colors = BODY_COLORS[c.body] ?? BODY_COLORS.WHO;

  const base = "inline-flex items-center gap-1 rounded-full text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap";
  const sized = "px-2.5 py-1";

  const visualClasses =
    variant === "solid"
      ? `${colors.solidBg}`
      : variant === "outline"
        ? `bg-transparent ${colors.text} border ${colors.border}`
        : `${colors.bg} ${colors.text} border ${colors.border}`;

  const inner = (
    <>
      <span aria-hidden>📘</span>
      <span>{c.label}</span>
    </>
  );

  return c.url ? (
    <a
      href={c.url}
      target="_blank"
      rel="noopener noreferrer"
      title={c.title}
      className={`${base} ${sized} ${visualClasses} hover:opacity-90 transition-opacity ${className}`}
    >
      {inner}
    </a>
  ) : (
    <span
      title={c.title}
      className={`${base} ${sized} ${visualClasses} ${className}`}
    >
      {inner}
    </span>
  );
}

/**
 * Group badge — accepts the legacy free-text "Moore & Persaud 10th Ed;
 * FOGSI 2023" strings from the fetal dataset and renders the matched
 * citation keys as a row of badges.
 */
export function CitationGroup({
  raw,
  variant = "subtle",
  className = "",
}: {
  raw: string | null | undefined;
  variant?: Variant;
  className?: string;
}) {
  const keys = parseCitationString(raw);
  if (keys.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {keys.map((k) => (
        <CitationBadge key={k} source={k} variant={variant} />
      ))}
    </div>
  );
}

/**
 * Source footer for clinical pages.
 * Renders as: "Based on FOGSI 2023 · ICMR 2020 · WHO 2016 · ACOG 2020 …"
 */
export function SourceFooter({
  sources,
  prefix = "Information based on",
  disclaimer = "This app provides health information only — not a substitute for clinical care. Always consult your OB/GYN for medical decisions.",
}: {
  sources: CitationKey[];
  prefix?: string;
  disclaimer?: string;
}) {
  return (
    <div className="rounded-2xl bg-muted/40 border border-border px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">
      <p>
        📋 <span className="font-medium text-foreground">{prefix}</span>{" "}
        {sources.map((k, i) => (
          <span key={k}>
            <span className="font-semibold">{CITATIONS[k].label}</span>
            {i < sources.length - 1 && " · "}
          </span>
        ))}
        {" guidelines."}
      </p>
      <p className="mt-1">{disclaimer}</p>
    </div>
  );
}
