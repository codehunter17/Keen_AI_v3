/**
 * Telemetry stream — Redis Stream producer + consumer.
 *
 * The host app pushes anonymized request events onto an Upstash Redis Stream.
 * A consumer (invoked via cron or a long-lived worker) drains the stream,
 * persists rows into keen_telemetry for analytic queries, and flags suspicious
 * patterns: prompt-injection signatures + per-IP velocity anomalies. Hits
 * write a row into keen_quarantine_ip.
 *
 * IPs in keen_quarantine_ip are read by the host's middleware to block
 * requests at the edge. Keen never blocks directly — it only flags + writes.
 */

import { prisma } from "@/lib/prisma";
import { getRedis, isRedisConfigured } from "../redis";

const STREAM_KEY = "keen:telemetry:events";
const STREAM_MAXLEN = 50_000;
const CONSUMER_BATCH = 500;
const LAST_ID_KEY = "keen:telemetry:last-id";

// Velocity thresholds — tuned for a single user / IP per minute.
const REQ_PER_MIN_HIGH = 240;
const REQ_PER_MIN_MEDIUM = 90;

// Prompt-injection signatures. Conservative — false-positives quarantine real users.
const INJECTION_PATTERNS: RegExp[] = [
  /ignore (?:all |the )?(?:previous|above|prior) (?:instructions|prompts|rules)/i,
  /system prompt(?:[: ]+|\s*=\s*)/i,
  /you are now (?:dan|developer mode|jailbroken|unrestricted)/i,
  /print (?:your )?system prompt/i,
  /reveal (?:the )?(?:hidden|secret|admin) (?:prompt|instructions?)/i,
  /<\|im_(?:start|end)\|>/i,
  /\[\[.{0,40}override.{0,40}\]\]/i,
];

export type TelemetryKind = "request" | "chat" | "auth" | "error";

export interface TelemetryEvent {
  kind: TelemetryKind;
  ip?: string;
  pseudonym?: string;
  route?: string;
  method?: string;
  statusCode?: number;
  durationMs?: number;
  userAgent?: string;
  /** Anonymized — scrub PII upstream. Chat events carry the prompt body. */
  payload?: Record<string, unknown>;
}

/**
 * Push one event onto the stream. Non-blocking — callers should NOT await this
 * in hot request paths if they care about latency; fire-and-forget via .catch().
 */
export async function recordEvent(event: TelemetryEvent): Promise<void> {
  if (!isRedisConfigured()) return;
  try {
    const redis = getRedis();
    await redis.xadd(
      STREAM_KEY,
      { nomkstream: false, trim: { type: "MAXLEN", threshold: STREAM_MAXLEN, comparison: "~" } },
      "*",
      { event: JSON.stringify({ ...event, ts: Date.now() }) },
    );
  } catch {
    // never let telemetry crash a request
  }
}

export interface DrainResult {
  consumed: number;
  flaggedInjections: number;
  flaggedVelocity: number;
  quarantinedIps: string[];
}

/**
 * Drain up to CONSUMER_BATCH new events since the last cursor. Idempotent —
 * safe to call from a cron route every minute.
 */
export async function drainStream(): Promise<DrainResult> {
  if (!isRedisConfigured()) {
    return { consumed: 0, flaggedInjections: 0, flaggedVelocity: 0, quarantinedIps: [] };
  }
  const redis = getRedis();

  const lastId = (await redis.get<string>(LAST_ID_KEY)) ?? "0";
  // Upstash XREAD returns [{ name, messages: [{ id, message: {...} }] }] | null
  type XReadEntry = { id: string; message: Record<string, string> };
  type XReadResult = { name: string; messages: XReadEntry[] }[];
  const reply = (await redis.xread([STREAM_KEY], [lastId], {
    count: CONSUMER_BATCH,
  })) as XReadResult | null;

  if (!reply || reply.length === 0 || reply[0].messages.length === 0) {
    return { consumed: 0, flaggedInjections: 0, flaggedVelocity: 0, quarantinedIps: [] };
  }

  const entries = reply[0].messages;
  let nextCursor = lastId;
  let injections = 0;
  let velocity = 0;
  const quarantined = new Set<string>();
  const ipMinuteBuckets = new Map<string, number>();

  for (const entry of entries) {
    nextCursor = entry.id;
    let parsed: (TelemetryEvent & { ts?: number }) | null = null;
    try {
      parsed = JSON.parse(entry.message.event) as TelemetryEvent & { ts?: number };
    } catch {
      continue;
    }
    if (!parsed) continue;

    await prisma.keenTelemetry.create({
      data: {
        kind: parsed.kind,
        ip: parsed.ip ?? null,
        pseudonym: parsed.pseudonym ?? null,
        route: parsed.route ?? null,
        method: parsed.method ?? null,
        statusCode: parsed.statusCode ?? null,
        durationMs: parsed.durationMs ?? null,
        userAgent: parsed.userAgent ?? null,
        payload: parsed.payload as object | undefined,
      },
    });

    if (parsed.ip) {
      ipMinuteBuckets.set(parsed.ip, (ipMinuteBuckets.get(parsed.ip) ?? 0) + 1);
    }

    if (parsed.kind === "chat" || parsed.kind === "request") {
      const text =
        typeof parsed.payload?.body === "string"
          ? parsed.payload.body
          : typeof parsed.payload?.prompt === "string"
            ? parsed.payload.prompt
            : "";
      if (text) {
        const hit = INJECTION_PATTERNS.find((re) => re.test(text));
        if (hit && parsed.ip) {
          injections++;
          await quarantineIp(parsed.ip, `prompt-injection: ${hit.source.slice(0, 60)}`, "high");
          quarantined.add(parsed.ip);
        }
      }
    }
  }

  for (const [ip, count] of ipMinuteBuckets) {
    if (count >= REQ_PER_MIN_HIGH) {
      await quarantineIp(ip, `velocity ${count}/min (high)`, "high");
      quarantined.add(ip);
      velocity++;
    } else if (count >= REQ_PER_MIN_MEDIUM) {
      await quarantineIp(ip, `velocity ${count}/min (medium)`, "medium");
      quarantined.add(ip);
      velocity++;
    }
  }

  await redis.set(LAST_ID_KEY, nextCursor);

  return {
    consumed: entries.length,
    flaggedInjections: injections,
    flaggedVelocity: velocity,
    quarantinedIps: Array.from(quarantined),
  };
}

const QUARANTINE_TTL_MS: Record<string, number> = {
  low: 60 * 60 * 1000,
  medium: 6 * 60 * 60 * 1000,
  high: 24 * 60 * 60 * 1000,
};

const quarantineKey = (ip: string) => `keen:quarantine:ip:${ip}`;

export async function quarantineIp(
  ip: string,
  reason: string,
  severity: "low" | "medium" | "high",
): Promise<void> {
  const ttl = QUARANTINE_TTL_MS[severity] ?? QUARANTINE_TTL_MS.medium;
  const expiresAt = new Date(Date.now() + ttl);
  await prisma.keenQuarantineIp.upsert({
    where: { ip },
    create: { ip, reason, severity, hits: 1, expiresAt },
    update: {
      reason,
      severity,
      hits: { increment: 1 },
      lastSeenAt: new Date(),
      expiresAt,
      releasedAt: null,
    },
  });

  // Fast-path flag for middleware. Single HTTP GET vs a DB roundtrip.
  if (isRedisConfigured()) {
    try {
      const redis = getRedis();
      await redis.set(quarantineKey(ip), severity, { ex: Math.floor(ttl / 1000) });
    } catch {
      // Postgres remains the source of truth even if Redis hiccups.
    }
  }
}

/**
 * True if the IP is currently quarantined. Reads Redis first (fast path used
 * by middleware), falls back to Postgres if Redis is unconfigured.
 */
export async function isIpQuarantined(ip: string): Promise<boolean> {
  if (!ip) return false;
  if (isRedisConfigured()) {
    try {
      const redis = getRedis();
      const v = await redis.get<string>(quarantineKey(ip));
      if (v) return true;
    } catch {
      // fall through to Postgres
    }
  }
  const row = await prisma.keenQuarantineIp.findUnique({ where: { ip } });
  if (!row) return false;
  if (row.releasedAt) return false;
  if (row.expiresAt && row.expiresAt.getTime() < Date.now()) return false;
  return true;
}

export async function releaseIp(ip: string): Promise<void> {
  await prisma.keenQuarantineIp.updateMany({
    where: { ip },
    data: { releasedAt: new Date() },
  });
  if (isRedisConfigured()) {
    try {
      await getRedis().del(quarantineKey(ip));
    } catch {
      // ignore — Postgres releasedAt is authoritative
    }
  }
}
