/**
 * Working memory — Upstash Redis rolling chat window.
 *
 * One list per session: keen:session:<sessionId>:turns
 * - LPUSH each new turn
 * - LTRIM to last MAX_TURNS
 * - EXPIRE = 24h sliding (refreshed on every append)
 *
 * Reads return the window oldest→newest so callers can feed it straight into
 * a chat-completion request without reversing.
 */

import { getRedis } from "../redis";

export const MAX_TURNS = 10;
export const TURN_TTL_SECONDS = 24 * 60 * 60; // 24h sliding
export const CONSOLIDATION_THRESHOLD = 20;

export type Role = "user" | "assistant" | "system";

export interface Turn {
  role: Role;
  content: string;
  /** Epoch ms — set by appendTurn if caller omits. */
  ts?: number;
  /** Optional metadata: model, provider, tier, etc. Scrub PII upstream. */
  meta?: Record<string, unknown>;
}

const keyFor = (sessionId: string) => `keen:session:${sessionId}:turns`;
const counterFor = (sessionId: string) =>
  `keen:session:${sessionId}:total-turns`;

/** Append a turn to the session's rolling window. */
export async function appendTurn(sessionId: string, message: Turn): Promise<{
  windowSize: number;
  totalTurnsThisSession: number;
  shouldConsolidate: boolean;
}> {
  if (!sessionId) throw new Error("[Keen.workingMemory] sessionId is required");
  const redis = getRedis();
  const key = keyFor(sessionId);
  const counter = counterFor(sessionId);

  const turn: Turn = {
    ...message,
    ts: message.ts ?? Date.now(),
  };

  // Pipeline: push → trim → expire window → increment total → expire counter
  const pipe = redis.pipeline();
  pipe.lpush(key, JSON.stringify(turn));
  pipe.ltrim(key, 0, MAX_TURNS - 1);
  pipe.expire(key, TURN_TTL_SECONDS);
  pipe.incr(counter);
  pipe.expire(counter, TURN_TTL_SECONDS);
  const results = (await pipe.exec()) as unknown[];

  const windowSize = Math.min(MAX_TURNS, Number(results[0] ?? 0));
  const totalTurnsThisSession = Number(results[3] ?? 0);
  const shouldConsolidate = totalTurnsThisSession >= CONSOLIDATION_THRESHOLD;

  return { windowSize, totalTurnsThisSession, shouldConsolidate };
}

/** Read the rolling window for a session, ordered oldest → newest. */
export async function getActiveContext(sessionId: string): Promise<Turn[]> {
  if (!sessionId) return [];
  const redis = getRedis();
  const raw = (await redis.lrange(keyFor(sessionId), 0, MAX_TURNS - 1)) ?? [];
  // Upstash returns objects when stored as JSON strings — handle both shapes.
  const turns = raw.map((v) =>
    typeof v === "string" ? (JSON.parse(v) as Turn) : (v as Turn),
  );
  return turns.reverse();
}

/** Total messages this session has seen (counter persists 24h sliding). */
export async function getTotalTurns(sessionId: string): Promise<number> {
  if (!sessionId) return 0;
  const redis = getRedis();
  const v = await redis.get<number>(counterFor(sessionId));
  return v ?? 0;
}

/**
 * Consolidator post-step. Removes everything except the last 2 turns so the
 * session "remembers" only its most recent exchanges going forward. Counter is
 * reset so a new 20-turn cycle can begin.
 */
export async function flushKeepingLast(
  sessionId: string,
  keep = 2,
): Promise<void> {
  if (!sessionId) return;
  const redis = getRedis();
  const key = keyFor(sessionId);
  // LTRIM 0..keep-1 retains the keep most recent turns (LPUSH order).
  await redis.ltrim(key, 0, keep - 1);
  await redis.expire(key, TURN_TTL_SECONDS);
  await redis.del(counterFor(sessionId));
}

/** Drop everything for a session — used at logout or DPDP erasure. */
export async function purgeSession(sessionId: string): Promise<void> {
  if (!sessionId) return;
  const redis = getRedis();
  await redis.del(keyFor(sessionId), counterFor(sessionId));
}
