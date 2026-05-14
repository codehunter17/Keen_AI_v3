import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AddDependentClient } from "./add-dependent-client";

export const metadata = { title: "Add a dependent · NutriMama" };

export default async function AddDependentPage() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) redirect("/auth/sign-in");
  return <AddDependentClient userName={s.user.name ?? ""} userEmail={s.user.email ?? ""} />;
}
