import { Metadata } from "next";
import { ReactNode } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardShell } from "./dashboard-shell";
import { OfflineBootstrap } from "@/components/offline-bootstrap";
import { ensureRealName } from "@/lib/server/ensure-real-name";
import { isAdminEmail, ensureStaffFlag } from "@/lib/admin-emails";

export const metadata: Metadata = {
  title: "Dashboard · NutriMama",
  description:
    "Your women's health companion — cycle, nutrition, AI chat, reports.",
  icons: {
    icon: "/NutriLogo.svg",
    shortcut: "/NutriLogo.svg",
    apple: "/NutriLogo.svg",
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user.id) {
    // 1. Auto-promote admin emails → isStaff = true in DB (idempotent, fast).
    //    This means adding an email to ADMIN_EMAILS env var is all it takes —
    //    no manual SQL needed. The DB flag is synced lazily on next page load.
    if (isAdminEmail(session.user.email)) {
      void ensureStaffFlag(session.user.id);
    }

    // 2. Clean up phone-shaped names (fire-and-forget, non-fatal).
    void ensureRealName(session.user.id);
  }

  return (
    <>
      <OfflineBootstrap />
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}
