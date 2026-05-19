/**
 * Certified-source registry.
 *
 * Trust hierarchy as locked with the operator:
 *   clinician (real doctor)        1.8
 *   ICMR-NIN / FOGSI (India bodies) 1.4
 *   WHO / ACOG / NICE (intl bodies) 1.2
 *   Cochrane systematic reviews     1.1
 *   PubMed (peer-reviewed papers)   0.8 (modulated +/- by citation count)
 *   open datasets / textbooks       0.4
 *
 * Sources without an API surface (FOGSI / ICMR-NIN are mostly PDFs) are still
 * registered here so operator-uploaded findings can attach to them.
 */

import { prisma } from "@/lib/prisma";

export type SourceKind =
  | "pubmed"
  | "who"
  | "icmr_nin"
  | "fogsi"
  | "cochrane"
  | "acog"
  | "nice"
  | "other";

export const TRUST_BY_KIND: Record<SourceKind, number> = {
  pubmed: 0.8,
  who: 1.2,
  icmr_nin: 1.4,
  fogsi: 1.4,
  cochrane: 1.1,
  acog: 1.2,
  nice: 1.2,
  other: 0.4,
};

/** Default sources Keen seeds itself with on first run. */
export const SEED_SOURCES: Array<{
  name: string;
  url: string;
  kind: SourceKind;
}> = [
  { name: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/", kind: "pubmed" },
  { name: "WHO Publications", url: "https://www.who.int/publications", kind: "who" },
  { name: "ICMR-NIN", url: "https://www.nin.res.in/", kind: "icmr_nin" },
  { name: "FOGSI", url: "https://www.fogsi.org/", kind: "fogsi" },
  { name: "Cochrane Library", url: "https://www.cochranelibrary.com/", kind: "cochrane" },
  { name: "ACOG", url: "https://www.acog.org/", kind: "acog" },
  { name: "NICE Guidelines", url: "https://www.nice.org.uk/", kind: "nice" },
];

export async function ensureSeedSources(): Promise<{ created: number }> {
  let created = 0;
  for (const seed of SEED_SOURCES) {
    const existing = await prisma.keenScholarSource.findUnique({
      where: { name: seed.name },
    });
    if (existing) continue;
    await prisma.keenScholarSource.create({
      data: {
        name: seed.name,
        url: seed.url,
        kind: seed.kind,
        defaultTrustWeight: TRUST_BY_KIND[seed.kind],
        isActive: true,
      },
    });
    created++;
  }
  return { created };
}

export async function getSourceByKind(kind: SourceKind) {
  return prisma.keenScholarSource.findFirst({
    where: { kind, isActive: true },
    orderBy: { createdAt: "asc" },
  });
}
