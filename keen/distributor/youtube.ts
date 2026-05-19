/**
 * YouTube Data API v3 — upload wrapper.
 *
 * Two modes:
 *   - REAL: when YOUTUBE_OAUTH_ACCESS_TOKEN and a downloadable assetUrl are
 *     present, performs a resumable upload via videos.insert.
 *   - MOCK: when env vars are missing, simulates a successful upload so the
 *     downstream pipeline (feed insert, webhook handling) is still exercisable
 *     in dev. Mock URLs use a `mock://` prefix so they're trivially detectable.
 */

import { randomUUID } from "node:crypto";

const UPLOAD_URL =
  "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status";

export interface YouTubeUploadInput {
  title: string;
  description: string;
  tags: string[];
  /** Public URL of the video file to upload. */
  assetUrl?: string;
  privacyStatus?: "public" | "unlisted" | "private";
  categoryId?: string;
}

export interface YouTubeUploadResult {
  ok: boolean;
  mode: "real" | "mock";
  videoId: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  detail?: string;
}

export async function uploadToYouTube(
  input: YouTubeUploadInput,
): Promise<YouTubeUploadResult> {
  const accessToken = process.env.YOUTUBE_OAUTH_ACCESS_TOKEN;

  if (!accessToken || !input.assetUrl) {
    const mockId = `mock-${randomUUID().slice(0, 11)}`;
    return {
      ok: true,
      mode: "mock",
      videoId: mockId,
      videoUrl: `mock://youtube.com/watch?v=${mockId}`,
      thumbnailUrl: `mock://i.ytimg.com/vi/${mockId}/hqdefault.jpg`,
      detail: accessToken ? "no asset URL — mock upload" : "no oauth token — mock upload",
    };
  }

  try {
    const assetRes = await fetch(input.assetUrl);
    if (!assetRes.ok) {
      return {
        ok: false,
        mode: "real",
        videoId: null,
        videoUrl: null,
        thumbnailUrl: null,
        detail: `asset fetch failed: ${assetRes.status}`,
      };
    }
    const assetBuffer = await assetRes.arrayBuffer();

    const metadata = {
      snippet: {
        title: input.title,
        description: input.description,
        tags: input.tags,
        categoryId: input.categoryId ?? "22",
      },
      status: { privacyStatus: input.privacyStatus ?? "private" },
    };

    const boundary = `keen-${randomUUID()}`;
    const body = buildMultipart(boundary, metadata, assetBuffer);

    const res = await fetch(UPLOAD_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: body as unknown as BodyInit,
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        ok: false,
        mode: "real",
        videoId: null,
        videoUrl: null,
        thumbnailUrl: null,
        detail: `youtube ${res.status}: ${text.slice(0, 200)}`,
      };
    }

    const data = (await res.json()) as { id?: string };
    const videoId = data.id ?? null;
    return {
      ok: Boolean(videoId),
      mode: "real",
      videoId,
      videoUrl: videoId ? `https://www.youtube.com/watch?v=${videoId}` : null,
      thumbnailUrl: videoId
        ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
        : null,
    };
  } catch (err) {
    return {
      ok: false,
      mode: "real",
      videoId: null,
      videoUrl: null,
      thumbnailUrl: null,
      detail: err instanceof Error ? err.message : "youtube upload failed",
    };
  }
}

function buildMultipart(
  boundary: string,
  metadata: object,
  asset: ArrayBuffer,
): Buffer {
  const head =
    `--${boundary}\r\n` +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    `\r\n--${boundary}\r\n` +
    "Content-Type: video/*\r\n\r\n";
  const tail = `\r\n--${boundary}--`;
  return Buffer.concat([Buffer.from(head, "utf8"), Buffer.from(asset), Buffer.from(tail, "utf8")]);
}
