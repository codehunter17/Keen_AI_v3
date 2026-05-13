// Server-only — shows which LLM providers are configured.
// Drop into the settings page so the user knows their app has redundancy.

import { configuredProviders } from "@/lib/llm";

export function ProvidersStatus() {
  const active = configuredProviders();
  const all = ["groq", "gemini", "anthropic"] as const;

  const labels: Record<string, string> = {
    groq: "Groq · Llama 3.3",
    gemini: "Google Gemini 2.5",
    anthropic: "Claude Sonnet 4.6",
  };

  return (
    <section className="rounded-2xl bg-card lift p-6">
      <h2 className="font-heading text-xl text-primary">AI providers</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Your app tries these in order. If one fails or rate-limits, the next
        one takes over automatically.
      </p>
      <ul className="mt-4 space-y-2">
        {all.map((p) => {
          const ok = active.includes(p);
          return (
            <li
              key={p}
              className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2"
            >
              <span className="text-sm font-medium">{labels[p]}</span>
              <span
                className={`chip text-[10px] py-0.5 ${
                  ok
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {ok ? "active" : "not configured"}
              </span>
            </li>
          );
        })}
      </ul>
      {active.length === 0 && (
        <p className="mt-3 text-xs text-destructive">
          No providers configured yet. Set at least one API key in your
          environment for AI chat to work.
        </p>
      )}
      {active.length === 1 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Tip — add a second provider key to enable failover. If your one
          provider rate-limits, the AI will go down for that user.
        </p>
      )}
    </section>
  );
}
