import { Metadata } from "next";
import { ReactNode } from "react";
import { DashboardShell } from "./dashboard-shell";
import { ServiceWorkerRegister } from "@/components/sw-register";
import { OfflineBootstrap } from "@/components/offline-bootstrap";

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

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ServiceWorkerRegister />
      <OfflineBootstrap />
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}
