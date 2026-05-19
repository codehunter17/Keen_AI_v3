/**
 * Pretrained Hugging Face inference router.
 *
 * Routes clinical inference tasks to open biomedical models without training
 * anything ourselves. The big IQ win — Keen gets BioBERT-grade NER, PubMedBERT
 * embeddings, and zero-shot disease classification on day one.
 *
 * Tasks supported:
 *   - "ner"                       biomedical entity extraction
 *   - "zero_shot_classification"  pick a label from a candidate set
 *   - "feature_extraction"        embeddings (typically 768-dim; use for cross-doc clustering, not Keen's 384-dim memory)
 *   - "text_classification"       e.g. sentiment / risk / triage flag
 *
 * Auto-registers default models on first use. Each invocation bumps the
 * registry counters for telemetry.
 */

import { prisma } from "@/lib/prisma";

type Task =
  | "ner"
  | "zero_shot_classification"
  | "feature_extraction"
  | "text_classification";

const HF_API_BASE = "https://router.huggingface.co/hf-inference/models";

const DEFAULT_MODELS: Record<Task, { hfModelId: string; description: string }> = {
  ner: {
    hfModelId: "d4data/biomedical-ner-all",
    description: "Biomedical NER (BERT-base) — symptoms, drugs, anatomy, disorders.",
  },
  zero_shot_classification: {
    hfModelId: "facebook/bart-large-mnli",
    description: "General zero-shot classifier — pick from candidate labels.",
  },
  feature_extraction: {
    hfModelId:
      "microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext",
    description: "PubMedBERT features — clinical text semantic vectors (768-dim).",
  },
  text_classification: {
    hfModelId: "emilyalsentzer/Bio_ClinicalBERT",
    description: "ClinicalBERT — clinical text classification fine-tuning base.",
  },
};

export interface InferenceInput {
  task: Task;
  text: string;
  /** Required for zero_shot_classification. */
  candidateLabels?: string[];
  /** Override the model selected from the registry. */
  modelOverride?: string;
}

export type NerSpan = { entity: string; word: string; score: number; start: number; end: number };
export type ZeroShotResult = { labels: string[]; scores: number[] };

export interface InferenceResult<T = unknown> {
  ok: boolean;
  provider: "huggingface" | "fallback";
  modelUsed: string;
  latencyMs: number;
  data: T | null;
  detail?: string;
}

export async function infer<T = unknown>(
  input: InferenceInput,
): Promise<InferenceResult<T>> {
  const hfToken = process.env.HUGGINGFACE_TOKEN;
  const model = await resolveModel(input.task, input.modelOverride);
  const started = Date.now();

  if (!hfToken) {
    return {
      ok: false,
      provider: "fallback",
      modelUsed: model.hfModelId,
      latencyMs: 0,
      data: null,
      detail: "HUGGINGFACE_TOKEN not configured",
    };
  }

  let body: Record<string, unknown>;
  if (input.task === "zero_shot_classification") {
    if (!input.candidateLabels || input.candidateLabels.length === 0) {
      return {
        ok: false,
        provider: "huggingface",
        modelUsed: model.hfModelId,
        latencyMs: 0,
        data: null,
        detail: "candidateLabels required for zero_shot_classification",
      };
    }
    body = {
      inputs: input.text,
      parameters: { candidate_labels: input.candidateLabels },
    };
  } else {
    body = { inputs: input.text };
  }

  try {
    const res = await fetch(`${HF_API_BASE}/${model.hfModelId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const latencyMs = Date.now() - started;

    if (!res.ok) {
      void bumpStats(model.id, latencyMs);
      const text = await res.text();
      return {
        ok: false,
        provider: "huggingface",
        modelUsed: model.hfModelId,
        latencyMs,
        data: null,
        detail: `HF ${res.status}: ${text.slice(0, 200)}`,
      };
    }

    const data = (await res.json()) as T;
    void bumpStats(model.id, latencyMs);
    return {
      ok: true,
      provider: "huggingface",
      modelUsed: model.hfModelId,
      latencyMs,
      data,
    };
  } catch (err) {
    const latencyMs = Date.now() - started;
    return {
      ok: false,
      provider: "huggingface",
      modelUsed: model.hfModelId,
      latencyMs,
      data: null,
      detail: err instanceof Error ? err.message : "fetch failed",
    };
  }
}

async function resolveModel(
  task: Task,
  override?: string,
): Promise<{ id: string; hfModelId: string }> {
  if (override) {
    const existing = await prisma.keenPretrainedModel.findUnique({
      where: { task_hfModelId: { task, hfModelId: override } },
    });
    if (existing) return { id: existing.id, hfModelId: existing.hfModelId };
    const created = await prisma.keenPretrainedModel.create({
      data: { task, hfModelId: override, isLive: true },
    });
    return { id: created.id, hfModelId: created.hfModelId };
  }

  const live = await prisma.keenPretrainedModel.findFirst({
    where: { task, isLive: true },
    orderBy: { createdAt: "desc" },
  });
  if (live) return { id: live.id, hfModelId: live.hfModelId };

  const seed = DEFAULT_MODELS[task];
  const created = await prisma.keenPretrainedModel.create({
    data: {
      task,
      hfModelId: seed.hfModelId,
      description: seed.description,
      isLive: true,
    },
  });
  return { id: created.id, hfModelId: created.hfModelId };
}

async function bumpStats(modelId: string, latencyMs: number): Promise<void> {
  try {
    await prisma.keenPretrainedModel.update({
      where: { id: modelId },
      data: {
        invocationCount: { increment: 1 },
        lastInvokedAt: new Date(),
        avgLatencyMs: latencyMs,
      },
    });
  } catch {
    // never let telemetry crash a job
  }
}

/** Convenience helpers — same call shapes throughout the brain. */
export async function extractEntities(text: string) {
  return infer<NerSpan[]>({ task: "ner", text });
}

export async function classifyZeroShot(text: string, labels: string[]) {
  return infer<ZeroShotResult>({
    task: "zero_shot_classification",
    text,
    candidateLabels: labels,
  });
}

export async function pubmedBertFeatures(text: string) {
  return infer<number[] | number[][]>({ task: "feature_extraction", text });
}
