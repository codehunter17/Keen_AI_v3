/**
 * app_content_feed — what the public frontend renders.
 *
 * Single source of truth for "content Keen has shipped to social." Frontend
 * reads from here and never talks to YouTube / Instagram directly. That keeps
 * UI fast (Postgres query) and resilient (platform outages don't break the
 * landing page).
 */

import { prisma } from "@/lib/prisma";

export interface FeedItemInput {
  kind: "youtube_video" | "instagram_post" | "instagram_reel" | "blog";
  title: string;
  description: string;
  tags?: string[];
  mediaUrl: string;
  thumbnailUrl?: string;
  locale?: string;
  source?: "keen" | "manual";
  externalId?: string;
  metrics?: Record<string, unknown>;
}

export async function saveFeedItem(input: FeedItemInput) {
  return prisma.appContentFeed.create({
    data: {
      kind: input.kind,
      title: input.title.slice(0, 200),
      description: input.description.slice(0, 4000),
      tags: input.tags ?? [],
      mediaUrl: input.mediaUrl,
      thumbnailUrl: input.thumbnailUrl ?? null,
      locale: input.locale ?? "en",
      source: input.source ?? "keen",
      externalId: input.externalId ?? null,
      metrics: input.metrics as object | undefined,
    },
  });
}

export interface FeedQuery {
  limit?: number;
  kind?: FeedItemInput["kind"];
  locale?: string;
}

export async function listFeed(q: FeedQuery = {}) {
  return prisma.appContentFeed.findMany({
    where: {
      kind: q.kind,
      locale: q.locale,
    },
    orderBy: { publishedAt: "desc" },
    take: q.limit ?? 20,
  });
}

export async function updateMetrics(
  feedId: string,
  metrics: Record<string, unknown>,
) {
  return prisma.appContentFeed.update({
    where: { id: feedId },
    data: { metrics },
  });
}
