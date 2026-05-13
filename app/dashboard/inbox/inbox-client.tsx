"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/actions/reminders";
import { formatDistanceToNow } from "date-fns";

interface Item {
  id: string;
  kind: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

const KIND_META: Record<string, { emoji: string; tint: string }> = {
  CYCLE_REMINDER: { emoji: "🌙", tint: "border-secondary/40 bg-secondary/15" },
  NUTRITION_TIP: { emoji: "🥗", tint: "border-accent bg-accent/30" },
  REPORT_READY: { emoji: "📄", tint: "border-primary/30 bg-primary/10" },
  APPOINTMENT: { emoji: "📅", tint: "border-gold/30 surface-gold" },
  SAFETY_ALERT: { emoji: "⚠️", tint: "border-destructive/40 bg-destructive/10" },
};

export function InboxClient({ items: initial }: { items: Item[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const visible = items.filter((i) => (filter === "unread" ? !i.readAt : true));
  const unreadCount = items.filter((i) => !i.readAt).length;

  const markOne = (id: string) =>
    startTransition(async () => {
      await markNotificationRead(id);
      setItems((cur) => cur.map((i) => (i.id === id ? { ...i, readAt: new Date().toISOString() } : i)));
      router.refresh();
    });

  const markAll = () =>
    startTransition(async () => {
      await markAllNotificationsRead();
      const now = new Date().toISOString();
      setItems((cur) => cur.map((i) => ({ ...i, readAt: i.readAt ?? now })));
      router.refresh();
    });

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl text-primary">Inbox</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0
              ? `${unreadCount} unread message${unreadCount === 1 ? "" : "s"}`
              : "All caught up."}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" onClick={markAll} disabled={pending}>
            Mark all read
          </Button>
        )}
      </header>

      <div className="flex gap-2">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`chip cursor-pointer ${
              filter === f
                ? "bg-primary text-primary-foreground border-primary"
                : ""
            }`}
          >
            {f === "all" ? "All" : "Unread"}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl bg-card lift p-8 text-center text-sm text-muted-foreground">
          {filter === "unread" ? "Nothing unread." : "No messages yet."}
        </div>
      ) : (
        <ul className="space-y-2">
          {visible.map((i) => {
            const meta = KIND_META[i.kind] ?? { emoji: "📨", tint: "border-border bg-card" };
            const unread = !i.readAt;
            return (
              <li
                key={i.id}
                className={`rounded-2xl border p-4 ${meta.tint} ${unread ? "lift" : "opacity-75"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xl leading-none">{meta.emoji}</span>
                    <div>
                      <p className="font-medium">
                        {i.title}
                        {unread && (
                          <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary" />
                        )}
                      </p>
                      <p className="mt-0.5 text-sm">{i.body}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {formatDistanceToNow(new Date(i.createdAt))} ago
                      </p>
                    </div>
                  </div>
                  {unread && (
                    <button
                      onClick={() => markOne(i.id)}
                      className="text-xs text-primary hover:underline shrink-0"
                      disabled={pending}
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
