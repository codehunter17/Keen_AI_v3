/**
 * Trust-weighted semantic retrieval over KeenScholarFinding.
 *
 * FinalScore = cosineSimilarity * trustWeight
 *   (Cosine sim is 1 - pgvector distance. Trust weights run roughly 0.3-1.8,
 *   so FinalScore is intentionally NOT normalized to [0,1] — the threshold of
 *   0.7 is treated as an absolute usefulness cutoff.)
 *
 * On every retrieval we bump `lastCitedAt` for the returned rows so the 30-day
 * pruning job knows these are still in use.
 */

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { embed, toPgVectorLiteral } from "../embeddings";

export interface ScholarHit {
  id: string;
  topic: string;
  outcome: string;
  intervention: string | null;
  studyUrl: string;
  trustWeight: number;
  similarity: number;
  finalScore: number;
  sourceName: string;
  tags: string[];
}

export async function retrieveTrustWeighted(opts: {
  query: string;
  limit?: number;
  threshold?: number;
}): Promise<ScholarHit[]> {
  const limit = opts.limit ?? 8;
  const threshold = opts.threshold ?? 0.7;

  const { vector } = await embed(opts.query);
  const literal = toPgVectorLiteral(vector);

  const rows = await prisma.$queryRaw<
    Array<{
      id: string;
      topic: string;
      outcome: string;
      intervention: string | null;
      studyUrl: string;
      trustWeight: number;
      tags: string[];
      sourceName: string;
      distance: number;
    }>
  >(Prisma.sql`
    SELECT f.id,
           f.topic,
           f.outcome,
           f.intervention,
           f."studyUrl",
           f."trustWeight",
           f.tags,
           s.name AS "sourceName",
           (f.embedding <=> ${literal}::vector) AS distance
    FROM keen_scholar_finding f
    JOIN keen_scholar_source s ON s.id = f."sourceId"
    WHERE f.embedding IS NOT NULL
      AND f.status = 'active'
      AND s."isActive" = true
      AND (1 - (f.embedding <=> ${literal}::vector)) * f."trustWeight" >= ${threshold}
    ORDER BY (1 - (f.embedding <=> ${literal}::vector)) * f."trustWeight" DESC
    LIMIT ${limit * 3}
  `);

  const hits: ScholarHit[] = rows
    .map((r) => {
      const similarity = 1 - Number(r.distance);
      const finalScore = similarity * Number(r.trustWeight);
      return {
        id: r.id,
        topic: r.topic,
        outcome: r.outcome,
        intervention: r.intervention,
        studyUrl: r.studyUrl,
        trustWeight: Number(r.trustWeight),
        similarity,
        finalScore,
        sourceName: r.sourceName,
        tags: r.tags,
      };
    })
    .filter((h) => h.finalScore >= threshold)
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, limit);

  if (hits.length > 0) {
    await prisma.keenScholarFinding.updateMany({
      where: { id: { in: hits.map((h) => h.id) } },
      data: { lastCitedAt: new Date(), citationCount: { increment: 1 } },
    });
  }

  return hits;
}
