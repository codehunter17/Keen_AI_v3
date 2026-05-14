import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PcosScreenClient } from "./pcos-client";

export const metadata = { title: "PCOS screen · NutriMama" };

export default async function PcosPage() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) redirect("/auth/sign-in");
  return <PcosScreenClient />;
}
