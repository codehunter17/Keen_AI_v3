/**
 * Knowledge — Module 7.
 *
 * Keen's permanent memory. Backed by pgvector for semantic retrieval plus the
 * structured keen_* tables for case-based reasoning.
 *
 * v0 surfaces a thin retrieval API. The Synthesizer + Proposer call into
 * `recall()` to fetch the top-K similar observations + cases for a query.
 */

import { prisma } from "@/lib/prisma";
import type { ClinicalCase, Observation } from "../types";

export interface RecallQuery {
  /** Free-text query. */
  q: string;
  /** Max results per source. */
  k?: number;
  /** Optional tag filter for observations. */
  tags?: string[];
}

export interface RecallResult {
  observations: Observation[];
  cases: ClinicalCase[];
}

/**
 * Fetch supporting evidence for a query.
 *
 * v0 uses keyword + tag matching on Postgres. v1 will swap in pgvector once
 * we have embeddings flowing through every signal. The interface won't change.
 */
export async function recall(query: RecallQuery): Promise<RecallResult> {
  const k = query.k ?? 5;

  const obsRows = await prisma.keenObservation.findMany({
    where: {
      OR: [
        { summary: { contains: query.q, mode: "insensitive" } },
        query.tags && query.tags.length > 0
          ? { tags: { hasSome: query.tags } }
          : undefined,
      ].filter(Boolean) as object[],
    },
    orderBy: { createdAt: "desc" },
    take: k,
  });

  const caseRows = await prisma.keenClinicalCase.findMany({
    where: {
      OR: [
        { reasoning: { contains: query.q, mode: "insensitive" } },
      ],
    },
    orderBy: { occurredAt: "desc" },
    take: k,
    include: { teacher: { select: { specialty: true, displayName: true } } },
  });

  const observations: Observation[] = obsRows.map((r) => ({
    id: r.id,
    windowStart: r.windowStart,
    windowEnd: r.windowEnd,
    summary: r.summary,
    tags: r.tags,
    signalCount: r.signalCount,
    signalBreakdown: r.signalBreakdown as Observation["signalBreakdown"],
    confidence: r.confidence,
    sourceSignalIds: r.sourceSignalIds,
  }));

  const cases: ClinicalCase[] = caseRows.map((r) => ({
    id: r.id,
    teacherId: r.teacherId,
    teacherSpecialty: r.teacher.specialty,
    occurredAt: r.occurredAt,
    inputs: r.inputs as ClinicalCase["inputs"],
    differential: (r.differential as string[] | null) ?? undefined,
    decision: r.decision as ClinicalCase["decision"],
    reasoning: r.reasoning ?? undefined,
  }));

  return { observations, cases };
}
