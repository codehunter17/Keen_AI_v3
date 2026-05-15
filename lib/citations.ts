// Citation registry. Every clinical claim in the app should reference
// one of these sources via <CitationBadge source="FOGSI_2023" />.
//
// Why a registry instead of inline strings:
//   1. Single source of truth — update the URL/title once
//   2. Audit trail — easy to grep "what's based on FOGSI" or "what's based
//      on ICMR" across the codebase
//   3. Consistent badge labels in the UI
//   4. Future-proof for "View all citations" / regulatory submission

export interface Citation {
  /** Short label shown inside the badge, e.g. "FOGSI 2023" */
  label: string;
  /** Long-form title for tooltip / footer attribution */
  title: string;
  /** Issuing body */
  body: "WHO" | "ICMR" | "FOGSI" | "ACOG" | "IADPSG" | "MOORE_PERSAUD" | "AIIMS" | "NFHS";
  /** Year */
  year: number;
  /** Optional URL to the actual document */
  url?: string;
}

export const CITATIONS = {
  ICMR_RDA_2020: {
    label: "ICMR-NIN 2020",
    title: "ICMR-NIN Recommended Dietary Allowances for Indians, 2020",
    body: "ICMR",
    year: 2020,
    url: "https://www.nin.res.in/RDA_short_Report_2020.html",
  },
  WHO_ANC_2016: {
    label: "WHO ANC 2016",
    title: "WHO Recommendations on Antenatal Care for a Positive Pregnancy Experience, 2016",
    body: "WHO",
    year: 2016,
    url: "https://www.who.int/publications/i/item/9789241549912",
  },
  FOGSI_2023: {
    label: "FOGSI 2023",
    title: "Federation of Obstetric and Gynaecological Societies of India — Practice Recommendations 2023",
    body: "FOGSI",
    year: 2023,
  },
  ACOG_2020: {
    label: "ACOG 2020",
    title: "American College of Obstetricians and Gynecologists — Practice Bulletins 2020",
    body: "ACOG",
    year: 2020,
  },
  ACOG_PB: {
    label: "ACOG PB",
    title: "American College of Obstetricians and Gynecologists Practice Bulletins (compendium)",
    body: "ACOG",
    year: 2024,
  },
  MOORE_PERSAUD_10: {
    label: "Moore & Persaud 10th Ed",
    title: "Moore & Persaud — The Developing Human: Clinically Oriented Embryology (10th Edition)",
    body: "MOORE_PERSAUD",
    year: 2016,
  },
  NFHS_5: {
    label: "NFHS-5",
    title: "National Family Health Survey India, 2019-21",
    body: "NFHS",
    year: 2021,
    url: "https://rchiips.org/nfhs/NFHS-5Reports/India.pdf",
  },
  IADPSG_2010: {
    label: "IADPSG 2010",
    title: "International Association of Diabetes and Pregnancy Study Groups — Diagnostic Criteria 2010",
    body: "IADPSG",
    year: 2010,
  },
} as const satisfies Record<string, Citation>;

export type CitationKey = keyof typeof CITATIONS;

/** All citations as an array — for "View all sources" footers. */
export const ALL_CITATIONS = Object.entries(CITATIONS).map(([key, c]) => ({
  key: key as CitationKey,
  ...c,
}));

/**
 * Resolve a free-text citation string from the fetal dataset
 * (e.g. "Moore & Persaud 10th Ed; FOGSI 2023") into structured keys.
 * Returns the keys that matched, in order of appearance.
 */
export function parseCitationString(raw: string | null | undefined): CitationKey[] {
  if (!raw) return [];
  const found: CitationKey[] = [];
  const seen = new Set<CitationKey>();
  for (const [key, c] of Object.entries(CITATIONS) as [CitationKey, Citation][]) {
    if (seen.has(key)) continue;
    // Match the short label or a fragment of the title
    const tag = key.toLowerCase().replace(/_/g, " ");
    const label = c.label.toLowerCase();
    if (raw.toLowerCase().includes(label) || raw.toLowerCase().includes(tag)) {
      found.push(key);
      seen.add(key);
    }
  }
  return found;
}
