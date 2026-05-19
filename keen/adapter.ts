/**
 * Keen adapter abstraction.
 *
 * Any host app implements `KeenAdapter` from ./types to plug Keen in.
 * This file just re-exports the type plus a couple of helpers, so callers
 * import from "@/keen/adapter" without reaching into ./types directly.
 */

export type {
  KeenAdapter,
  RawSignal,
  Observation,
  Proposal,
  ClinicalCase,
  Outcome,
  Opportunity,
  SignalKind,
} from "./types";

export { pseudonymize, scrubPayload, scrubText } from "./anonymize";
export {
  KEEN_FORBIDDEN_PATHS,
  KEEN_FORBIDDEN_TABLES,
  isPathForbidden,
  evaluatePaths,
  evaluateTables,
} from "./policy";
