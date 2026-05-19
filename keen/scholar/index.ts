/**
 * Scholar public surface.
 */

export {
  TRUST_BY_KIND,
  SEED_SOURCES,
  ensureSeedSources,
  getSourceByKind,
  type SourceKind,
} from "./sources";
export {
  searchPubMed,
  fetchAbstracts,
  harvestForTopic,
  type PubMedAbstract,
  type HarvestedPaper,
} from "./pubmed";
export { ingestPaper, type IngestResult } from "./ingest";
export { retrieveTrustWeighted, type ScholarHit } from "./retrieval";
export { scanForConflicts, type ConflictScanResult } from "./conflict";
export {
  dailyHarvestJob,
  weeklyConflictScanner,
  pruneOldFindings,
  type HarvestResult,
  type PruneResult,
} from "./cron";
