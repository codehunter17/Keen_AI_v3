/**
 * NutriMama host adapter for Keen.
 *
 * Reads anonymized events from NutriMama's Postgres, pseudonymizes user IDs,
 * scrubs PII, and persists Keen rows. Keen never sees raw user identity.
 *
 * This file is intentionally the ONLY place Keen touches NutriMama-specific
 * tables. Swap this adapter to run Keen on a different host app.
 */

import { prisma } from "@/lib/prisma";
import type {
  KeenAdapter,
  RawSignal,
  Observation,
  Proposal,
} from "./types";
import { pseudonymize, scrubPayload } from "./anonymize";

export const nutrimamaHost: KeenAdapter = {
  hostName: "nutrimama",

  async collectSignals(since: Date, until: Date): Promise<RawSignal[]> {
    const signals: RawSignal[] = [];

    // PCOS screenings completed in window
    const pcos = await prisma.pcosScreening.findMany({
      where: { createdAt: { gte: since, lt: until } },
      select: { userId: true, createdAt: true, score: true, riskLevel: true },
    });
    for (const row of pcos) {
      signals.push({
        kind: "screening_completed",
        pseudonym: pseudonymize(row.userId),
        occurredAt: row.createdAt,
        host: "nutrimama",
        payload: scrubPayload({
          screening: "pcos",
          score: row.score,
          riskLevel: row.riskLevel,
        }),
      });
    }

    // Water entries in window — feature_use signal
    const water = await prisma.waterEntry.findMany({
      where: { date: { gte: since, lt: until } },
      select: { userId: true, date: true, amountMl: true, source: true },
    });
    for (const row of water) {
      signals.push({
        kind: "feature_use",
        pseudonym: pseudonymize(row.userId),
        occurredAt: row.date,
        host: "nutrimama",
        payload: scrubPayload({
          feature: "water_entry",
          amountMl: row.amountMl,
          source: row.source ?? "water",
        }),
      });
    }

    return signals;
  },

  async saveSignal(signal: RawSignal) {
    const row = await prisma.keenSignal.create({
      data: {
        kind: signal.kind,
        pseudonym: signal.pseudonym,
        host: signal.host ?? "nutrimama",
        occurredAt: signal.occurredAt,
        payload: signal.payload as object,
      },
      select: { id: true },
    });
    return { id: row.id };
  },

  async saveObservation(obs: Observation) {
    const row = await prisma.keenObservation.create({
      data: {
        windowStart: obs.windowStart,
        windowEnd: obs.windowEnd,
        summary: obs.summary,
        tags: obs.tags,
        signalCount: obs.signalCount,
        signalBreakdown: obs.signalBreakdown as object,
        confidence: obs.confidence,
        sourceSignalIds: obs.sourceSignalIds,
      },
      select: { id: true },
    });
    return { id: row.id };
  },

  async saveProposal(p: Proposal) {
    const row = await prisma.keenProposal.create({
      data: {
        opportunityId: p.opportunityId,
        title: p.title,
        spec: p.spec,
        diff: p.diff,
        filesTouched: p.filesTouched,
        tablesTouched: p.tablesTouched,
        tier: p.tier,
        risk: p.risk,
        rollbackPlan: p.rollbackPlan,
        expectedImpact: p.expectedImpact,
        status: p.status,
      },
      select: { id: true },
    });
    return { id: row.id };
  },

  async recentObservations(limit: number): Promise<Observation[]> {
    const rows = await prisma.keenObservation.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows.map((r) => ({
      id: r.id,
      windowStart: r.windowStart,
      windowEnd: r.windowEnd,
      summary: r.summary,
      tags: r.tags,
      signalCount: r.signalCount,
      signalBreakdown: r.signalBreakdown as Observation["signalBreakdown"],
      confidence: r.confidence,
      sourceSignalIds: r.sourceSignalIds,
    }));
  },

  async recentProposals(limit: number): Promise<Proposal[]> {
    const rows = await prisma.keenProposal.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows.map((r) => ({
      id: r.id,
      opportunityId: r.opportunityId,
      createdAt: r.createdAt,
      title: r.title,
      spec: r.spec,
      diff: r.diff,
      filesTouched: r.filesTouched,
      tablesTouched: r.tablesTouched,
      tier: r.tier as Proposal["tier"],
      risk: r.risk,
      rollbackPlan: r.rollbackPlan,
      expectedImpact: r.expectedImpact,
      status: r.status as Proposal["status"],
    }));
  },
};
