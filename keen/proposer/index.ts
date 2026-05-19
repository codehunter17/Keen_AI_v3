/**
 * Proposer — Module 4.
 *
 * Takes each open Opportunity and drafts a concrete Proposal: spec, expected
 * code diff (best-effort, may be a description rather than a unified diff in
 * v0), risk, rollback plan.
 *
 * Forbidden paths are filtered BEFORE the LLM ever sees the opportunity, then
 * the produced diff is filtered AGAIN before the proposal is persisted.
 * Belt and braces — the firewall is the most important code in the brain.
 */

import { prisma } from "@/lib/prisma";
import { llm, safeJson } from "../llm";
import {
  KEEN_FORBIDDEN_PATHS,
  evaluatePaths,
  type ApprovalTier,
} from "../policy";
import { notifyOperator, proposalDashboardUrl } from "../notify";

const SYSTEM_PROMPT = `You are Keen, drafting a concrete proposal for one improvement opportunity.
You produce specs the operator can approve in one read.

Hard constraints — these paths are FORBIDDEN. Do not propose touching them:
${KEEN_FORBIDDEN_PATHS.map((p) => `  - ${p}`).join("\n")}

Return STRICT JSON with shape:
{
  "title": "string (under 100 chars)",
  "spec": "markdown — what changes and why",
  "filesTouched": ["relative path", ...],
  "tablesTouched": ["TableName", ...],
  "diffDescription": "plain English description of the code edits (NOT a unified diff)",
  "risk": "what could go wrong + mitigation",
  "rollbackPlan": "concrete steps to revert",
  "expectedImpact": "what improves and by how much",
  "tier": "L1" | "L2" | "L3" | "L4"
}

Be specific. Cite file paths. Keep spec under 400 words.`;

export interface ProposeResult {
  opportunityId: string;
  proposalId: string | null;
  status: "drafted" | "blocked" | "skipped";
  reason?: string;
}

export async function proposeForOpportunity(
  opportunityId: string,
): Promise<ProposeResult> {
  const opportunity = await prisma.keenOpportunity.findUnique({
    where: { id: opportunityId },
  });
  if (!opportunity) {
    return {
      opportunityId,
      proposalId: null,
      status: "skipped",
      reason: "opportunity not found",
    };
  }
  if (opportunity.status !== "open") {
    return {
      opportunityId,
      proposalId: null,
      status: "skipped",
      reason: `opportunity status=${opportunity.status}`,
    };
  }

  const userPrompt = `Opportunity:
title: ${opportunity.title}
rationale: ${opportunity.rationale}
tags: ${opportunity.tags.join(", ")}
impact: ${opportunity.impact}/5  effort: ${opportunity.effort}/5
suggestedTier: ${opportunity.suggestedTier}

Draft the proposal as JSON.`;

  const result = await llm({
    system: SYSTEM_PROMPT,
    user: userPrompt,
    format: "json",
    temperature: 0.2,
  });

  type Draft = {
    title?: string;
    spec?: string;
    filesTouched?: string[];
    tablesTouched?: string[];
    diffDescription?: string;
    risk?: string;
    rollbackPlan?: string;
    expectedImpact?: string;
    tier?: ApprovalTier;
  };
  const draft = safeJson<Draft>(result.text);

  if (!draft || !draft.title || !draft.spec) {
    return {
      opportunityId,
      proposalId: null,
      status: "skipped",
      reason: "LLM returned no usable draft",
    };
  }

  const filesTouched = draft.filesTouched ?? [];
  const policy = evaluatePaths(filesTouched);
  if (!policy.allowed) {
    await prisma.keenOpportunity.update({
      where: { id: opportunityId },
      data: { status: "dismissed" },
    });
    return {
      opportunityId,
      proposalId: null,
      status: "blocked",
      reason: `Forbidden paths: ${policy.forbiddenMatches?.join(", ")}`,
    };
  }

  const tier = (draft.tier ?? opportunity.suggestedTier) as ApprovalTier;
  const proposal = await prisma.keenProposal.create({
    data: {
      opportunityId,
      title: draft.title.slice(0, 200),
      spec: draft.spec,
      diff: draft.diffDescription ?? "",
      filesTouched,
      tablesTouched: draft.tablesTouched ?? [],
      tier,
      risk: draft.risk ?? "Not specified by LLM.",
      rollbackPlan: draft.rollbackPlan ?? "Revert the merge commit.",
      expectedImpact: draft.expectedImpact ?? "Not specified by LLM.",
      status: tier === "L1" ? "approved" : "awaiting_approval",
    },
  });

  await prisma.keenOpportunity.update({
    where: { id: opportunityId },
    data: { status: "proposed" },
  });

  if (tier !== "L1") {
    await notifyOperator({
      body: `Keen has a ${tier} proposal: "${proposal.title}"`,
      dashboardUrl: proposalDashboardUrl(proposal.id),
    });
  }

  return { opportunityId, proposalId: proposal.id, status: "drafted" };
}

export async function proposeAllOpen(limit = 5): Promise<ProposeResult[]> {
  const opportunities = await prisma.keenOpportunity.findMany({
    where: { status: "open" },
    orderBy: [{ impact: "desc" }, { effort: "asc" }],
    take: limit,
  });
  const results: ProposeResult[] = [];
  for (const opp of opportunities) {
    results.push(await proposeForOpportunity(opp.id));
  }
  return results;
}
