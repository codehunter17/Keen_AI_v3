/**
 * YouTube push notifications (PubSubHubbub).
 *
 * GET — subscription challenge. Echoes hub.challenge if hub.topic looks like
 *       a YouTube videos feed.
 * POST — Atom XML feed updates. Parsed leniently — we only need videoId +
 *        title to refresh the matching app_content_feed row.
 *
 * Live metric updates require a separate YouTube Data API poll; this webhook
 * only signals "something changed, go refresh." A future cron can do the poll.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const challenge = url.searchParams.get("hub.challenge");
  if (mode === "subscribe" && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("forbidden", { status: 403 });
}

const VIDEO_ID_RE = /<yt:videoId>([^<]+)<\/yt:videoId>/;
const TITLE_RE = /<title>([^<]+)<\/title>/;

export async function POST(req: Request) {
  const raw = await req.text();
  const videoId = raw.match(VIDEO_ID_RE)?.[1];
  const title = raw.match(TITLE_RE)?.[1];
  if (!videoId) return NextResponse.json({ ok: false, error: "no videoId" });

  const feed = await prisma.appContentFeed.findFirst({
    where: { externalId: videoId },
    select: { id: true, metrics: true },
  });
  if (!feed) return NextResponse.json({ ok: true, found: false });

  const merged = {
    ...((feed.metrics as Record<string, unknown> | null) ?? {}),
    lastNotification: new Date().toISOString(),
    notifiedTitle: title,
  };
  await prisma.appContentFeed.update({
    where: { id: feed.id },
    data: { metrics: merged as object },
  });

  return NextResponse.json({ ok: true });
}
