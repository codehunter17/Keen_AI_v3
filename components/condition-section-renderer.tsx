// Renders the raw text sections from lib/conditions.ts as readable HTML.
// The source content uses a loose markdown-ish format with:
//   • Numbered items (1., 2., …) for remedies/drugs — these become headings
//   • Lines starting with → or • — bullets nested under the item
//   • ⚠️ lines — caution callouts
//   • ✅ / ❌ — safety markers
//   • ★ — emphasis (highlights "best" / "research-proven")
//   • Section markers like 🥗 DIET: / 📦 FORMULATIONS: — sub-headings
// We avoid a heavy markdown lib and render line-by-line.

import { cn } from "@/lib/utils";

interface RendererProps {
  text: string;
  className?: string;
}

export function ConditionSectionRenderer({ text, className }: RendererProps) {
  const lines = text.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (!trimmed) {
      blocks.push(<div key={`sp-${i}`} className="h-2" aria-hidden />);
      i++;
      continue;
    }

    // Numbered remedy headers like "1. SHATAVARI — Hormonal balance"
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      const [, num, headerText] = numberedMatch;
      const sub: string[] = [];
      let j = i + 1;
      while (j < lines.length) {
        const next = lines[j].trim();
        if (!next) {
          j++;
          break;
        }
        if (/^\d+\.\s/.test(next)) break;
        if (/^[━─]{3,}/.test(next)) break;
        if (/^(?:📋|👩|🚨|🔗|⚠️\s*DISCLAIMER|🥗|📦|💊|🌿|🧘|🌱|📌)/.test(next)) break;
        sub.push(next);
        j++;
      }
      blocks.push(
        <div
          key={`item-${i}`}
          className="rounded-2xl border border-border bg-card/60 p-4 my-3 shadow-sm"
        >
          <h4 className="font-heading text-base font-bold text-foreground flex items-baseline gap-2">
            <span className="text-primary text-sm">{num}.</span>
            <span>{headerText}</span>
          </h4>
          {sub.length > 0 && (
            <ul className="mt-2 space-y-1.5 text-sm text-foreground/85">
              {sub.map((l, k) => (
                <SubLine key={k} line={l} />
              ))}
            </ul>
          )}
        </div>,
      );
      i = j;
      continue;
    }

    // Sub-section headings like "🥗 DIET:", "📦 FORMULATIONS:", "AYURVEDIC UNDERSTANDING:"
    if (
      /^(?:🥗|📦|🌿|💊|🧘|🌱|📌|🚨|🔥|⚡|🌸|🎯)\s+[A-Z]/.test(trimmed) ||
      /^[A-Z][A-Z\s&/().-]{4,}:$/.test(trimmed)
    ) {
      blocks.push(
        <h3
          key={`h-${i}`}
          className="font-heading text-sm font-bold uppercase tracking-wider text-primary mt-5 mb-2"
        >
          {trimmed}
        </h3>,
      );
      i++;
      continue;
    }

    // Caution / disclaimer lines
    if (trimmed.startsWith("⚠️")) {
      blocks.push(
        <p
          key={`warn-${i}`}
          className="rounded-xl border border-amber-300/40 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800/40 px-3 py-2 text-xs text-amber-900 dark:text-amber-200 my-2"
        >
          {trimmed}
        </p>,
      );
      i++;
      continue;
    }

    // Bordered separator lines from source
    if (/^[━─=]{3,}/.test(trimmed)) {
      i++;
      continue;
    }

    // Bullet / arrow lines
    if (/^(?:→|•|-)\s/.test(trimmed)) {
      const stripped = trimmed.replace(/^(?:→|•|-)\s*/, "");
      blocks.push(
        <div
          key={`b-${i}`}
          className="text-sm text-foreground/85 my-1 flex gap-2 leading-relaxed"
        >
          <span className="text-primary/60 select-none">→</span>
          <span>{stripped}</span>
        </div>,
      );
      i++;
      continue;
    }

    // Default: plain paragraph
    blocks.push(
      <p key={`p-${i}`} className="text-sm text-foreground/85 my-1.5 leading-relaxed">
        {trimmed}
      </p>,
    );
    i++;
  }

  return <div className={cn("text-foreground", className)}>{blocks}</div>;
}

function SubLine({ line }: { line: string }) {
  // Highlight ✅/❌/★ markers and the leading arrow
  const stripped = line.replace(/^(?:→|•|-)\s*/, "");
  return (
    <li className="flex gap-2 leading-relaxed list-none">
      <span className="text-primary/60 select-none">→</span>
      <span>{stripped}</span>
    </li>
  );
}
