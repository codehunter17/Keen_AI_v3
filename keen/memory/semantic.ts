/**
 * Semantic memory — pgvector(384) cosine retrieval per user.
 *
 * Cosine distance in pgvector is `<=>` and ranges 0..2. Cosine *similarity* is
 * `1 - (a <=> b)` and ranges -1..1. We filter at similarity > 0.7 (distance < 0.3).
 *
 * All vectors are produced by keen/embeddings.ts so dimensions match (384).
 */

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { embed, toPgVectorLiteral } from "../embeddings";

export interface SemanticHit {
  id: string;
  summary: string;
  similarity: number;
  tags: string[];
  sessionId: string | null;
  createdAt: Date;
}

export interface SaveSemanticInput {
  pseudonym: string;
  summary: string;
  sessionId?: string;
  turnCount?: number;
  tags?: string[];
  /** Optional precomputed vector — saves an embedding call. */
  vector?: number[];
}

export async function saveSemanticMemory(input: SaveSemanticInput): Promise<{ id: string }> {
  const vec =
    input.vector ?? (await embed(input.summary).then((r) => r.vector));
  const literal = toPgVectorLiteral(vec as number[]);

  const rows = await prisma.$queryRaw<Array<{ id: string }>>(Prisma.sql`
    INSERT INTO keen_semantic_memory
      (id, pseudonym, summary, embedding, tags, "sessionId", "turnCount", "createdAt")
    VALUES
      (gen_random_uuid(),
       ${input.pseudonym},
       ${input.summary},
       ${literal}::vector,
       ${input.tags ?? []}::text[],
       ${input.sessionId ?? null},
       ${input.turnCount ?? 0},
       NOW())
    RETURNING id
  `);

  return { id: rows[0]?.id ?? "" };
}

/**
 * Retrieve semantic memories similar to `query`, filtered by user, ordered by
 * descending similarity, capped at `limit`. Only returns hits at similarity > 0.7
 * (distance < 0.3) per the locked architecture decision.
 */
export async function recallSemantic(opts: {
  pseudonym: string;
  query: string;
  limit?: number;
  threshold?: number;
}): Promise<SemanticHit[]> {
  const { pseudonym, query } = opts;
  const limit = opts.limit ?? 5;
  const threshold = opts.threshold ?? 0.7;
  const maxDistance = 1 - threshold;

  const { vector } = await embed(query);
  const literal = toPgVectorLiteral(vector);

  const rows = await prisma.$queryRaw<
    Array<{
      id: string;
      summary: string;
      tags: string[];
      sessionId: string | null;
      createdAt: Date;
      distance: number;
    }>
  >(Prisma.sql`
    SELECT id,
           summary,
           tags,
           "sessionId",
           "createdAt",
           (embedding <=> ${literal}::vector) AS distance
    FROM keen_semantic_memory
    WHERE pseudonym = ${pseudonym}
      AND embedding IS NOT NULL
      AND (embedding <=> ${literal}::vector) < ${maxDistance}
    ORDER BY embedding <=> ${literal}::vector
    LIMIT ${limit}
  `);

  return rows.map((r) => ({
    id: r.id,
    summary: r.summary,
    tags: r.tags,
    sessionId: r.sessionId,
    createdAt: r.createdAt,
    similarity: 1 - Number(r.distance),
  }));
}

export async function purgeSemantic(pseudonym: string): Promise<void> {
  await prisma.$executeRaw(
    Prisma.sql`DELETE FROM keen_semantic_memory WHERE pseudonym = ${pseudonym}`,
  );
}
