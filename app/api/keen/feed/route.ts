import { NextResponse } from "next/server";
import { listFeed } from "@/keen";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 20), 100);
  const kind = url.searchParams.get("kind") as
    | "youtube_video"
    | "instagram_post"
    | "instagram_reel"
    | "blog"
    | null;
  const locale = url.searchParams.get("locale") ?? undefined;

  const items = await listFeed({
    limit,
    kind: kind ?? undefined,
    locale,
  });
  return NextResponse.json({
    items: items.map((i) => ({
      id: i.id,
      kind: i.kind,
      title: i.title,
      description: i.description,
      tags: i.tags,
      mediaUrl: i.mediaUrl,
      thumbnailUrl: i.thumbnailUrl,
      locale: i.locale,
      publishedAt: i.publishedAt,
      metrics: i.metrics,
    })),
  });
}
