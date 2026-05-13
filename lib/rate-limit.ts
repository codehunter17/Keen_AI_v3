// Simple in-memory rate limiter. One process = one bucket.
// On Vercel each serverless instance has its own counter — that's a feature
// not a bug for v1: it raises the effective ceiling without introducing a
// Redis dependency. When you outgrow this (10k+ MAU), swap to Upstash.

interface Bucket {
  count: number;
  resetAt: number; // epoch ms
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Allow up to `max` events per `windowMs` per `key`.
 * @param key   Anything stable per actor (userId, ip, "chat:userId").
 * @param max   Max events per window.
 * @param windowMs  Window length in ms (default 60_000 = 1 min).
 */
export function rateLimit(key: string, max: number, windowMs = 60_000): RateLimitResult {
  const now = Date.now();
  const cur = buckets.get(key);
  if (!cur || cur.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1, resetAt: now + windowMs };
  }
  if (cur.count >= max) {
    return { ok: false, remaining: 0, resetAt: cur.resetAt };
  }
  cur.count += 1;
  return { ok: true, remaining: max - cur.count, resetAt: cur.resetAt };
}

// Periodic GC so the map doesn't grow unbounded if many keys appear once.
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [k, b] of buckets) {
      if (b.resetAt < now) buckets.delete(k);
    }
  }, 5 * 60_000).unref?.();
}
