// Unified LLM client with multi-provider failover.
//
// Why this exists: any one provider can rate-limit, outage, or 5xx.
// By chaining Groq → Gemini → Anthropic we keep the app working.
//
// Two surfaces:
//   streamText({prompt, system}) → AsyncIterable<string>   (chat streaming)
//   invokeMultimodal({prompt, image, mimeType}) → string   (one-shot, e.g. reports)

import "server-only";
import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// ─── Provider registry ───────────────────────────────────────
type Provider = "groq" | "gemini" | "anthropic";

const MODELS = {
  groq: "llama-3.3-70b-versatile",
  gemini: "gemini-2.5-flash",
  anthropic: "claude-sonnet-4-6",
} as const;

function envKey(p: Provider): string | undefined {
  if (p === "groq") return process.env.GROQ_API_KEY;
  if (p === "gemini") return process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (p === "anthropic") return process.env.ANTHROPIC_API_KEY;
  return undefined;
}

function configured(p: Provider): boolean {
  const k = envKey(p);
  return !!k && k.length > 5;
}

function parseOrder(envVal: string | undefined, fallback: Provider[]): Provider[] {
  if (!envVal) return fallback;
  const parts = envVal
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is Provider => s === "groq" || s === "gemini" || s === "anthropic");
  return parts.length > 0 ? parts : fallback;
}

// Text-chat order: speed-first, free-first, premium-last.
function textOrder(): Provider[] {
  const order = parseOrder(process.env.LLM_TEXT_ORDER, ["groq", "gemini", "anthropic"]);
  return order.filter(configured);
}

// Premium order: paid tiers get Anthropic Sonnet first (highest reasoning).
// Falls through to free providers if Anthropic isn't configured or fails.
function premiumTextOrder(): Provider[] {
  const order = parseOrder(
    process.env.LLM_PREMIUM_TEXT_ORDER,
    ["anthropic", "gemini", "groq"],
  );
  return order.filter(configured);
}

// Multimodal order: only providers with vision, free-first.
function visionOrder(): Provider[] {
  const order = parseOrder(process.env.LLM_VISION_ORDER, ["gemini", "anthropic"]);
  return order.filter((p) => p !== "groq").filter(configured);
}

// ─── Streaming chat ──────────────────────────────────────────
export interface StreamOpts {
  system?: string;
  prompt: string;
  history?: { role: "user" | "assistant"; content: string }[];
  temperature?: number;
  /** When true, prefer Anthropic Sonnet (paid tiers). Falls through. */
  premium?: boolean;
}

export interface StreamResult {
  iterator: AsyncIterable<string>;
  provider: Provider;
}

/**
 * Tries each configured provider in order. Returns the first one that
 * starts producing tokens. Falls through to next on connection / 4xx / 5xx
 * BEFORE the first token. Mid-stream errors are propagated to caller.
 */
export async function streamText(opts: StreamOpts): Promise<StreamResult> {
  const order = opts.premium ? premiumTextOrder() : textOrder();
  if (order.length === 0) {
    throw new Error(
      "No LLM provider configured. Set GROQ_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY, or ANTHROPIC_API_KEY.",
    );
  }

  const errors: { provider: Provider; error: unknown }[] = [];

  for (const provider of order) {
    try {
      const iterator = await openStream(provider, opts);
      // openStream resolves once the connection is established; if the
      // provider 4xx'd / 5xx'd we get rejection here and try the next.
      return { iterator, provider };
    } catch (err) {
      errors.push({ provider, error: err });
      console.warn(`[llm] ${provider} failed, falling back:`, errorSummary(err));
    }
  }

  throw new Error(
    `All LLM providers failed: ${errors
      .map((e) => `${e.provider}=${errorSummary(e.error)}`)
      .join("; ")}`,
  );
}

async function openStream(p: Provider, opts: StreamOpts): Promise<AsyncIterable<string>> {
  const messages = [
    ...(opts.system ? [new SystemMessage(opts.system)] : []),
    ...((opts.history ?? []).map((h) =>
      h.role === "user" ? new HumanMessage(h.content) : new SystemMessage(h.content),
    )),
    new HumanMessage(opts.prompt),
  ];

  const temperature = opts.temperature ?? 0.7;

  if (p === "groq") {
    const model = new ChatGroq({
      model: MODELS.groq,
      temperature,
      apiKey: envKey("groq")!,
    });
    const stream = await model.stream(messages);
    return mapToString(stream);
  }
  if (p === "gemini") {
    const model = new ChatGoogleGenerativeAI({
      model: MODELS.gemini,
      temperature,
      apiKey: envKey("gemini")!,
    });
    const stream = await model.stream(messages);
    return mapToString(stream);
  }
  // anthropic
  const model = new ChatAnthropic({
    model: MODELS.anthropic,
    temperature,
    apiKey: envKey("anthropic")!,
  });
  const stream = await model.stream(messages);
  return mapToString(stream);
}

async function* mapToString(stream: AsyncIterable<{ content: unknown }>): AsyncIterable<string> {
  for await (const chunk of stream) {
    const c = chunk.content;
    if (typeof c === "string") {
      yield c;
    } else if (Array.isArray(c)) {
      for (const part of c) {
        if (typeof part === "string") yield part;
        else if (part && typeof part === "object" && "text" in part && typeof (part as { text: unknown }).text === "string") {
          yield (part as { text: string }).text;
        }
      }
    }
  }
}

// ─── One-shot multimodal (vision) call — used by report analysis ─────
export interface MultimodalOpts {
  prompt: string;
  imageBase64: string;
  mimeType: string;        // e.g. "image/jpeg" or "application/pdf"
  temperature?: number;
}

export interface MultimodalResult {
  text: string;
  provider: Provider;
}

export async function invokeMultimodal(opts: MultimodalOpts): Promise<MultimodalResult> {
  const order = visionOrder();
  if (order.length === 0) {
    throw new Error(
      "No vision-capable LLM configured. Set GOOGLE_GENERATIVE_AI_API_KEY or ANTHROPIC_API_KEY.",
    );
  }

  const errors: { provider: Provider; error: unknown }[] = [];

  for (const provider of order) {
    try {
      const text = await invokeMultimodalOne(provider, opts);
      return { text, provider };
    } catch (err) {
      errors.push({ provider, error: err });
      console.warn(`[llm] vision ${provider} failed, falling back:`, errorSummary(err));
    }
  }

  throw new Error(
    `All vision providers failed: ${errors
      .map((e) => `${e.provider}=${errorSummary(e.error)}`)
      .join("; ")}`,
  );
}

async function invokeMultimodalOne(p: Provider, opts: MultimodalOpts): Promise<string> {
  const dataUrl = `data:${opts.mimeType};base64,${opts.imageBase64}`;

  if (p === "gemini") {
    const model = new ChatGoogleGenerativeAI({
      model: MODELS.gemini,
      temperature: opts.temperature ?? 0.4,
      apiKey: envKey("gemini")!,
    });
    const res = await model.invoke([
      new HumanMessage({
        content: [
          { type: "text", text: opts.prompt },
          { type: "image_url", image_url: { url: dataUrl } },
        ],
      }),
    ]);
    return contentToString(res.content);
  }

  // anthropic
  // Anthropic expects the base64 in a specific shape; we pass via image_url
  // (LangChain's adapter handles the Anthropic message format).
  const model = new ChatAnthropic({
    model: MODELS.anthropic,
    temperature: opts.temperature ?? 0.4,
    apiKey: envKey("anthropic")!,
  });
  const res = await model.invoke([
    new HumanMessage({
      content: [
        { type: "text", text: opts.prompt },
        { type: "image_url", image_url: { url: dataUrl } },
      ],
    }),
  ]);
  return contentToString(res.content);
}

function contentToString(c: unknown): string {
  if (typeof c === "string") return c;
  if (Array.isArray(c)) {
    return c
      .map((p) => {
        if (typeof p === "string") return p;
        if (p && typeof p === "object" && "text" in p) {
          const t = (p as { text: unknown }).text;
          return typeof t === "string" ? t : "";
        }
        return "";
      })
      .join("");
  }
  return String(c);
}

function errorSummary(err: unknown): string {
  if (err instanceof Error) {
    const status = (err as Error & { status?: number; statusCode?: number }).status ?? (err as Error & { statusCode?: number }).statusCode;
    return `${status ? `${status} ` : ""}${err.message.slice(0, 200)}`;
  }
  return String(err).slice(0, 200);
}

// ─── Tiny helper for callers that want provider visibility ───
export function configuredProviders(): Provider[] {
  return (["groq", "gemini", "anthropic"] as Provider[]).filter(configured);
}
