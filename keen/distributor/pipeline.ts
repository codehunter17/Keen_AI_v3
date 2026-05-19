/**
 * Media pipeline orchestration.
 *
 * Stages:
 *   1. Create a KeenMediaJob row (status=queued).
 *   2. Generate metadata via LLM.
 *   3. Upload to the target platform (YouTube or Instagram).
 *   4. On success, persist into app_content_feed and link feedId on the job.
 *   5. Always update the job with platform externalId / errorTail.
 *
 * Non-blocking from the caller's perspective — callers fire this from a cron
 * route or a background worker, not a request handler.
 */

import { prisma } from "@/lib/prisma";
import { generateMedia } from "./media-generator";
import { uploadToYouTube } from "./youtube";
import { publishToInstagram } from "./instagram";
import { saveFeedItem } from "./feed";

export interface RunPipelineInput {
  platform: "youtube" | "instagram";
  kind: "video" | "reel" | "image";
  topic: string;
  assetUrl?: string;
  context?: string;
  proposalId?: string;
  /** Defaults to "private" on YouTube so nothing public ships without operator review. */
  privacyStatus?: "public" | "unlisted" | "private";
}

export interface RunPipelineResult {
  jobId: string;
  status: "published" | "failed";
  externalId: string | null;
  externalUrl: string | null;
  feedId: string | null;
  mode: "real" | "mock" | "skipped";
  detail?: string;
}

export async function runMediaPipeline(
  input: RunPipelineInput,
): Promise<RunPipelineResult> {
  const job = await prisma.keenMediaJob.create({
    data: {
      platform: input.platform,
      kind: input.kind,
      status: "queued",
      title: "(generating)",
      description: "(generating)",
      assetUrl: input.assetUrl ?? null,
      proposalId: input.proposalId ?? null,
    },
    select: { id: true },
  });

  const media = await generateMedia({
    platform: input.platform,
    kind: input.kind,
    topic: input.topic,
    context: input.context,
  });

  await prisma.keenMediaJob.update({
    where: { id: job.id },
    data: {
      status: "uploading",
      title: media.title,
      description: media.description,
      tags: media.tags,
      script: media.script,
    },
  });

  if (input.platform === "youtube") {
    const up = await uploadToYouTube({
      title: media.title,
      description: media.description,
      tags: media.tags,
      assetUrl: input.assetUrl,
      privacyStatus: input.privacyStatus ?? "private",
    });
    return finalizeJob(job.id, up.ok, up.mode, {
      externalId: up.videoId,
      externalUrl: up.videoUrl,
      thumbnailUrl: up.thumbnailUrl,
      feedKind: "youtube_video",
      title: media.title,
      description: media.description,
      tags: media.tags,
      locale: media.locale,
      detail: up.detail,
    });
  }

  const ig = await publishToInstagram({
    caption: media.description,
    kind: input.kind === "image" ? "image" : "reel",
    assetUrl: input.assetUrl,
  });
  return finalizeJob(job.id, ig.ok, ig.mode, {
    externalId: ig.mediaId,
    externalUrl: ig.permalink,
    thumbnailUrl: null,
    feedKind: input.kind === "image" ? "instagram_post" : "instagram_reel",
    title: media.title,
    description: media.description,
    tags: media.tags,
    locale: media.locale,
    detail: ig.detail,
  });
}

async function finalizeJob(
  jobId: string,
  ok: boolean,
  mode: "real" | "mock",
  ctx: {
    externalId: string | null;
    externalUrl: string | null;
    thumbnailUrl: string | null;
    feedKind: "youtube_video" | "instagram_post" | "instagram_reel";
    title: string;
    description: string;
    tags: string[];
    locale: string;
    detail?: string;
  },
): Promise<RunPipelineResult> {
  if (!ok || !ctx.externalUrl) {
    await prisma.keenMediaJob.update({
      where: { id: jobId },
      data: {
        status: "failed",
        externalId: ctx.externalId,
        externalUrl: ctx.externalUrl,
        errorTail: (ctx.detail ?? "unknown failure").slice(0, 4000),
      },
    });
    return {
      jobId,
      status: "failed",
      externalId: ctx.externalId,
      externalUrl: ctx.externalUrl,
      feedId: null,
      mode,
      detail: ctx.detail,
    };
  }

  const feed = await saveFeedItem({
    kind: ctx.feedKind,
    title: ctx.title,
    description: ctx.description,
    tags: ctx.tags,
    mediaUrl: ctx.externalUrl,
    thumbnailUrl: ctx.thumbnailUrl ?? undefined,
    locale: ctx.locale,
    source: "keen",
    externalId: ctx.externalId ?? undefined,
  });

  await prisma.keenMediaJob.update({
    where: { id: jobId },
    data: {
      status: "published",
      externalId: ctx.externalId,
      externalUrl: ctx.externalUrl,
      feedId: feed.id,
      publishedAt: new Date(),
    },
  });

  return {
    jobId,
    status: "published",
    externalId: ctx.externalId,
    externalUrl: ctx.externalUrl,
    feedId: feed.id,
    mode,
    detail: ctx.detail,
  };
}
