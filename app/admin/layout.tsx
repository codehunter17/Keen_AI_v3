/**
 * /admin — hidden operator console for Keen.
 *
 * Gated to a single email set via KEEN_OPERATOR_EMAIL env var. The operator's
 * identity is never disclosed elsewhere in the app, so this gate is the only
 * place that knows who they are.
 *
 * If the env var is unset or the session email doesn't match, render 404 —
 * the route should be indistinguishable from a non-existent page for everyone
 * except the operator.
 */

import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ReactNode } from "react";
import { AdminNav } from "./admin-nav";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const operatorEmail = process.env.KEEN_OPERATOR_EMAIL;
  if (!operatorEmail) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;
  if (!email || email.toLowerCase() !== operatorEmail.toLowerCase()) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-heading font-bold tracking-wide">
              Keen · Operator Console
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            authorized
          </span>
        </div>
      </header>
      <AdminNav />
      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
