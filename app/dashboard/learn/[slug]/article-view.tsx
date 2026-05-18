"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Clock, Share2, Tag, ExternalLink } from "lucide-react";

interface ContentItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string | null;
  videoUrl: string | null;
  instagramUrl: string | null;
  thumbnailUrl: string | null;
  durationSec: number | null;
  readTimeMin: number | null;
  language: string;
  topics: string[];
  lifeStages: string[];
  ageBands: string[];
  parentalGuidance: boolean;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  source: string | null;
  sourceUrl: string | null;
  isUserSubmitted: boolean;
  createdAt: Date;
}

// Extract YouTube video ID from any YouTube URL
function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

function handleShare(title: string) {
  if (typeof navigator === "undefined") return;
  if (navigator.share) {
    navigator.share({ title, url: window.location.href }).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    alert("Link copied!");
  }
}

export function ArticleView({ item }: { item: ContentItem }) {
  const ytId = item.videoUrl ? getYouTubeId(item.videoUrl) : null;
  const hasVideo = !!(item.videoUrl || item.instagramUrl);

  return (
    <main className="w-full max-w-3xl mx-auto pb-12">
      {/* Coloured hero banner — mirrors Blog.jsx's per-post colour header */}
      <div className="bg-gradient-to-br from-primary to-secondary px-5 pt-12 pb-8 text-white rounded-b-3xl mb-6">
        <Link
          href="/dashboard/learn"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white mb-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Category chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.topics.slice(0, 2).map((t) => (
            <span
              key={t}
              className="inline-block text-[10px] font-bold uppercase tracking-widest bg-white/20 rounded-full px-2.5 py-0.5"
            >
              {t}
            </span>
          ))}
          {item.parentalGuidance && (
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-amber-400/80 text-amber-900 rounded-full px-2.5 py-0.5">
              🧑‍👧 Parent co-watch
            </span>
          )}
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl leading-tight mb-3">{item.title}</h1>
        <p className="text-sm text-white/85 leading-relaxed">{item.summary}</p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-white/70">
          {item.readTimeMin && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {item.readTimeMin} min read
            </span>
          )}
          {item.reviewedBy && (
            <span>✅ Reviewed by {item.reviewedBy}</span>
          )}
          {item.isUserSubmitted && (
            <span>👤 Community</span>
          )}
          <button
            onClick={() => handleShare(item.title)}
            className="ml-auto flex items-center gap-1 hover:text-white transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 space-y-6">
        {/* Thumbnail (non-YouTube) */}
        {item.thumbnailUrl && !ytId && (
          <div className="rounded-2xl overflow-hidden aspect-video bg-muted shadow-md">
            <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* YouTube inline embed */}
        {ytId && (
          <div className="rounded-2xl overflow-hidden aspect-video bg-black shadow-lg">
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}

        {/* Article body */}
        {item.body && (
          <article className="prose prose-sm sm:prose dark:prose-invert max-w-none prose-headings:font-heading prose-a:text-primary prose-strong:text-foreground">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {item.body}
            </ReactMarkdown>
          </article>
        )}

        {/* ── Video Section — Blog.jsx style: big full-width gradient cards ── */}
        {hasVideo && (
          <div>
            <p className="text-base font-extrabold text-foreground mb-3 font-heading">
              🎥 Watch Information Video:
            </p>

            <div className="flex flex-col gap-4">
              {/* YouTube card — red gradient, full width, 180px tall */}
              {item.videoUrl && (
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-full overflow-hidden rounded-2xl shadow-lg"
                  style={{ height: 180, background: "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)" }}
                >
                  {/* subtle overlay */}
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {/* White play button pill */}
                    <div className="w-16 h-11 rounded-xl bg-white flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF0000">
                        <path d="M5 3l14 9-14 9V3z" />
                      </svg>
                    </div>
                    <span className="text-white text-base font-extrabold tracking-wide drop-shadow">
                      Watch on YouTube
                    </span>
                  </div>
                </a>
              )}

              {/* Instagram card — Instagram gradient, full width, 180px tall */}
              {item.instagramUrl && (
                <a
                  href={item.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-full overflow-hidden rounded-2xl shadow-lg"
                  style={{
                    height: 180,
                    background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                  }}
                >
                  <div className="absolute inset-0 bg-black/15" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {/* Frosted circle play button */}
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                      style={{
                        background: "rgba(255,255,255,0.25)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.5)",
                      }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: 4 }}>
                        <path d="M5 3l14 9-14 9V3z" />
                      </svg>
                    </div>
                    <span className="text-white text-base font-extrabold tracking-wide drop-shadow">
                      Play Instagram Reel
                    </span>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Medical disclaimer — matches Blog.jsx */}
        <div className="rounded-2xl bg-muted/60 border border-border p-4 text-xs text-muted-foreground italic">
          ⚕️ This article is for informational purposes only and is not a substitute for professional medical advice.
          Always consult your OB-GYN or a qualified healthcare provider for personal guidance.
        </div>

        {/* Source citation */}
        {(item.source || item.sourceUrl) && (
          <div className="flex gap-2 text-xs text-muted-foreground">
            <Tag className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              Source:{" "}
              {item.sourceUrl ? (
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                  {item.source ?? item.sourceUrl}
                </a>
              ) : (
                item.source
              )}
            </p>
          </div>
        )}

        {/* Back link */}
        <Link
          href="/dashboard/learn"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline pt-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all articles
        </Link>
      </div>
    </main>
  );
}
