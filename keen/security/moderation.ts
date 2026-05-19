/**
 * Pre-commit content moderation worker.
 *
 * Every user-authored string that would persist publicly (chat that other
 * users can see, posts, media captions, report notes) MUST pass through
 * `moderate()` BEFORE the host writes it. Flagged content is routed to
 * keen_quarantine instead of the target table, and the caller receives
 * `{allowed: false}` so it can show a soft-block UX.
 *
 * Strict JSON schema enforced by the model + a defensive parser. If the LLM
 * returns garbage the worker fails-closed (treat as flagged) — never silently
 * lets content through on parser errors.
 */

import { prisma } from "@/lib/prisma";
import { llm, safeJson } from "../llm";

export type ContentKind = "chat" | "post" | "media_caption" | "report_note";

const SYSTEM_PROMPT = `You are a strict pre-commit content moderator for a women's health app.

Decide whether the user-authored text below is safe to publish.

FLAG if it contains:
- Vulgarity, slurs, harassment, sexual content directed at minors
- Self-harm / suicide encouragement
- Medical misinformation likely to cause harm (e.g. unsafe abortion methods, anti-vaccine in pregnancy, herbal cures replacing emergency care)
- Doxxing of real persons, contact details, financial scams
- Promotion of illegal activity

DO NOT flag:
- Anatomical or clinical terms used appropriately
- Honest descriptions of symptoms
- Negative emotion ("I feel awful", "I hate this")
- Hindi / regional language — process them the same way

Return STRICT JSON only, no prose:
{
  "allowed": true|false,
  "flag_reason": "short string"|null,
  "confidence": number between 0 and 1
}`;

export interface ModerationDecision {
  allowed: boolean;
  flag_reason: string | null;
  confidence: number;
  modelUsed: string;
  quarantinedId?: string;
}

export interface ModerateInput {
  content: string;
  contentKind: ContentKind;
  pseudonym?: string;
}

export async function moderate(input: ModerateInput): Promise<ModerationDecision> {
  const content = input.content?.trim() ?? "";
  if (!content) {
    return {
      allowed: false,
      flag_reason: "empty content",
      confidence: 1,
      modelUsed: "rule:empty",
    };
  }
  if (content.length > 8000) {
    return await failClosed(input, "content exceeds 8000 chars", 1, "rule:length");
  }

  const userPrompt = `KIND: ${input.contentKind}\n\nTEXT:\n${content}\n\nReturn JSON.`;
  const result = await llm({
    system: SYSTEM_PROMPT,
    user: userPrompt,
    format: "json",
    temperature: 0,
  });

  type Raw = { allowed?: unknown; flag_reason?: unknown; confidence?: unknown };
  const parsed = safeJson<Raw>(result.text);

  if (!parsed || typeof parsed.allowed !== "boolean") {
    return failClosed(
      input,
      "moderator returned unparseable output",
      0.5,
      `${result.provider}:parse-fail`,
    );
  }

  const allowed = parsed.allowed;
  const flag_reason =
    typeof parsed.flag_reason === "string" ? parsed.flag_reason : null;
  const confidence =
    typeof parsed.confidence === "number"
      ? Math.max(0, Math.min(1, parsed.confidence))
      : 0.8;

  if (!allowed) {
    const row = await prisma.keenQuarantine.create({
      data: {
        pseudonym: input.pseudonym ?? null,
        contentKind: input.contentKind,
        content,
        flagReason: flag_reason ?? "unspecified",
        confidence,
        modelUsed: result.provider,
      },
      select: { id: true },
    });
    return {
      allowed: false,
      flag_reason,
      confidence,
      modelUsed: result.provider,
      quarantinedId: row.id,
    };
  }

  return { allowed: true, flag_reason: null, confidence, modelUsed: result.provider };
}

async function failClosed(
  input: ModerateInput,
  reason: string,
  confidence: number,
  modelUsed: string,
): Promise<ModerationDecision> {
  const row = await prisma.keenQuarantine.create({
    data: {
      pseudonym: input.pseudonym ?? null,
      contentKind: input.contentKind,
      content: input.content,
      flagReason: reason,
      confidence,
      modelUsed,
    },
    select: { id: true },
  });
  return {
    allowed: false,
    flag_reason: reason,
    confidence,
    modelUsed,
    quarantinedId: row.id,
  };
}
