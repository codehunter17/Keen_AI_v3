"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ConditionCategory } from "@/lib/conditions";
import { cn } from "@/lib/utils";
import { AlertTriangle, Search } from "lucide-react";

interface Item {
  id: number;
  slug: string;
  name: string;
  nameHi?: string;
  emoji: string;
  category: ConditionCategory;
  categoryLabel: string;
  summary: string;
  hasRed: boolean;
}

interface Props {
  items: Item[];
  categories: { value: ConditionCategory; label: string }[];
}

export function RemediesListClient({ items, categories }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ConditionCategory | "ALL">(
    "ALL",
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (activeCategory !== "ALL" && i.category !== activeCategory) return false;
      if (!q) return true;
      return (
        i.name.toLowerCase().includes(q) ||
        i.slug.includes(q) ||
        (i.nameHi?.toLowerCase().includes(q) ?? false) ||
        i.summary.toLowerCase().includes(q)
      );
    });
  }, [items, query, activeCategory]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search
          className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          aria-hidden
        />
        <input
          type="search"
          inputMode="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 30 conditions, e.g. cramps, PCOS, swelling…"
          className="w-full h-12 pl-11 pr-4 rounded-2xl border border-border bg-card/60 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
          aria-label="Search remedies"
        />
      </div>

      {/* Category filter chips — horizontal scroll on mobile */}
      <div className="-mx-1 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 px-1 pb-1 min-w-min">
          <CategoryChip
            active={activeCategory === "ALL"}
            onClick={() => setActiveCategory("ALL")}
          >
            All <span className="opacity-60 ml-1">{items.length}</span>
          </CategoryChip>
          {categories.map((c) => {
            const count = items.filter((i) => i.category === c.value).length;
            return (
              <CategoryChip
                key={c.value}
                active={activeCategory === c.value}
                onClick={() => setActiveCategory(c.value)}
              >
                {c.label}{" "}
                <span className="opacity-60 ml-1">{count}</span>
              </CategoryChip>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center text-sm text-muted-foreground">
          No conditions match{query ? ` “${query}”` : ""}.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/remedies/${c.slug}`}
              className="group rounded-2xl border border-border bg-card hover:bg-card/80 hover:border-primary/30 transition-all p-3.5 sm:p-4 shadow-sm flex gap-3 active:scale-[0.99]"
            >
              <div
                className="text-2xl sm:text-3xl shrink-0 leading-none mt-0.5"
                aria-hidden
              >
                {c.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading text-sm sm:text-base font-bold text-foreground leading-tight break-words min-w-0 flex-1">
                    {c.name}
                  </h3>
                  {c.hasRed && (
                    <span
                      className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide rounded-full px-1.5 sm:px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                      title="Has emergency red-flag signs"
                      aria-label="Has red-flag signs"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span className="hidden sm:inline">Red flags</span>
                    </span>
                  )}
                </div>
                {c.nameHi && (
                  <p className="text-xs text-muted-foreground mt-0.5 break-words">
                    {c.nameHi}
                  </p>
                )}
                <p className="text-xs text-muted-foreground/90 mt-1.5 line-clamp-2 leading-relaxed">
                  {c.summary}
                </p>
                <div className="mt-2">
                  <span className="inline-block text-[10px] font-medium uppercase tracking-wider text-primary/80">
                    {c.categoryLabel}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 h-9 px-4 rounded-full text-xs font-semibold border transition-all",
        active
          ? "bg-primary text-white border-primary"
          : "bg-card text-foreground border-border hover:border-primary/40",
      )}
    >
      {children}
    </button>
  );
}
