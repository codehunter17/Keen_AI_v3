/**
 * Clinician portal layout — gates every /clinician page on cookie auth.
 *
 * No mention of "Keen", "operator", or "admin" in any user-facing copy. The
 * doctor sees only NutriMama branding and their own contribution surface.
 */

import { notFound } from "next/navigation";
import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { getClinician } from "@/lib/clinician-auth";
import { ClinicianNav } from "./clinician-nav";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function ClinicianLayout({
  children,
}: {
  children: ReactNode;
}) {
  const clinician = await getClinician();
  if (!clinician) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/40 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/clinician" className="flex items-center gap-3">
            <Image
              src="/NutriLogo.svg"
              alt="NutriMama"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <div>
              <div className="font-heading font-bold leading-tight">
                NutriMama · Clinical Contributor
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {clinician.displayName} · {clinician.specialty}
              </div>
            </div>
          </Link>
          <form action="/api/clinician/logout" method="post">
            <button
              type="submit"
              className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <ClinicianNav />
      <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
      <footer className="max-w-5xl mx-auto px-6 py-6 text-xs text-muted-foreground">
        Anonymized cases only. Never include patient names, phone numbers, or
        contact details — they will be scrubbed on save.
      </footer>
    </div>
  );
}
