// Age guard for the AI chat — children and teens are not permitted.
// Nav already hides the link, but this catches direct URL access.
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function ChatLayout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/sign-in");

  const lifeStage = (session.user as any).lifeStage as string | undefined;
  if (lifeStage?.startsWith("CHILD_") || lifeStage?.startsWith("TEEN_")) {
    redirect("/dashboard"); // AI chat is for adults only
  }

  return <>{children}</>;
}
