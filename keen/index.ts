/**
 * Keen — public entry point.
 *
 * Host apps import from "@/keen" and never reach into individual modules.
 * That way the module surface stays stable as internals evolve.
 */

export * from "./adapter";
export { observe } from "./observer";
export {
  addTeacher,
  listTeachers,
  ingestCase,
  recordOutcome,
  listCases,
} from "./teacher";
export { synthesize } from "./synthesizer";
export { proposeForOpportunity, proposeAllOpen } from "./proposer";
export { approve, reject } from "./executor";
export { fineTune, listModels, promoteModel } from "./foundry";
export { distribute } from "./distributor";
export { generateMedia, type GeneratedMedia } from "./distributor/media-generator";
export { uploadToYouTube, type YouTubeUploadResult } from "./distributor/youtube";
export { publishToInstagram, type InstagramPublishResult } from "./distributor/instagram";
export {
  saveFeedItem,
  listFeed,
  updateMetrics,
  type FeedItemInput,
} from "./distributor/feed";
export {
  runMediaPipeline,
  type RunPipelineInput,
  type RunPipelineResult,
} from "./distributor/pipeline";
export {
  dispatchMediaProposal,
  dispatchAllApprovedMedia,
  type DispatchResult,
} from "./distributor/dispatcher";
export { recall } from "./knowledge";
export { notifyOperator, proposalDashboardUrl } from "./notify";
export { nutrimamaHost } from "./host-nutrimama";

// Memory tiers
export {
  appendTurn,
  getActiveContext,
  getTotalTurns,
  flushKeepingLast,
  purgeSession,
  MAX_TURNS,
  TURN_TTL_SECONDS,
  CONSOLIDATION_THRESHOLD,
  type Turn,
  type Role,
} from "./memory/working";
export {
  getProfile,
  upsertProfile,
  patchProfile,
  deleteProfile,
  type KeenFacts,
} from "./memory/deterministic";
export {
  saveSemanticMemory,
  recallSemantic,
  purgeSemantic,
  type SemanticHit,
} from "./memory/semantic";
export { consolidate } from "./memory/consolidator";

// Security
export { moderate, type ModerationDecision, type ContentKind } from "./security/moderation";
export {
  recordEvent,
  drainStream,
  quarantineIp,
  isIpQuarantined,
  releaseIp,
  type TelemetryEvent,
  type TelemetryKind,
} from "./security/telemetry-stream";

// Sandbox
export { runInSandbox, type SandboxRunInput, type SandboxRunResult } from "./sandbox/e2b";

// Optimizer
export { runOptimizer, type OptimizeResult } from "./optimizer";

// Scholar — bootstraps clinical knowledge from certified literature
export {
  ensureSeedSources,
  retrieveTrustWeighted,
  dailyHarvestJob,
  weeklyConflictScanner,
  pruneOldFindings,
  type ScholarHit,
} from "./scholar";

// Pretrained Hugging Face inference router
export {
  infer,
  extractEntities,
  classifyZeroShot,
  pubmedBertFeatures,
  type InferenceResult,
  type NerSpan,
  type ZeroShotResult,
} from "./foundry/pretrained";

// Primitives
export { embed, toPgVectorLiteral } from "./embeddings";
export { getRedis, isRedisConfigured } from "./redis";
