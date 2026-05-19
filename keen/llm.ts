/**
 * Minimal LLM wrapper used by Keen's reasoning modules.
 *
 * Keen stays SDK-agnostic on purpose — the host app may use LangChain, Vercel
 * AI SDK, or none. Keen talks raw HTTP to Groq (fast) with Gemini as a fallback
 * so it can be lifted into any host without dragging dependencies.
 *
 * If neither key is set, callers fall back to deterministic heuristics so the
 * brain still does *something* useful in dev.
 */

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

export interface LLMCall {
  system: string;
  user: string;
  /** json | text */
  format?: "json" | "text";
  /** Sampling temperature. Defaults to 0.2 — Keen prefers determinism. */
  temperature?: number;
}

export interface LLMResult {
  ok: boolean;
  provider: "groq" | "gemini" | "fallback";
  text: string;
}

export async function llm(call: LLMCall): Promise<LLMResult> {
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "qwen/qwen3-32b",
          temperature: call.temperature ?? 0.2,
          response_format:
            call.format === "json" ? { type: "json_object" } : undefined,
          messages: [
            { role: "system", content: call.system },
            { role: "user", content: call.user },
          ],
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const text = data.choices?.[0]?.message?.content ?? "";
        if (text) return { ok: true, provider: "groq", text };
      }
    } catch {
      // fall through to Gemini
    }
  }

  const gemKey = process.env.GEMINI_API_KEY;
  if (gemKey) {
    try {
      const res = await fetch(`${GEMINI_URL}?key=${gemKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { role: "system", parts: [{ text: call.system }] },
          contents: [{ role: "user", parts: [{ text: call.user }] }],
          generationConfig: {
            temperature: call.temperature ?? 0.2,
            responseMimeType:
              call.format === "json" ? "application/json" : "text/plain",
          },
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          candidates?: { content?: { parts?: { text?: string }[] } }[];
        };
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        if (text) return { ok: true, provider: "gemini", text };
      }
    } catch {
      // fall through to deterministic stub
    }
  }

  return {
    ok: false,
    provider: "fallback",
    text:
      call.format === "json"
        ? `{"note":"no LLM provider configured","input":${JSON.stringify(call.user).slice(0, 200)}}`
        : "[Keen LLM unavailable — using deterministic fallback]",
  };
}

/** Best-effort JSON parse for LLM outputs. Returns null if not parseable. */
export function safeJson<T = unknown>(s: string): T | null {
  try {
    return JSON.parse(s) as T;
  } catch {
    const match = s.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]) as T;
    } catch {
      return null;
    }
  }
}
