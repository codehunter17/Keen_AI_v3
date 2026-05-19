/**
 * Nightly cron — runs Observer for the last 24h window.
 *
 * Triggered by Vercel Cron via vercel.json. Authorized via CRON_SECRET so
 * the endpoint is not publicly invocable.
 */

import { NextResponse } from "next/server";
import { observe, nutrimamaHost } from "@/keen";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET ?? ""}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const until = new Date();
  const since = new Date(until.getTime() - 24 * 60 * 60 * 1000);

  try {
    const result = await observe(nutrimamaHost, since, until);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
