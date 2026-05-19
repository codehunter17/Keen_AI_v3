/**
 * Shared types used across Keen modules.
 *
 * Keen is built host-agnostic — the host app (NutriMama, or any future host)
 * implements KeenAdapter to plug in its data, while these types remain stable.
 */

import type { ApprovalTier } from "./policy";

export type SignalKind =
  | "feature_use"
  | "drop_off"
  | "chat_query"
  | "ai_failure"
  | "symptom_log"
  | "cycle_log"
  | "screening_completed"
  | "doctor_visit"
  | "outcome_followup"
  | "error"
  | "custom";

/** A single anonymized event observed by Keen. PII MUST be scrubbed upstream. */
export interface RawSignal {
  kind: SignalKind;
  /** A stable hashed pseudonym for the originating user (never the real userId). */
  pseudonym: string;
  occurredAt: Date;
  /** Free-form anonymized payload — strings safe for LLM ingestion. */
  payload: Record<string, unknown>;
  /** Optional source-app tag, for multi-host deployments. */
  host?: string;
}

/** A summarized cluster of signals — Observer's nightly output. */
export interface Observation {
  id?: string;
  windowStart: Date;
  windowEnd: Date;
  summary: string;
  /** Tag set the synthesizer uses to cluster: e.g. ["pcos", "drop_off", "chat"]. */
  tags: string[];
  /** Signal volume + breakdown by kind. */
  signalCount: number;
  signalBreakdown: Partial<Record<SignalKind, number>>;
  /** Confidence the summary is faithful (0..1). */
  confidence: number;
  /** Raw signal IDs this observation was built from. */
  sourceSignalIds: string[];
}

/** A structured doctor case — higher-trust input than user signals. */
export interface ClinicalCase {
  id?: string;
  teacherId: string;
  teacherSpecialty: string;
  occurredAt: Date;
  /** Anonymized patient context. */
  inputs: {
    ageBand?: string;
    lifeStage?: string;
    symptoms?: string[];
    labs?: Record<string, number | string>;
    history?: string;
  };
  differential?: string[];
  decision: {
    type: "test" | "drug" | "lifestyle" | "referral" | "watch" | "other";
    details: string;
  };
  reasoning?: string;
  outcomeId?: string;
}

/** Outcome follow-up captured at +1w / +2w / +1mo. */
export interface Outcome {
  id?: string;
  caseId: string;
  checkpointAt: Date;
  status: "improved" | "unchanged" | "worsened" | "unknown";
  notes?: string;
}

/** An opportunity surfaced by Synthesizer for Proposer to act on. */
export interface Opportunity {
  id?: string;
  detectedAt: Date;
  title: string;
  rationale: string;
  /** Observations + cases supporting this opportunity. */
  evidenceObservationIds: string[];
  evidenceCaseIds: string[];
  tags: string[];
  /** Estimated user impact 1..5. */
  impact: number;
  /** Estimated effort 1..5. */
  effort: number;
  /** Initial guess at risk tier — Proposer may revise. */
  suggestedTier: ApprovalTier;
}

/** A change proposal — what Krishna sees in WhatsApp + /admin. */
export interface Proposal {
  id?: string;
  opportunityId: string;
  createdAt: Date;
  title: string;
  spec: string; // markdown
  diff: string; // unified diff
  filesTouched: string[];
  tablesTouched: string[];
  tier: ApprovalTier;
  risk: string;
  rollbackPlan: string;
  expectedImpact: string;
  status:
    | "draft"
    | "awaiting_approval"
    | "approved"
    | "rejected"
    | "shipped"
    | "rolled_back";
}

/** Adapter contract — every host app implements this. */
export interface KeenAdapter {
  hostName: string;

  /** Pull events that happened in [since, until). MUST be anonymized. */
  collectSignals(since: Date, until: Date): Promise<RawSignal[]>;

  /** Persist a RawSignal. */
  saveSignal(signal: RawSignal): Promise<{ id: string }>;

  /** Persist an Observation. */
  saveObservation(obs: Observation): Promise<{ id: string }>;

  /** Persist a Proposal. */
  saveProposal(p: Proposal): Promise<{ id: string }>;

  /** Read latest observations for the admin dashboard. */
  recentObservations(limit: number): Promise<Observation[]>;

  /** Read latest proposals for the admin dashboard. */
  recentProposals(limit: number): Promise<Proposal[]>;
}
