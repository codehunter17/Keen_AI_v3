import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { listNotifications } from "@/lib/actions/reminders";
import { InboxClient } from "./inbox-client";

export const metadata = { title: "Inbox · NutriMama" };

export default async function InboxPage() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) redirect("/auth/login");
  const list = await listNotifications();
  return (
    <InboxClient
      items={list.map((n) => ({
        id: n.id,
        kind: n.kind,
        title: n.title,
        body: n.body,
        readAt: n.readAt?.toISOString() ?? null,
        createdAt: n.createdAt.toISOString(),
      }))}
    />
  );
}
