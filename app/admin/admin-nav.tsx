"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/teachers", label: "Teachers" },
  { href: "/admin/cases", label: "Cases" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/scholar", label: "Scholar" },
  { href: "/admin/quarantine", label: "Quarantine" },
];

export function AdminNav() {
  const pathname = usePathname() ?? "";
  return (
    <nav className="border-b border-border bg-card/40 overflow-x-auto">
      <div className="max-w-6xl mx-auto px-6 flex items-center gap-1">
        {TABS.map((t) => {
          const active = t.href === "/admin" ? pathname === "/admin" : pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "px-3 py-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 -mb-px",
                active
                  ? "text-foreground border-foreground"
                  : "text-muted-foreground border-transparent hover:text-foreground",
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
