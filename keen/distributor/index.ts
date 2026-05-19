/**
 * Distributor — Module 8.
 *
 * Growth loop: i18n suggestions, SEO copy drafts, PWA install nudges,
 * app-store listing assets, referral mechanics. All output is delivered as
 * Proposals so the operator can approve before anything ships.
 *
 * Distributor never touches user-facing content directly — it ALWAYS goes
 * through the standard Synthesizer→Proposer→Executor pipeline like every
 * other Keen change.
 */

import { prisma } from "@/lib/prisma";
import { llm, safeJson } from "../llm";
import type { ApprovalTier } from "../policy";

const SYSTEM_PROMPT = `You are Keen's Distributor module — you find growth + reach opportunities for a women's health app.
Focus: localization (Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia), SEO content gaps, PWA install prompts, referral mechanics, app-store listing improvements, AND social media publishing (YouTube videos, Instagram reels, Instagram image posts).

Hard constraint: NEVER suggest changes to payments, auth, DPDP consent, or RED-triage flow.

For social-media opportunities, include BOTH a platform tag and a kind tag so the dispatcher can route them:
  - platform tag: "youtube" or "instagram"
  - kind tag: "video" (youtube), "reel" (instagram), or "image" (instagram)
  - ALWAYS include the tag "media" so they're routed to the publishing pipeline.

Return STRICT JSON with shape:
{
  "opportunities": [
    {
      "title": "string — for media items, this becomes the topic the generator works from",
      "rationale": "string",
      "tags": ["string"],
      "impact": 1-5,
      "effort": 1-5,
      "suggestedTier": "L1" | "L2" | "L3" | "L4"
    }
  ]
}

Aim for 2-5 opportunities per run. Be concrete. Media items should be L2 or L3 (never L1) since they publish to public platforms.`;

export interface DistributeResult {
  opportunitiesCreated: number;
  provider: string;
}

export async function distribute(): Promise<DistributeResult> {
  // Look at recent observations tagged with anything traffic / locale / install related.
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const observations = await prisma.keenObservation.findMany({
    where: {
      createdAt: { gte: since },
      OR: [
        { tags: { hasSome: ["drop_off", "install", "locale", "share"] } },
        { summary: { contains: "language", mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 25,
  });

  const userPrompt = `Recent reach/growth-tagged observations:
${observations.map((o, i) => `OBS#${i + 1} [${o.tags.join(",")}] ${o.summary}`).join("\n") || "(none — propose universal growth wins)"}

Surface concrete reach + localization opportunities. Return JSON.`;

  const result = await llm({
    system: SYSTEM_PROMPT,
    user: userPrompt,
    format: "json",
    temperature: 0.4,
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
        evidenceCaseIds: [],
        tags: ["growth", ...(item.tags ?? [])],
        impact: clamp(item.impact, 1, 5, 3),
        effort: clamp(item.effort, 1, 5, 3),
        suggestedTier: item.suggestedTier ?? "L2",
        status: "open",
      },
    });
    created++;
  }

  return { opportunitiesCreated: created, provider: result.provider };
}

function clamp(v: unknown, min: number, max: number, fallback: number): number {
  const n = typeof v === "number" ? Math.round(v) : fallback;
  if (Number.isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}
