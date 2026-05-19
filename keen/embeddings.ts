/**
 * 384-dim embedding pipeline for Keen's semantic memory.
 *
 * Provider failover: HuggingFace Inference (all-MiniLM-L6-v2, 384 dim) →
 * deterministic hash-based fallback so dev never blocks on missing keys.
 * Production should always have HF_TOKEN set.
 *
 * The hash fallback is NOT semantically meaningful — it exists so the schema
 * stays satisfiable and downstream code paths remain testable. Cosine-sim
 * results from fallback vectors are noise; never rely on them.
 */

import { createHash } from "node:crypto";

const HF_MODEL = "sentence-transformers/all-MiniLM-L6-v2";
const HF_URL = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}/pipeline/feature-extraction`;
const DIM = 384;

export interface EmbedResult {
  ok: boolean;
  provider: "huggingface" | "fallback";
  vector: number[];
}

export async function embed(text: string): Promise<EmbedResult> {
  const trimmed = text.trim().slice(0, 8000);
  const hfToken = process.env.HUGGINGFACE_TOKEN;

  if (hfToken && trimmed.length > 0) {
    try {
      const res = await fetch(HF_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: trimmed }),
      });
      if (res.ok) {
        const data = (await res.json()) as number[] | number[][];
        const vec = Array.isArray(data[0]) ? (data[0] as number[]) : (data as number[]);
        if (vec.length === DIM) {
          return { ok: true, provider: "huggingface", vector: vec };
        }
      }
    } catch {
      // fall through
    }
  }

  return { ok: false, provider: "fallback", vector: hashVector(trimmed) };
}

/** Deterministic 384-dim vector — only for dev/CI when no provider is configured. */
function hashVector(input: string): number[] {
  const out = new Array<number>(DIM);
  let seed = createHash("sha256").update(input).digest();
  for (let i = 0; i < DIM; i += 32) {
    seed = createHash("sha256").update(seed).digest();
    for (let j = 0; j < 32 && i + j < DIM; j++) {
      out[i + j] = (seed[j] / 255) * 2 - 1;
    }
  }
  return out;
}

/** Format a JS number[] as a Postgres vector literal: '[0.1,0.2,...]'. */
export function toPgVectorLiteral(v: number[]): string {
  return "[" + v.map((n) => (Number.isFinite(n) ? n : 0)).join(",") + "]";
}
