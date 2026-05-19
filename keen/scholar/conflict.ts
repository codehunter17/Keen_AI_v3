/**
 * Conflict scanner.
 *
 * For each finding, finds candidates that:
 *   - share an intervention tag or text similarity > 0.8
 *   - have a different outcome direction (positive / null / negative)
 *
 * Candidate pairs go to an LLM judge for a yes/no contradiction call. Only
 * confirmed conflicts persist as KeenScholarConflict rows.
 *
 * Designed to run weekly — opinionated about not flooding the operator with
 * borderline disagreements.
 */

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { llm, safeJson } from "../llm";

const SYSTEM_PROMPT = `You judge whether two clinical findings contradict each other.

Two findings A and B will be shown. They share a topic and intervention. Decide whether they reach incompatible conclusions about effect direction (improves vs. no effect vs. worsens).

Return STRICT JSON:
{
  "contradicts": true | false,
  "reason": "one sentence"
}

Be conservative — only mark contradicts=true when the disagreement is direct.`;

export interface ConflictScanResult {
  pairsConsidered: number;
  conflictsCreated: number;
}

export async function scanForConflicts(): Promise<ConflictScanResult> {
  const findings = await prisma.keenScholarFinding.findMany({
    where: { status: "active" },
    select: {
      id: true,
      intervention: true,
      outcome: true,
      summary: true,
      tags: true,
    },
    take: 500,
    orderBy: { createdAt: "desc" },
  });

  const interventionBuckets = new Map<string, typeof findings>();
  for (const f of findings) {
    const key = (f.intervention ?? "").trim().toLowerCase();
    if (!key) continue;
    const bucket = interventionBuckets.get(key) ?? [];
    bucket.push(f);
    interventionBuckets.set(key, bucket);
  }

  let pairsConsidered = 0;
  let conflictsCreated = 0;

  for (const [, bucket] of interventionBuckets) {
    if (bucket.length < 2) continue;
    for (let i = 0; i < bucket.length; i++) {
      for (let j = i + 1; j < bucket.length; j++) {
        const a = bucket[i];
        const b = bucket[j];
        pairsConsidered++;

        // Skip if a conflict row already exists either way.
        const existing = await prisma.keenScholarConflict.findFirst({
          where: {
            OR: [
              { findingAId: a.id, findingBId: b.id },
              { findingAId: b.id, findingBId: a.id },
            ],
          },
          select: { id: true },
        });
        if (existing) continue;

        const judgement = await judgeConflict(a.summary, b.summary);
        if (!judgement.contradicts) continue;

        await prisma.keenScholarConflict.create({
          data: {
            findingAId: a.id,
            findingBId: b.id,
            reason: judgement.reason,
            status: "open",
          },
        });
        await prisma.$executeRaw(Prisma.sql`
          UPDATE keen_scholar_finding
          SET status = 'conflicting'
          WHERE id IN (${a.id}, ${b.id})
        `);
        conflictsCreated++;
      }
    }
  }

  return { pairsConsidered, conflictsCreated };
}

async function judgeConflict(
  a: string,
  b: string,
): Promise<{ contradicts: boolean; reason: string }> {
  const result = await llm({
    system: SYSTEM_PROMPT,
    user: `Finding A: ${a}\n\nFinding B: ${b}\n\nReturn JSON.`,
    format: "json",
    temperature: 0,
  });
  type Parsed = { contradicts?: boolean; reason?: string };
  const parsed = safeJson<Parsed>(result.text);
  return {
    contradicts: Boolean(parsed?.contradicts),
    reason: parsed?.reason ?? "no reason provided",
  };
}
