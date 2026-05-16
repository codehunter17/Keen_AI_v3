import { Metadata } from "next";
import { ReactNode } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardShell } from "./dashboard-shell";
import { ServiceWorkerRegister } from "@/components/sw-register";
import { OfflineBootstrap } from "@/components/offline-bootstrap";
import { ensureRealName } from "@/lib/server/ensure-real-name";

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
  // Run the phone-as-name cleanup once per process per user. Cheap select +
  // optional update. Runs in parallel with the children rendering so it
  // doesn't add measurable latency.
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.id) {
    // Fire-and-forget — failure is non-fatal and logged inside.
    void ensureRealName(session.user.id);
  }

  return (
    <>
      <ServiceWorkerRegister />
      <OfflineBootstrap />
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}
