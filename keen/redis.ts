/**
 * Upstash Redis client — singleton.
 *
 * Used by working-memory (rolling chat window) and telemetry-stream (security
 * agent's Redis Stream consumer). All Upstash calls are HTTPS so this runs on
 * Vercel serverless and edge with no socket-pool concerns.
 *
 * Falls back to a stub when env vars are absent so local dev / CI never crashes
 * because Upstash isn't wired up yet.
 */

import { Redis } from "@upstash/redis";

let cached: Redis | null = null;

export function getRedis(): Redis {
  if (cached) return cached;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "[Keen.redis] UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set",
    );
  }

  cached = new Redis({ url, token });
  return cached;
}

/** True if Upstash creds are configured. Callers use this to skip Redis-only paths in dev. */
export function isRedisConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}
