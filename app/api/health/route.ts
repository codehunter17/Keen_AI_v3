// GET /api/health
//
// Single endpoint for UptimeRobot / status-page monitoring. Returns 200
// with a configured-deps score even when downstream services are flaky —
// the API itself is up as long as Next.js responds. Use the body to
// decide whether you have a degraded state to alert on.
//
// Set up in UptimeRobot:
//   - Type: HTTPS
//   - URL: https://nutrimama-v3.vercel.app/api/health
//   - Interval: every 5 minutes
//   - Alert on: status != 200 OR body doesn't contain '"ok":true'
//
// The body shape:
//   {
//     ok: true,
//     uptime_iso: "2026-05-15T...",
//     dependencies: { database: true, llm: true, twilio: true, ... },
//     configured: "8/8",
//   }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
// Don't cache — UptimeRobot needs fresh checks
export const dynamic = "force-dynamic";
export const revalidate = 0;

const APP_VERSION = "3.0.0";

function dependencyMap() {
  return {
    database: Boolean(process.env.DATABASE_URL),
    better_auth: Boolean(process.env.BETTER_AUTH_SECRET),
    llm_groq: Boolean(process.env.GROQ_API_KEY),
    llm_gemini: Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY),
    llm_anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
    razorpay: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    twilio: Boolean(
      process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_VERIFY_SERVICE_SID,
    ),
    email: Boolean(process.env.RESEND_API_KEY),
  };
}

export async function GET() {
  const deps = dependencyMap();
  const configuredCount = Object.values(deps).filter(Boolean).length;
  const total = Object.keys(deps).length;

  // Live ping of the database — actual round-trip, not just config check.
  // We catch and report rather than 500ing so the monitor can tell if
  // the issue is DB-down vs server-down.
  let dbAlive = false;
  try {
    // SELECT 1 — cheapest possible query
    await prisma.$queryRaw`SELECT 1`;
    dbAlive = true;
  } catch (err) {
    console.warn("[health] DB ping failed:", (err as Error).message);
  }

  const missing = Object.entries(deps)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  return NextResponse.json(
    {
      ok: true,
      app: "NutriMama",
      version: APP_VERSION,
      uptime_iso: new Date().toISOString(),
      database_live: dbAlive,
      configured: `${configuredCount}/${total}`,
      dependencies: deps,
      missing: missing.length === 0 ? null : missing,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
