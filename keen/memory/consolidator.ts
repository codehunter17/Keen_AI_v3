/**
 * Consolidator — runs at session-end OR when a session crosses 20 turns.
 *
 * Pipeline:
 *   1. Read full rolling window from Redis
 *   2. LLM summarizes the session AND extracts updated facts (single call,
 *      minimizes token overhead)
 *   3. Generate 384-dim embedding of the summary
 *   4. Insert into keen_semantic_memory
 *   5. Patch keen_user_profile JSONB with any extracted facts
 *   6. Flush Redis window to last 2 turns, reset counter
 *
 * Non-blocking by design — host app should call this from a queue / background
 * worker, not a request handler.
 */

import { llm, safeJson } from "../llm";
import { embed } from "../embeddings";
import {
  getActiveContext,
  flushKeepingLast,
  getTotalTurns,
  type Turn,
} from "./working";
import { saveSemanticMemory } from "./semantic";
import { patchProfile, type KeenFacts } from "./deterministic";

const SYSTEM_PROMPT = `You compress a conversation into durable memory for an AI women's health companion.

Return STRICT JSON:
{
  "summary": "5-8 sentences capturing what mattered: topics, decisions, advice given, user concerns, follow-ups due. Anonymous voice.",
  "tags": ["3-6 short kebab-case topic tags"],
  "factsPatch": {
    // ONLY include keys that changed or were newly confirmed in this session.
    // Omit keys where the user didn't mention or confirm them.
    "pregnancyWeek": number?,
    "dueDate": "YYYY-MM-DD"?,
    "lifeStage": "MENSTRUATING"|"TRYING_TO_CONCEIVE"|"PREGNANT"|"POST_PARTUM"|"PERIMENOPAUSE"|"MENOPAUSE"?,
    "allergies": ["string"]?,
    "dietary": "VEGETARIAN"|"VEGAN"|"NON_VEG"?,
    "conditions": ["string"]?,
    "preferredLang": "en"|"hi"?
  }
}

Do not invent facts. Only patch what the user actually stated or confirmed.`;

export interface ConsolidateInput {
  sessionId: string;
  pseudonym: string;
  /** When true, runs even if turn count is below threshold (e.g. on logout). */
  force?: boolean;
  /** Override threshold — defaults to 20 (matches working.ts CONSOLIDATION_THRESHOLD). */
  threshold?: number;
}

export interface ConsolidateResult {
  ran: boolean;
  reason?: string;
  semanticMemoryId?: string;
  factsApplied?: Partial<KeenFacts>;
  turnsConsolidated?: number;
  provider?: string;
}

export async function consolidate(
  input: ConsolidateInput,
): Promise<ConsolidateResult> {
  const { sessionId, pseudonym } = input;
  const threshold = input.threshold ?? 20;

  const total = await getTotalTurns(sessionId);
  if (!input.force && total < threshold) {
    return {
      ran: false,
      reason: `turns ${total} < threshold ${threshold}`,
    };
  }

  const window = await getActiveContext(sessionId);
  if (window.length === 0) {
    return { ran: false, reason: "empty window" };
  }

  const userPrompt = buildPrompt(window);
  const llmResult = await llm({
    system: SYSTEM_PROMPT,
    user: userPrompt,
    format: "json",
    temperature: 0.2,
  });

  type Parsed = {
    summary?: string;
    tags?: string[];
    factsPatch?: Partial<KeenFacts>;
  };
  const parsed = safeJson<Parsed>(llmResult.text) ?? {};
  const summary = parsed.summary?.trim();

  if (!summary) {
    return {
      ran: false,
      reason: "LLM returned no summary",
      provider: llmResult.provider,
    };
  }

  const { vector } = await embed(summary);
  const saved = await saveSemanticMemory({
    pseudonym,
    summary,
    sessionId,
    turnCount: total,
    tags: parsed.tags ?? [],
    vector,
  });

  let factsApplied: Partial<KeenFacts> = {};
  if (parsed.factsPatch && Object.keys(parsed.factsPatch).length > 0) {
    factsApplied = sanitizeFactsPatch(parsed.factsPatch);
    if (Object.keys(factsApplied).length > 0) {
      await patchProfile(pseudonym, factsApplied);
    }
  }

  await flushKeepingLast(sessionId, 2);

  return {
    ran: true,
    semanticMemoryId: saved.id,
    factsApplied,
    turnsConsolidated: window.length,
    provider: llmResult.provider,
  };
}

function buildPrompt(window: Turn[]): string {
  const transcript = window
    .map((t) => `${t.role.toUpperCase()}: ${t.content}`)
    .join("\n");
  return `Conversation transcript (oldest → newest):\n\n${transcript}\n\nReturn JSON.`;
}

const LIFE_STAGES = new Set([
  "MENSTRUATING",
  "TRYING_TO_CONCEIVE",
  "PREGNANT",
  "POST_PARTUM",
  "PERIMENOPAUSE",
  "MENOPAUSE",
]);
const DIETARY = new Set(["VEGETARIAN", "VEGAN", "NON_VEG"]);

function sanitizeFactsPatch(p: Partial<KeenFacts>): Partial<KeenFacts> {
  const out: Partial<KeenFacts> = {};
  if (typeof p.pregnancyWeek === "number" && p.pregnancyWeek >= 0 && p.pregnancyWeek <= 45) {
    out.pregnancyWeek = Math.floor(p.pregnancyWeek);
  }
  if (typeof p.dueDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(p.dueDate)) {
    out.dueDate = p.dueDate;
  }
  if (typeof p.lifeStage === "string" && LIFE_STAGES.has(p.lifeStage)) {
    out.lifeStage = p.lifeStage as KeenFacts["lifeStage"];
  }
  if (Array.isArray(p.allergies)) {
    out.allergies = p.allergies.filter((a): a is string => typeof a === "string").slice(0, 30);
  }
  if (typeof p.dietary === "string" && DIETARY.has(p.dietary)) {
    out.dietary = p.dietary as KeenFacts["dietary"];
  }
  if (Array.isArray(p.conditions)) {
    out.conditions = p.conditions.filter((c): c is string => typeof c === "string").slice(0, 20);
  }
  if (typeof p.preferredLang === "string") {
    out.preferredLang = p.preferredLang.slice(0, 8);
  }
  return out;
}
