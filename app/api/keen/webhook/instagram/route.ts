/**
 * Instagram Graph webhook receiver.
 *
 * Two verbs:
 *   GET — Meta subscription handshake. Echoes hub.challenge if hub.verify_token
 *         matches INSTAGRAM_WEBHOOK_VERIFY_TOKEN.
 *   POST — incoming events (comments, mentions, etc.). HMAC-SHA256 signed with
 *         INSTAGRAM_APP_SECRET; we verify before doing anything with the body.
 *
 * Verified events update the metrics column on the matching app_content_feed row.
 */

import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const expected = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;
  if (mode === "subscribe" && token && expected && token === expected && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("forbidden", { status: 403 });
}

export async function POST(req: Request) {
  const secret = process.env.INSTAGRAM_APP_SECRET;
  const signatureHeader = req.headers.get("x-hub-signature-256");
  const raw = await req.text();

  if (secret && signatureHeader) {
    const expected =
      "sha256=" + createHmac("sha256", secret).update(raw).digest("hex");
    const a = Buffer.from(signatureHeader);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return new NextResponse("bad signature", { status: 401 });
    }
  }

  type Change = {
    field?: string;
    value?: {
      media_id?: string;
      likes?: number;
      comments?: number;
      reach?: number;
      impressions?: number;
    };
  };
  type Event = { object?: string; entry?: { changes?: Change[] }[] };
  let event: Event;
  try {
    event = JSON.parse(raw) as Event;
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  for (const entry of event.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const mediaId = change.value?.media_id;
      if (!mediaId) continue;
      const feed = await prisma.appContentFeed.findFirst({
        where: { externalId: mediaId },
        select: { id: true, metrics: true },
      });
      if (!feed) continue;
      const merged = {
        ...(feed.metrics as Record<string, unknown> | null ?? {}),
        likes: change.value?.likes,
        comments: change.value?.comments,
        reach: change.value?.reach,
        impressions: change.value?.impressions,
        lastUpdated: new Date().toISOString(),
      };
      await prisma.appContentFeed.update({
        where: { id: feed.id },
        data: { metrics: merged as object },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
