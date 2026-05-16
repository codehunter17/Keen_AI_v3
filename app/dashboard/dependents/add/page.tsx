import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AddDependentClient } from "./add-dependent-client";
import { displayName } from "@/lib/display-name";
import { displayEmail } from "@/lib/display-email";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Add a dependent · NutriMama" };

export default async function AddDependentPage() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) redirect("/auth/sign-in");
  // Fetch phoneNumber so displayEmail can fall back to it for phone-only users.
  const user = await prisma.user.findUnique({
    where: { id: s.user.id },
    select: { name: true, email: true, phoneNumber: true },
  });
  return (
    <AddDependentClient
      userName={displayName(user)}
      userEmail={displayEmail(user)}
    />
  );
}
