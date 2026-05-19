/**
 * Instagram Graph API — publish wrapper.
 *
 * Two-step publish flow per Meta docs:
 *   1. POST /{ig-user-id}/media   → returns a container id
 *   2. POST /{ig-user-id}/media_publish?creation_id=...
 *
 * Mock mode kicks in when INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_USER_ID are
 * missing. Mock URLs prefix `mock://` for clean filtering downstream.
 */

import { randomUUID } from "node:crypto";

const GRAPH_API = "https://graph.facebook.com/v21.0";

export interface InstagramPublishInput {
  caption: string;
  kind: "image" | "reel";
  /** Public URL of the asset. Image for "image", mp4 for "reel". */
  assetUrl?: string;
}

export interface InstagramPublishResult {
  ok: boolean;
  mode: "real" | "mock";
  mediaId: string | null;
  permalink: string | null;
  detail?: string;
}

export async function publishToInstagram(
  input: InstagramPublishInput,
): Promise<InstagramPublishResult> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!token || !userId || !input.assetUrl) {
    const mockId = `mock-${randomUUID().slice(0, 17)}`;
    return {
      ok: true,
      mode: "mock",
      mediaId: mockId,
      permalink: `mock://instagram.com/p/${mockId}/`,
      detail: token && userId ? "no asset URL — mock publish" : "no credentials — mock publish",
    };
  }

  try {
    // Step 1: create container.
    const containerParams = new URLSearchParams({
      caption: input.caption.slice(0, 2200),
      access_token: token,
    });
    if (input.kind === "reel") {
      containerParams.set("video_url", input.assetUrl);
      containerParams.set("media_type", "REELS");
    } else {
      containerParams.set("image_url", input.assetUrl);
    }

    const containerRes = await fetch(
      `${GRAPH_API}/${userId}/media?${containerParams.toString()}`,
      { method: "POST" },
    );
    if (!containerRes.ok) {
      const text = await containerRes.text();
      return {
        ok: false,
        mode: "real",
        mediaId: null,
        permalink: null,
        detail: `container ${containerRes.status}: ${text.slice(0, 200)}`,
      };
    }
    const containerData = (await containerRes.json()) as { id?: string };
    if (!containerData.id) {
      return {
        ok: false,
        mode: "real",
        mediaId: null,
        permalink: null,
        detail: "container returned no id",
      };
    }

    // Step 2: publish.
    const publishParams = new URLSearchParams({
      creation_id: containerData.id,
      access_token: token,
    });
    const publishRes = await fetch(
      `${GRAPH_API}/${userId}/media_publish?${publishParams.toString()}`,
      { method: "POST" },
    );
    if (!publishRes.ok) {
      const text = await publishRes.text();
      return {
        ok: false,
        mode: "real",
        mediaId: containerData.id,
        permalink: null,
        detail: `publish ${publishRes.status}: ${text.slice(0, 200)}`,
      };
    }

    const publishData = (await publishRes.json()) as { id?: string };
    const mediaId = publishData.id ?? containerData.id;

    // Resolve permalink (best-effort).
    let permalink: string | null = null;
    try {
      const permaRes = await fetch(
        `${GRAPH_API}/${mediaId}?fields=permalink&access_token=${token}`,
      );
      if (permaRes.ok) {
        const data = (await permaRes.json()) as { permalink?: string };
        permalink = data.permalink ?? null;
      }
    } catch {
      // ignore — caller can rebuild from mediaId later
    }

    return { ok: true, mode: "real", mediaId, permalink };
  } catch (err) {
    return {
      ok: false,
      mode: "real",
      mediaId: null,
      permalink: null,
      detail: err instanceof Error ? err.message : "instagram publish failed",
    };
  }
}
