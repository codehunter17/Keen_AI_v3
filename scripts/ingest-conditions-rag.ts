/**
 * One-shot ingestion: embed every section of every condition into
 * the KnowledgeChunk table for RAG retrieval.
 *
 * Usage (from my-app/):
 *   npx tsx scripts/ingest-conditions-rag.ts
 *   npx tsx scripts/ingest-conditions-rag.ts --force   # re-embed unchanged chunks too
 *
 * Idempotent: a sha256 of the content is stored per chunk. On subsequent
 * runs we skip rows whose contentHash hasn't changed (unless --force).
 *
 * Run after every change to lib/conditions.ts. Requires DATABASE_URL +
 * at least one embedding provider (HF_TOKEN or GOOGLE_GENERATIVE_AI_API_KEY)
 * in .env for non-fallback quality.
 */

import { createHash } from "node:crypto";
import { PrismaClient, Prisma } from "@prisma/client";
import { CONDITIONS } from "../lib/conditions";
import { generateEmbedding } from "../lib/embeddings";

const prisma = new PrismaClient();

const SECTION_KEYS = [
  "overview",
  "gharelu",
  "ayurveda",
  "modern",
  "emergency",
] as const;
type SectionKey = (typeof SECTION_KEYS)[number];

const FORCE = process.argv.includes("--force");

function sha256(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

function buildEmergencyText(
  emergencies: { severity: string; text: string }[],
): string {
  if (emergencies.length === 0) return "";
  const red = emergencies.filter((e) => e.severity === "RED");
  const yellow = emergencies.filter((e) => e.severity === "YELLOW");
  const parts: string[] = [];
  if (red.length) {
    parts.push(
      "RED-FLAG SIGNS (call doctor / 108):\n" +
        red.map((e) => `- ${e.text}`).join("\n"),
    );
  }
  if (yellow.length) {
    parts.push(
      "INVESTIGATE WITHIN A FEW DAYS:\n" +
        yellow.map((e) => `- ${e.text}`).join("\n"),
    );
  }
  return parts.join("\n\n");
}

function chunkContent(c: (typeof CONDITIONS)[number], key: SectionKey): string {
  if (key === "emergency") return buildEmergencyText(c.emergency);
  return c.sections[key as Exclude<SectionKey, "emergency">];
}

function inferCitations(content: string): string[] {
  const citations = new Set<string>();
  if (/ICMR/i.test(content)) citations.add("ICMR-NIN 2020");
  if (/FOGSI/i.test(content)) citations.add("FOGSI 2023");
  if (/WHO/i.test(content)) citations.add("WHO Guidelines");
  if (/ACOG/i.test(content)) citations.add("ACOG Practice Bulletin");
  if (/IADPSG/i.test(content)) citations.add("IADPSG");
  if (/AIIMS/i.test(content)) citations.add("AIIMS");
  if (/Moore.{0,5}Persaud/i.test(content)) citations.add("Moore & Persaud");
  return Array.from(citations);
}

async function main() {
  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  console.log(
    `[ingest] ${CONDITIONS.length} conditions × ${SECTION_KEYS.length} sections = ${
      CONDITIONS.length * SECTION_KEYS.length
    } potential chunks. force=${FORCE}`,
  );

  for (const c of CONDITIONS) {
    for (const key of SECTION_KEYS) {
      const content = chunkContent(c, key).trim();
      if (!content) {
        skipped++;
        continue;
      }
      const hash = sha256(content);

      const existing = await prisma.knowledgeChunk.findUnique({
        where: {
          conditionSlug_sectionType: {
            conditionSlug: c.slug,
            sectionType: key,
          },
        },
        select: { id: true, contentHash: true },
      });

      if (existing && existing.contentHash === hash && !FORCE) {
        skipped++;
        continue;
      }

      try {
        const embedding = await generateEmbedding(content);
        const citations = inferCitations(content);

        if (existing) {
          await prisma.knowledgeChunk.update({
            where: { id: existing.id },
            data: {
              conditionName: c.name,
              content,
              contentHash: hash,
              citations,
            },
          });
          // Embedding column is Unsupported in Prisma — write via raw SQL.
          await prisma.$executeRaw`
            UPDATE knowledge_chunk
            SET embedding = ${`[${embedding.join(",")}]`}::vector(384)
            WHERE id = ${existing.id}
          `;
          updated++;
          process.stdout.write(`. ${c.slug}/${key} updated\n`);
        } else {
          const row = await prisma.knowledgeChunk.create({
            data: {
              conditionSlug: c.slug,
              conditionName: c.name,
              sectionType: key,
              content,
              contentHash: hash,
              citations,
            },
            select: { id: true },
          });
          await prisma.$executeRaw`
            UPDATE knowledge_chunk
            SET embedding = ${`[${embedding.join(",")}]`}::vector(384)
            WHERE id = ${row.id}
          `;
          inserted++;
          process.stdout.write(`+ ${c.slug}/${key} inserted\n`);
        }
      } catch (err) {
        failed++;
        console.error(`! ${c.slug}/${key} failed:`, err);
      }
    }
  }

  console.log(
    `\n[ingest] done. inserted=${inserted} updated=${updated} skipped=${skipped} failed=${failed}`,
  );

  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("[ingest] fatal:", err);
  void prisma.$disconnect();
  process.exit(1);
});

// Avoid an unused-namespace lint complaint on environments that strip type-only imports.
type _PrismaUnused = Prisma.JsonValue;
