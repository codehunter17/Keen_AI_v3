// Embeddings with multi-provider failover.
//
// Order: HuggingFace Inference (free) → Google Gemini → cosine-hash fallback
// The fallback is a deterministic hash-based pseudo-embedding so RAG
// keeps technically working even when both providers are down. Quality
// drops to "exact-match-only" but we never break.

// Note: this module is server-only by intent (uses provider SDKs + secrets)
// but we deliberately don't `import "server-only"` here — that would crash
// the standalone CLI ingest script in scripts/ingest-conditions-rag.ts.
// Server-side enforcement remains via lib/condition-rag.ts which DOES use it.
import { InferenceClient } from "@huggingface/inference";
import { GoogleGenerativeAI } from "@google/generative-ai";

const TARGET_DIM = 384; // matches our pgvector(384) schema

type Provider = "hf" | "gemini" | "fallback";

function hfToken(): string | undefined {
  return process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
}
function geminiKey(): string | undefined {
  return process.env.GOOGLE_GENERATIVE_AI_API_KEY;
}

function configured(p: Provider): boolean {
  if (p === "hf") return !!hfToken();
  if (p === "gemini") return !!geminiKey();
  return true; // fallback always available
}

function order(): Provider[] {
  return (["hf", "gemini", "fallback"] as Provider[]).filter(configured);
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const errors: { provider: Provider; error: unknown }[] = [];
  for (const p of order()) {
    try {
      return await embedOne(p, text);
    } catch (err) {
      errors.push({ provider: p, error: err });
      console.warn(
        `[embeddings] ${p} failed:`,
        err instanceof Error ? err.message.slice(0, 200) : String(err),
      );
    }
  }
  throw new Error(
    `All embedding providers failed: ${errors
      .map((e) => `${e.provider}=${e.error instanceof Error ? e.error.message : String(e.error)}`)
      .join("; ")}`,
  );
}

async function embedOne(p: Provider, text: string): Promise<number[]> {
  if (p === "hf") {
    const client = new InferenceClient(hfToken()!);
    const result = await client.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: text,
      provider: "hf-inference",
    });
    const flat: number[] =
      Array.isArray(result) && Array.isArray(result[0])
        ? (result[0] as unknown as number[])
        : (result as unknown as number[]);
    return resize(flat, TARGET_DIM);
  }

  if (p === "gemini") {
    const ai = new GoogleGenerativeAI(geminiKey()!);
    // Google rotated the API name; "text-embedding-004" returns 404 on the
    // public v1beta endpoint. Use the current stable model id.
    const model = ai.getGenerativeModel({ model: "gemini-embedding-001" });
    const r = await model.embedContent(text);
    const vec = r.embedding?.values;
    if (!Array.isArray(vec)) throw new Error("gemini returned no vector");
    return resize(vec, TARGET_DIM);
  }

  // Deterministic fallback: stable but lossy. Better than crashing.
  return hashEmbedding(text, TARGET_DIM);
}

// Resize an embedding to target dim by truncation or by zero-padding.
// Loses some info but keeps writes consistent with our pgvector(384) schema.
function resize(vec: number[], target: number): number[] {
  if (vec.length === target) return vec;
  if (vec.length > target) return vec.slice(0, target);
  const out = new Array(target).fill(0);
  for (let i = 0; i < vec.length; i++) out[i] = vec[i];
  return out;
}

// Deterministic hash-based pseudo-embedding for last-resort fallback.
function hashEmbedding(text: string, dim: number): number[] {
  const out = new Array(dim).fill(0);
  const tokens = text.toLowerCase().split(/\s+/).filter(Boolean);
  for (const t of tokens) {
    let h = 0;
    for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0;
    const idx = Math.abs(h) % dim;
    out[idx] += 1;
  }
  // L2-normalize
  let mag = 0;
  for (const v of out) mag += v * v;
  mag = Math.sqrt(mag) || 1;
  for (let i = 0; i < dim; i++) out[i] /= mag;
  return out;
}
