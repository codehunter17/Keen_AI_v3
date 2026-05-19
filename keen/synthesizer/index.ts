/**
 * Synthesizer — Module 3.
 *
 * Weekly: reads recent observations + clinical cases, asks the LLM to cluster
 * them into Opportunities (gaps, frictions, ML candidates, content needs).
 *
 * Output rows land in keen_opportunity with status=open. Proposer picks them
 * up from there.
 */

import { prisma } from "@/lib/prisma";
import { llm, safeJson } from "../llm";
import type { ApprovalTier } from "../policy";

const SYSTEM_PROMPT = `You are Keen, an autonomous brain that improves a women's health app.
You read anonymized user observations and doctor case summaries and surface concrete improvement opportunities.

You NEVER suggest changes to:
- payment / billing
- authentication / sessions
- DPDP consent records
- emergency RED-triage flow

Return STRICT JSON with shape:
{
  "opportunities": [
    {
      "title": "string",
      "rationale": "string — why this matters, what users feel",
      "tags": ["string"],
      "impact": 1-5,
      "effort": 1-5,
      "suggestedTier": "L1" | "L2" | "L3" | "L4"
    }
  ]
}

Aim for 3-7 opportunities, ranked by impact/effort. Be specific. No fluff.`;

export interface SynthesizeResult {
  opportunitiesCreated: number;
  provider: string;
}

export async function synthesize(): Promise<SynthesizeResult> {
  const sinceMs = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const since = new Date(sinceMs);

  const [observations, cases] = await Promise.all([
    prisma.keenObservation.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.keenClinicalCase.findMany({
      where: { occurredAt: { gte: since } },
      orderBy: { occurredAt: "desc" },
      take: 25,
      include: {
        teacher: { select: { displayName: true, specialty: true } },
      },
    }),
  ]);

  if (observations.length === 0 && cases.length === 0) {
    return { opportunitiesCreated: 0, provider: "skipped" };
  }

  const userPrompt = buildPrompt(observations, cases);
  const result = await llm({
    system: SYSTEM_PROMPT,
    user: userPrompt,
    format: "json",
    temperature: 0.3,
  });

  type Parsed = {
    opportunities?: Array<{
      title: string;
      rationale: string;
      tags?: string[];
      impact?: number;
      effort?: number;
      suggestedTier?: ApprovalTier;
    }>;
  };
  const parsed = safeJson<Parsed>(result.text);
  const items = parsed?.opportunities ?? [];

  let created = 0;
  for (const item of items) {
    if (!item.title || !item.rationale) continue;
    await prisma.keenOpportunity.create({
      data: {
        detectedAt: new Date(),
        title: item.title.slice(0, 200),
        rationale: item.rationale,
        evidenceObservationIds: observations.map((o) => o.id),
        evidenceCaseIds: cases.map((c) => c.id),
        tags: item.tags ?? [],
        impact: clampInt(item.impact, 1, 5, 3),
        effort: clampInt(item.effort, 1, 5, 3),
        suggestedTier: item.suggestedTier ?? "L2",
        status: "open",
      },
    });
    created++;
  }

  return { opportunitiesCreated: created, provider: result.provider };
}

function clampInt(v: unknown, min: number, max: number, fallback: number): number {
  const n = typeof v === "number" ? Math.round(v) : fallback;
  if (Number.isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function buildPrompt(
  observations: Array<{ summary: string; tags: string[]; signalCount: number }>,
  cases: Array<{
    inputs: unknown;
    decision: unknown;
    reasoning: string | null;
    teacher: { displayName: string; specialty: string };
  }>,
) {
  const obsBlock = observations
    .map(
      (o, i) =>
        `OBS#${i + 1} [${o.tags.join(",") || "no-tags"}] ${o.signalCount} signals — ${o.summary}`,
    )
    .join("\n");
  const caseBlock = cases
    .map(
      (c, i) =>
        `CASE#${i + 1} ${c.teacher.specialty} (${c.teacher.displayName}) — inputs=${JSON.stringify(c.inputs).slice(0, 300)} decision=${JSON.stringify(c.decision).slice(0, 200)}${c.reasoning ? ` reasoning="${c.reasoning.slice(0, 200)}"` : ""}`,
    )
    .join("\n");

  return `Recent observations:\n${obsBlock || "(none)"}\n\nRecent clinician cases:\n${caseBlock || "(none)"}\n\nSurface concrete improvement opportunities for the app. Return JSON.`;
}
