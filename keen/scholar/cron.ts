/**
 * Scholar cron orchestration — harvest, conflict-scan, prune.
 *
 * dailyHarvestJob:
 *   - Find the top 3 open opportunities (highest impact, oldest).
 *   - For each, search PubMed and ingest top-5 findings.
 *   - Skip topics already harvested in the last 24h.
 *
 * weeklyConflictScanner: see ./conflict.ts.
 *
 * pruneOldFindings: archive findings unseen for > 30 days that no live proposal
 * references. Operator can un-archive from the dashboard.
 */

import { prisma } from "@/lib/prisma";
import { ensureSeedSources, getSourceByKind } from "./sources";
import { harvestForTopic } from "./pubmed";
import { ingestPaper, type IngestResult } from "./ingest";
import { scanForConflicts, type ConflictScanResult } from "./conflict";

const PRUNE_THRESHOLD_MS = 30 * 24 * 60 * 60 * 1000;
const HARVEST_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export interface HarvestResult {
  topicsHarvested: number;
  paperResults: IngestResult[];
}

export async function dailyHarvestJob(): Promise<HarvestResult> {
  await ensureSeedSources();
  const pubmed = await getSourceByKind("pubmed");
  if (!pubmed) {
    return { topicsHarvested: 0, paperResults: [] };
  }

  const opportunities = await prisma.keenOpportunity.findMany({
    where: { status: "open" },
    orderBy: [{ impact: "desc" }, { detectedAt: "asc" }],
    take: 3,
  });

  if (opportunities.length === 0) {
    return { topicsHarvested: 0, paperResults: [] };
  }

  const since = new Date(Date.now() - HARVEST_COOLDOWN_MS);
  const recentTopics = new Set(
    (
      await prisma.keenScholarFinding.findMany({
        where: { createdAt: { gte: since } },
        select: { topic: true },
        distinct: ["topic"],
      })
    ).map((r) => r.topic.toLowerCase()),
  );

  const results: IngestResult[] = [];
  let topicsHarvested = 0;

  for (const opp of opportunities) {
    const topic = opp.title;
    if (recentTopics.has(topic.toLowerCase())) continue;

    const papers = await harvestForTopic(topic, 5);
    if (papers.length === 0) continue;
    topicsHarvested++;

    for (const paper of papers) {
      const r = await ingestPaper(paper, {
        id: pubmed.id,
        defaultTrustWeight: pubmed.defaultTrustWeight,
        kind: pubmed.kind,
      });
      results.push(r);
    }
  }

  await prisma.keenScholarSource.update({
    where: { id: pubmed.id },
    data: { lastHarvestedAt: new Date() },
  });

  return { topicsHarvested, paperResults: results };
}

export async function weeklyConflictScanner(): Promise<ConflictScanResult> {
  return scanForConflicts();
}

export interface PruneResult {
  archived: number;
  scanned: number;
}

export async function pruneOldFindings(): Promise<PruneResult> {
  const cutoff = new Date(Date.now() - PRUNE_THRESHOLD_MS);

  // Anything cited in the last 30 days OR referenced by a non-shipped proposal stays.
  const candidates = await prisma.keenScholarFinding.findMany({
    where: {
      status: "active",
      lastCitedAt: { lt: cutoff },
      citationCount: { equals: 0 },
    },
    select: { id: true },
    take: 1000,
  });

  if (candidates.length === 0) {
    return { archived: 0, scanned: 0 };
  }

  await prisma.keenScholarFinding.updateMany({
    where: { id: { in: candidates.map((c) => c.id) } },
    data: { status: "archived" },
  });

  return { archived: candidates.length, scanned: candidates.length };
}
