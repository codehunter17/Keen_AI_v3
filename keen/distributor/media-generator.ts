/**
 * Media asset generator.
 *
 * LLM produces structured metadata for an upcoming social post: title,
 * description (with hashtags), tags, script body. Output is strict JSON so the
 * uploader can drop it straight into YouTube Data / Instagram Graph payloads.
 *
 * The asset file itself (video / image) is NOT created here — that's a
 * separate pipeline (text-to-video or stock-image pick). Generator returns
 * the metadata + an optional placeholder asset URL the operator can swap.
 */

import { llm, safeJson } from "../llm";

const SYSTEM_PROMPT = `You write structured social-media metadata for a women's health brand.

Tone: warm, evidence-grounded, jargon-free Hinglish + English. Aimed at Indian audience (pregnancy / postpartum / cycle / PCOS).

Hard rules — NEVER mention these in any output:
- the platform's owners or operators by name
- diagnostic claims ("you have X")
- guarantees of medical outcomes
- specific drug brands without generic name first

Return STRICT JSON, no prose around it:
{
  "title": "string under 70 chars",
  "description": "string 200-400 chars including 4-8 hashtags",
  "tags": ["6-12 short keyword tags, no #"],
  "script": "string 60-180 words — the actual spoken/written body for the video or post",
  "locale": "en" | "hi" | "hinglish",
  "suggestedAssetPrompt": "short prompt an image/video generator could use"
}`;

export interface GenerateInput {
  platform: "youtube" | "instagram";
  kind: "video" | "reel" | "image";
  topic: string;
  /** Optional context Keen pulled from recent observations / cases. */
  context?: string;
}

export interface GeneratedMedia {
  ok: boolean;
  title: string;
  description: string;
  tags: string[];
  script: string;
  locale: string;
  suggestedAssetPrompt: string;
  provider: string;
}

export async function generateMedia(input: GenerateInput): Promise<GeneratedMedia> {
  const userPrompt = `Platform: ${input.platform}\nKind: ${input.kind}\nTopic: ${input.topic}\n${input.context ? `Context:\n${input.context}` : ""}\n\nReturn JSON.`;

  const result = await llm({
    system: SYSTEM_PROMPT,
    user: userPrompt,
    format: "json",
    temperature: 0.4,
  });

  type Parsed = {
    title?: string;
    description?: string;
    tags?: string[];
    script?: string;
    locale?: string;
    suggestedAssetPrompt?: string;
  };
  const parsed = safeJson<Parsed>(result.text);

  if (!parsed || !parsed.title || !parsed.description) {
    return {
      ok: false,
      title: input.topic.slice(0, 70),
      description: input.topic,
      tags: [],
      script: "",
      locale: "en",
      suggestedAssetPrompt: input.topic,
      provider: result.provider,
    };
  }

  return {
    ok: true,
    title: parsed.title.slice(0, 70),
    description: parsed.description.slice(0, 2200),
    tags: (parsed.tags ?? []).slice(0, 12),
    script: (parsed.script ?? "").slice(0, 2000),
    locale: parsed.locale ?? "en",
    suggestedAssetPrompt: parsed.suggestedAssetPrompt ?? input.topic,
    provider: result.provider,
  };
}
