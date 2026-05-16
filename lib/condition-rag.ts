// Retrieval-Augmented Generation over the 30-condition knowledge base.
//
// Given a user's chat message, we:
//   1. Embed the message
//   2. Cosine-similarity search against KnowledgeChunk rows
//   3. Return top-k chunks with citation labels
//
// The chat route injects these into the system prompt as grounded
// context — turning the generic LLM into a NutriMama-specific advisor.
//
// Failure mode: if no chunks have been ingested yet (fresh DB), or the
// pgvector query errors, we return [] silently. The chat still works,
// just without KB grounding.

import "server-only";
import { prisma } from "@/lib/prisma";
import { generateEmbedding } from "@/lib/embeddings";

export interface RagChunk {
  conditionSlug: string;
  conditionName: string;
  sectionType: string;
  content: string;
  citations: string[];
  similarity: number;
}

interface RawRow {
  conditionSlug: string;
  conditionName: string;
  sectionType: string;
  content: string;
  citations: string[];
  distance: number;
}

/**
 * Retrieve the top-k most similar KnowledgeChunk rows for a user query.
 * k defaults to 4 — enough to cover related conditions without flooding
 * the prompt. Similarity threshold avoids dragging in unrelated content
 * when the user asks something off-topic.
 */
export async function retrieveRelevantChunks(
  query: string,
  opts: { k?: number; minSimilarity?: number } = {},
): Promise<RagChunk[]> {
  const k = opts.k ?? 4;
  const minSimilarity = opts.minSimilarity ?? 0.35;

  if (!query || query.trim().length < 3) return [];

  let queryEmbedding: number[];
  try {
    queryEmbedding = await generateEmbedding(query);
  } catch (err) {
    console.warn("[condition-rag] embedding failed, skipping retrieval:", err);
    return [];
  }

  const vectorLiteral = `[${queryEmbedding.join(",")}]`;

  try {
    // Cosine distance via pgvector <=> operator. Smaller = more similar.
    const rows = await prisma.$queryRaw<RawRow[]>`
      SELECT
        "conditionSlug",
        "conditionName",
        "sectionType",
        "content",
        "citations",
        (embedding <=> ${vectorLiteral}::vector(384)) AS distance
      FROM knowledge_chunk
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> ${vectorLiteral}::vector(384)
      LIMIT ${k}
    `;

    return rows
      .map((r) => ({
        conditionSlug: r.conditionSlug,
        conditionName: r.conditionName,
        sectionType: r.sectionType,
        content: r.content,
        citations: r.citations ?? [],
        similarity: 1 - Number(r.distance),
      }))
      .filter((c) => c.similarity >= minSimilarity);
  } catch (err) {
    console.warn("[condition-rag] pgvector query failed:", err);
    return [];
  }
}

/**
 * Render top-k chunks as a system-prompt fragment the LLM can read.
 * Caller is responsible for prepending its own framing. Output is plain
 * text, capped at ~6KB to leave room for the rest of the prompt.
 */
export function chunksToSystemPromptContext(chunks: RagChunk[]): string {
  if (chunks.length === 0) return "";

  const MAX_CHARS = 6000;
  const lines: string[] = [
    "",
    "── NUTRIMAMA KNOWLEDGE BASE (use this to ground your answer) ──",
    "",
  ];

  for (const c of chunks) {
    const header = `## ${c.conditionName} — ${c.sectionType.toUpperCase()}`;
    const cites =
      c.citations.length > 0 ? `_Sources: ${c.citations.join(", ")}_` : "";
    const body = c.content.slice(0, 1800);
    const block = [header, cites, body].filter(Boolean).join("\n");
    const projected = lines.join("\n").length + block.length;
    if (projected > MAX_CHARS) break;
    lines.push(block);
    lines.push("");
  }

  lines.push("── END KB ──");
  lines.push("");
  lines.push(
    "Rules: prefer KB content over your own training. Cite condition names inline like (see: Endometriosis). If KB content contradicts your training, the KB wins. Always end with a brief disclaimer to consult a doctor.",
  );

  return lines.join("\n");
}

/**
 * Convenience: one call to embed + retrieve + render the prompt fragment.
 */
export async function buildRagContext(query: string): Promise<{
  promptFragment: string;
  chunks: RagChunk[];
}> {
  const chunks = await retrieveRelevantChunks(query);
  return {
    promptFragment: chunksToSystemPromptContext(chunks),
    chunks,
  };
}
