/**
 * Edge middleware — Keen integration.
 *
 * Runs on Vercel Edge runtime. Must NOT import Node-only modules (Prisma,
 * @upstash/redis SDK). Talks to Upstash REST directly with `fetch`.
 *
 * Responsibilities:
 *   1. Block IPs Keen has quarantined (Redis GET, sub-10ms).
 *   2. Fire-and-forget XADD to the telemetry stream so the drain cron + the
 *      recursive optimizer have raw events to chew on.
 *
 * Order matters: quarantine check FIRST so flagged IPs never reach app code.
 */

import { NextResponse, type NextRequest } from "next/server";

const STREAM_KEY = "keen:telemetry:events";

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "0.0.0.0";
}

async function upstash(commandPath: string): Promise<Response | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    return await fetch(`${url}${commandPath}`, {
      headers: { Authorization: `Bearer ${token}` },
      // Edge fetch — no caching by default; keep it explicit.
      cache: "no-store",
    });
  } catch {
    return null;
  }
}

async function isQuarantined(ip: string): Promise<boolean> {
  const res = await upstash(`/get/keen:quarantine:ip:${encodeURIComponent(ip)}`);
  if (!res?.ok) return false;
  try {
    const data = (await res.json()) as { result?: string | null };
    return Boolean(data.result);
  } catch {
    return false;
  }
}

async function pushTelemetry(payload: Record<string, unknown>): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return;
  const body = JSON.stringify(payload);
  // XADD <key> NOMKSTREAM 0 MAXLEN ~ 50000 * event <body>
  const args = [
    "XADD",
    STREAM_KEY,
    "MAXLEN",
    "~",
    "50000",
    "*",
    "event",
    body,
  ].map((a) => encodeURIComponent(a));
  try {
    await fetch(`${url}/${args.join("/")}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      // Don't await error logging — keep middleware fast.
    });
  } catch {
    // never throw from middleware
  }
}

export async function middleware(req: NextRequest) {
  const ip = clientIp(req);

  if (await isQuarantined(ip)) {
    return new NextResponse("forbidden", { status: 403 });
  }

  // Fire-and-forget. We deliberately do NOT await — the response shouldn't
  // wait on telemetry. Vercel Edge will let pending fetches finish briefly
  // after the response is sent.
  void pushTelemetry({
    kind: "request",
    ip,
    route: req.nextUrl.pathname,
    method: req.method,
    userAgent: req.headers.get("user-agent") ?? null,
    ts: Date.now(),
  });

  return NextResponse.next();
}

export const config = {
  // Skip static assets + Keen's own API surface to avoid telemetry self-loops.
  matcher: [
    "/((?!_next/static|_next/image|favicon|api/keen/|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico)).*)",
  ],
};
