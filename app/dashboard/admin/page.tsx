import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminClient } from "./admin-client";
import { isAdminEmail } from "@/lib/admin-emails";

export const metadata = { title: "Content Studio · NutriMama" };

export default async function AdminPage() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) redirect("/auth/sign-in");

  // Double gate: email must be in ADMIN_EMAILS env var OR isStaff in DB.
  // Email check is the primary path (no DB round-trip needed).
  if (!isAdminEmail(s.user.email) && !(s.user as any).isStaff) {
    redirect("/dashboard");
  }

  return <AdminClient />;
}
