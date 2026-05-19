/**
 * Paper → KeenScholarFinding ingest pipeline.
 *
 * Stages:
 *   1. LLM extracts structured PICO (population, intervention, comparator,
 *      outcome) + effect size + p-value from the abstract.
 *   2. Embed the structured summary (384-dim) for semantic retrieval.
 *   3. Upsert by (sourceId, externalId) to make ingestion idempotent.
 *
 * Trust weight is the source's default, modulated by recency (newer +/-, 2
 * years older -> -0.1 down to 0.3 floor) and crude journal-name heuristics.
 */

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { llm, safeJson } from "../llm";
import { embed, toPgVectorLiteral } from "../embeddings";
import type { HarvestedPaper } from "./pubmed";
import { TRUST_BY_KIND, type SourceKind } from "./sources";

const SYSTEM_PROMPT = `You extract structured PICO claims from biomedical abstracts.

Return STRICT JSON, no prose:
{
  "topic": "short 3-6 word topic — main subject + condition",
  "population": "who was studied",
  "intervention": "what was tested",
  "comparator": "what it was compared against (or null)",
  "outcome": "what changed and by how much — single sentence",
  "effectSize": "string with the magnitude (e.g. 'RR 0.78', 'OR 1.4', '18% improvement') or null",
  "pValue": "string with the p-value if reported (e.g. 'p<0.001') or null",
  "tags": ["3-6 short lowercase tags"]
}

If the abstract is not a research finding (review, editorial, case report with no quantitative outcome), return null fields with topic="non-research".`;

const HIGH_TIER_JOURNALS = [
  "lancet",
  "nejm",
  "new england journal",
  "bmj",
  "jama",
  "nature medicine",
  "cell",
];

export interface IngestResult {
  pmid: string;
  status: "saved" | "skipped" | "failed";
  findingId?: string;
  detail?: string;
}

export async function ingestPaper(
  paper: HarvestedPaper,
  source: { id: string; defaultTrustWeight: number; kind: SourceKind | string },
): Promise<IngestResult> {
  const llmResult = await llm({
    system: SYSTEM_PROMPT,
    user: `Title: ${paper.title}\nJournal: ${paper.journal}\nYear: ${paper.year ?? "unknown"}\n\nAbstract:\n${paper.abstract}\n\nReturn JSON.`,
    format: "json",
    temperature: 0,
  });

  type Extracted = {
    topic?: string;
    population?: string | null;
    intervention?: string | null;
    comparator?: string | null;
    outcome?: string | null;
    effectSize?: string | null;
    pValue?: string | null;
    tags?: string[];
  };

  const ex = safeJson<Extracted>(llmResult.text);
  if (!ex || !ex.topic || ex.topic === "non-research" || !ex.outcome) {
    return {
      pmid: paper.pmid,
      status: "skipped",
      detail: "no extractable research claim",
    };
  }

  const summary = composeSummary(paper, ex);
  const { vector } = await embed(summary);
  const trustWeight = scoreTrust(source, paper);

  const literal = toPgVectorLiteral(vector);

  try {
    const rows = await prisma.$queryRaw<Array<{ id: string }>>(Prisma.sql`
      INSERT INTO keen_scholar_finding
        (id, "sourceId", topic, population, intervention, comparator, outcome,
         "effectSize", "pValue", "studyUrl", "externalId", "trustWeight",
         summary, embedding, tags, "citationCount", status, "lastCitedAt", "createdAt")
      VALUES
        (gen_random_uuid(),
         ${source.id},
         ${ex.topic},
         ${ex.population ?? null},
         ${ex.intervention ?? null},
         ${ex.comparator ?? null},
         ${ex.outcome},
         ${ex.effectSize ?? null},
         ${ex.pValue ?? null},
         ${paper.url},
         ${paper.pmid},
         ${trustWeight},
         ${summary},
         ${literal}::vector,
         ${ex.tags ?? []}::text[],
         0,
         'active',
         NOW(),
         NOW())
      ON CONFLICT ("sourceId", "externalId") DO UPDATE
        SET summary = EXCLUDED.summary,
            embedding = EXCLUDED.embedding,
            "trustWeight" = EXCLUDED."trustWeight",
            tags = EXCLUDED.tags,
            outcome = EXCLUDED.outcome,
            "effectSize" = EXCLUDED."effectSize",
            "pValue" = EXCLUDED."pValue",
            status = 'active',
            "lastCitedAt" = NOW()
      RETURNING id
    `);
    return { pmid: paper.pmid, status: "saved", findingId: rows[0]?.id };
  } catch (err) {
    return {
      pmid: paper.pmid,
      status: "failed",
      detail: err instanceof Error ? err.message : "db error",
    };
  }
}

function composeSummary(paper: HarvestedPaper, ex: NonNullable<ReturnType<typeof safeJson>>): string {
  const e = ex as Record<string, unknown>;
  const segs = [
    `Topic: ${e.topic}`,
    e.population ? `Population: ${e.population}` : null,
    e.intervention ? `Intervention: ${e.intervention}` : null,
    e.comparator ? `Comparator: ${e.comparator}` : null,
    `Outcome: ${e.outcome}`,
    e.effectSize ? `Effect: ${e.effectSize}` : null,
    e.pValue ? `p: ${e.pValue}` : null,
    paper.journal ? `Source: ${paper.journal}${paper.year ? ` (${paper.year})` : ""}` : null,
  ].filter(Boolean);
  return segs.join(" | ");
}

function scoreTrust(
  source: { defaultTrustWeight: number; kind: SourceKind | string },
  paper: HarvestedPaper,
): number {
  let trust = source.defaultTrustWeight ?? TRUST_BY_KIND.other;

  // Recency: -0.05 per year beyond 2 years old, down to a 0.3 floor.
  if (paper.year) {
    const ageYears = new Date().getFullYear() - paper.year;
    if (ageYears > 2) {
      trust -= Math.min(0.5, (ageYears - 2) * 0.05);
    }
  }

  // Journal heuristic: +0.15 for top-tier journals, capped at 1.0 absolute floor anyway.
  const journalLower = paper.journal.toLowerCase();
  if (HIGH_TIER_JOURNALS.some((j) => journalLower.includes(j))) {
    trust += 0.15;
  }

  return Math.max(0.3, Math.min(1.5, Number(trust.toFixed(2))));
}
