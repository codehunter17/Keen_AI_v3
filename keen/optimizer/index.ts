/**
 * Recursive optimizer — reads Keen's own operational telemetry and surfaces
 * Opportunities for the standard Proposer → Executor pipeline.
 *
 * Inputs:
 *   - keen_telemetry: route latency, error rate, IP-quarantine velocity
 *   - keen_sandbox_run: failed ML jobs, slow runs
 *   - keen_proposal: which tiers got rejected, churn patterns
 *
 * Outputs: keen_opportunity rows tagged ["self-optimization"]. Same approval
 * tiers apply — Keen does NOT auto-ship its own optimizations.
 *
 * Hard-coded heuristics drive v0 so we get useful signal without an LLM call.
 * LLM augmentation is layered on once the heuristics produce baselines.
 */

import { prisma } from "@/lib/prisma";
import type { ApprovalTier } from "../policy";

const WINDOW_MS = 24 * 60 * 60 * 1000;

interface RouteStat {
  route: string;
  count: number;
  errors: number;
  p95DurationMs: number;
}

export interface OptimizeResult {
  windowStart: Date;
  windowEnd: Date;
  routesScanned: number;
  opportunitiesCreated: number;
}

export async function runOptimizer(): Promise<OptimizeResult> {
  const windowEnd = new Date();
  const windowStart = new Date(windowEnd.getTime() - WINDOW_MS);

  const stats = await aggregateRouteStats(windowStart, windowEnd);
  const opportunities: Array<{
    title: string;
    rationale: string;
    tags: string[];
    impact: number;
    effort: number;
    tier: ApprovalTier;
  }> = [];

  for (const s of stats) {
    const errorRate = s.count > 0 ? s.errors / s.count : 0;
    if (errorRate >= 0.05 && s.count >= 50) {
      opportunities.push({
        title: `High error rate on ${s.route}`,
        rationale: `${(errorRate * 100).toFixed(1)}% of ${s.count} requests in the last 24h returned 5xx. Investigate stack traces, recent diffs touching this route, and database query plans behind it.`,
        tags: ["self-optimization", "error-rate", s.route],
        impact: errorRate >= 0.2 ? 5 : 4,
        effort: 3,
        tier: errorRate >= 0.2 ? "L3" : "L2",
      });
    }
    if (s.p95DurationMs >= 1500 && s.count >= 100) {
      opportunities.push({
        title: `Latency regression on ${s.route}`,
        rationale: `p95 latency is ${s.p95DurationMs}ms across ${s.count} requests in the last 24h. Profile the handler, check for missing indexes, or consider edge caching for read-mostly paths.`,
        tags: ["self-optimization", "latency", s.route],
        impact: 3,
        effort: 2,
        tier: "L2",
      });
    }
  }

  const failedSandboxRuns = await prisma.keenSandboxRun.count({
    where: {
      status: { in: ["failed", "timeout"] },
      startedAt: { gte: windowStart },
    },
  });
  if (failedSandboxRuns >= 3) {
    opportunities.push({
      title: `${failedSandboxRuns} sandbox runs failed in the last 24h`,
      rationale: `Foundry jobs are unstable. Inspect keen_sandbox_run.stderrTail for the latest failures, then either patch the script generator or expand the E2B template with the missing dependency.`,
      tags: ["self-optimization", "foundry", "sandbox"],
      impact: 3,
      effort: 2,
      tier: "L2",
    });
  }

  const rejectedRecent = await prisma.keenProposal.count({
    where: {
      status: "rejected",
      createdAt: { gte: windowStart },
    },
  });
  const totalRecent = await prisma.keenProposal.count({
    where: { createdAt: { gte: windowStart } },
  });
  if (totalRecent >= 5 && rejectedRecent / totalRecent >= 0.5) {
    opportunities.push({
      title: `Proposer rejection rate is ${(100 * rejectedRecent / totalRecent).toFixed(0)}%`,
      rationale: `Keen is producing proposals that don't pass the operator's bar. Inspect the rejected proposals, sharpen the SYSTEM_PROMPT in keen/proposer/index.ts to bias toward higher-impact / lower-risk drafts, and lower the synthesizer temperature.`,
      tags: ["self-optimization", "proposer", "prompt-tuning"],
      impact: 4,
      effort: 2,
      tier: "L2",
    });
  }

  let created = 0;
  for (const opp of opportunities) {
    await prisma.keenOpportunity.create({
      data: {
        detectedAt: new Date(),
        title: opp.title,
        rationale: opp.rationale,
        evidenceObservationIds: [],
        evidenceCaseIds: [],
        tags: opp.tags,
        impact: opp.impact,
        effort: opp.effort,
        suggestedTier: opp.tier,
        status: "open",
      },
    });
    created++;
  }

  return {
    windowStart,
    windowEnd,
    routesScanned: stats.length,
    opportunitiesCreated: created,
  };
}

async function aggregateRouteStats(
  since: Date,
  until: Date,
): Promise<RouteStat[]> {
  const rows = await prisma.keenTelemetry.findMany({
    where: { createdAt: { gte: since, lt: until }, route: { not: null } },
    select: {
      route: true,
      statusCode: true,
      durationMs: true,
    },
    take: 50_000,
  });

  const buckets = new Map<
    string,
    { count: number; errors: number; durations: number[] }
  >();
  for (const r of rows) {
    if (!r.route) continue;
    const b = buckets.get(r.route) ?? { count: 0, errors: 0, durations: [] };
    b.count++;
    if (typeof r.statusCode === "number" && r.statusCode >= 500) b.errors++;
    if (typeof r.durationMs === "number") b.durations.push(r.durationMs);
    buckets.set(r.route, b);
  }

  const stats: RouteStat[] = [];
  for (const [route, b] of buckets) {
    const sorted = b.durations.slice().sort((a, c) => a - c);
    const p95 =
      sorted.length === 0 ? 0 : sorted[Math.floor(sorted.length * 0.95)] ?? 0;
    stats.push({ route, count: b.count, errors: b.errors, p95DurationMs: p95 });
  }
  return stats;
}
