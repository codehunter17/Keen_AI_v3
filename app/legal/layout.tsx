import type { ReactNode } from "react";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
        <div className="rounded-2xl bg-card lift p-6 sm:p-10">
          <article className="prose prose-sm sm:prose max-w-none prose-headings:font-heading prose-headings:text-primary prose-a:text-primary">
            {children}
          </article>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          NutriMama · Made for India · DPDP Act 2023 compliant
        </p>
      </div>
    </main>
  );
}
