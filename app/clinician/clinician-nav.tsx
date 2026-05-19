"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/clinician", label: "Dashboard" },
  { href: "/clinician/cases", label: "My cases" },
  { href: "/clinician/cases/new", label: "New case", primary: true },
];

export function ClinicianNav() {
  const pathname = usePathname() ?? "";
  return (
    <nav className="border-b border-border bg-card/40 overflow-x-auto">
      <div className="max-w-5xl mx-auto px-6 flex items-center gap-1">
        {TABS.map((t) => {
          const active =
            t.href === "/clinician"
              ? pathname === "/clinician"
              : pathname.startsWith(t.href);
          if (t.primary) {
            return (
              <Link
                key={t.href}
                href={t.href}
                className="ml-auto my-2 px-3 py-1.5 rounded-xl bg-foreground text-background text-xs font-bold uppercase tracking-widest"
              >
                {t.label}
              </Link>
            );
          }
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
