/**
 * Media dispatcher.
 *
 * Bridges the standard approval pipeline to the media pipeline:
 *   1. Operator approves a KeenProposal whose underlying Opportunity is
 *      tagged "media" (set by Distributor's opportunity generator).
 *   2. This dispatcher reads the proposal + opportunity, infers platform
 *      and kind from tags, and calls runMediaPipeline().
 *   3. Marks the proposal `shipped` with externalUrl populated.
 *
 * Never publishes from a proposal that is not status="approved".
 */

import { prisma } from "@/lib/prisma";
import { runMediaPipeline, type RunPipelineInput } from "./pipeline";

const MEDIA_TAG = "media";
const PLATFORM_TAGS = ["youtube", "instagram"] as const;
const KIND_TAGS = ["video", "reel", "image"] as const;

export interface DispatchResult {
  proposalId: string;
  status: "dispatched" | "skipped" | "failed";
  feedId?: string | null;
  externalUrl?: string | null;
  detail?: string;
}

export async function dispatchMediaProposal(
  proposalId: string,
): Promise<DispatchResult> {
  const proposal = await prisma.keenProposal.findUnique({
    where: { id: proposalId },
    include: { opportunity: true },
  });
  if (!proposal) {
    return { proposalId, status: "skipped", detail: "proposal not found" };
  }
  if (proposal.status !== "approved") {
    return {
      proposalId,
      status: "skipped",
      detail: `proposal status=${proposal.status}, expected approved`,
    };
  }

  const tags = proposal.opportunity.tags ?? [];
  if (!tags.includes(MEDIA_TAG)) {
    return { proposalId, status: "skipped", detail: "not a media proposal" };
  }

  const platform =
    PLATFORM_TAGS.find((p) => tags.includes(p)) ?? "instagram";
  const kind = KIND_TAGS.find((k) => tags.includes(k)) ?? "reel";

  const input: RunPipelineInput = {
    platform,
    kind,
    topic: proposal.opportunity.title,
    context: proposal.opportunity.rationale,
    proposalId: proposal.id,
    privacyStatus: "private", // operator can flip to public after eyeballing
  };

  try {
    const result = await runMediaPipeline(input);
    await prisma.keenProposal.update({
      where: { id: proposalId },
      data: {
        status: "shipped",
        shippedAt: new Date(),
        prUrl: result.externalUrl,
      },
    });
    return {
      proposalId,
      status: result.status === "published" ? "dispatched" : "failed",
      feedId: result.feedId,
      externalUrl: result.externalUrl,
      detail: result.detail,
    };
  } catch (err) {
    return {
      proposalId,
      status: "failed",
      detail: err instanceof Error ? err.message : "dispatcher error",
    };
  }
}

export async function dispatchAllApprovedMedia(
  limit = 5,
): Promise<DispatchResult[]> {
  const approved = await prisma.keenProposal.findMany({
    where: {
      status: "approved",
      opportunity: { tags: { has: MEDIA_TAG } },
    },
    orderBy: { approvedAt: "asc" },
    take: limit,
    select: { id: true },
  });
  const results: DispatchResult[] = [];
  for (const p of approved) {
    results.push(await dispatchMediaProposal(p.id));
  }
  return results;
}
