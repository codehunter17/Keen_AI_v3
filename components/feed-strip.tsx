"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Play, ExternalLink } from "lucide-react";

type FeedItem = {
  id: string;
  kind: "youtube_video" | "instagram_post" | "instagram_reel" | "blog";
  title: string;
  description: string;
  tags: string[];
  mediaUrl: string;
  thumbnailUrl: string | null;
  locale: string;
  publishedAt: string;
};

async function fetchFeed(): Promise<FeedItem[]> {
  const res = await fetch("/api/keen/feed?limit=8", { cache: "no-store" });
  if (!res.ok) return [];
  const data = (await res.json()) as { items: FeedItem[] };
  return data.items ?? [];
}

export function FeedStrip() {
  const { data, isLoading } = useQuery({
    queryKey: ["keen-feed"],
    queryFn: fetchFeed,
    staleTime: 5 * 60 * 1000,
  });

  const items = (data ?? []).filter((i) => !i.mediaUrl.startsWith("mock://"));

  if (isLoading || items.length === 0) {
    return null; // strip silently when there's nothing real to show
  }

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold text-xs uppercase tracking-widest mb-3">
            Fresh from NutriMama
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-bold">
            What we're sharing this week
          </h2>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.slice(0, 8).map((item) => (
          <a
            key={item.id}
            href={item.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-3xl border border-border bg-card hover:shadow-xl transition-all hover:scale-[1.02]"
          >
            <div className="aspect-square relative bg-muted">
              {item.thumbnailUrl ? (
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-primary/30">
                  <Play className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                {labelFor(item.kind)}
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold leading-snug line-clamp-2">
                {item.title}
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                <span>{item.locale.toUpperCase()}</span>
                <ExternalLink className="w-3 h-3 group-hover:text-primary transition-colors" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function labelFor(kind: FeedItem["kind"]): string {
  switch (kind) {
    case "youtube_video":
      return "Video";
    case "instagram_reel":
      return "Reel";
    case "instagram_post":
      return "Post";
    case "blog":
      return "Read";
  }
}
