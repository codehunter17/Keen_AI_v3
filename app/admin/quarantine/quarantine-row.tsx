"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2, RotateCcw } from "lucide-react";
import { decideQuarantineAction } from "./actions";

type Row = {
  id: string;
  contentKind: string;
  content: string;
  flagReason: string;
  confidence: number;
  modelUsed: string;
  status: string;
  createdAt: string;
  pseudonym: string | null;
};

export function QuarantineRow({ row }: { row: Row }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const act = (action: "release" | "purge") => {
    setError(null);
    startTransition(async () => {
      const res = await decideQuarantineAction(row.id, action);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  };

  const decided = row.status !== "pending";

  return (
    <li className="border border-border rounded-2xl p-4 bg-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-1">
            <span>{row.contentKind}</span>
            <span>·</span>
            <span>{row.modelUsed}</span>
            <span>·</span>
            <span>conf {(row.confidence * 100).toFixed(0)}%</span>
            <span>·</span>
            <span>{row.createdAt.slice(0, 16)}</span>
            {decided && (
              <span className="ml-auto px-2 py-0.5 rounded-full bg-muted uppercase tracking-wider">
                {row.status}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">
            {row.flagReason}
          </p>
          {expanded ? (
            <pre className="mt-2 text-xs font-mono whitespace-pre-wrap break-words border border-border rounded-xl p-2 bg-background">
              {row.content}
            </pre>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {row.content}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
            title={expanded ? "Collapse" : "Show full content"}
          >
            <Eye className="w-4 h-4" />
          </button>
          {!decided && (
            <>
              <button
                onClick={() => act("release")}
                disabled={pending}
                className="p-2 rounded-lg hover:bg-emerald-500/10 text-emerald-700 disabled:opacity-50"
                title="Release — false positive, allow"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => act("purge")}
                disabled={pending}
                className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-600 disabled:opacity-50"
                title="Purge — confirmed bad, delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
      {error && (
        <p className="text-xs text-rose-600 font-mono mt-2">{error}</p>
      )}
    </li>
  );
}
