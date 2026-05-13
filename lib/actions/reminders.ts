"use server";

// Reminders + notifications. We store notifications as in-app rows and
// also expose a way to create CalendarEvent rows for scheduled care
// (medication times, appointments, supplement reminders). Push delivery
// is added in Week 4 (web-push subscription endpoint).

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

async function s() {
  const sess = await auth.api.getSession({ headers: await headers() });
  if (!sess) throw new Error("UNAUTHORIZED");
  return sess;
}

const reminderSchema = z.object({
  title: z.string().min(1).max(80),
  date: z.string(),
  timeString: z.string().min(1).max(20),
  kind: z.enum([
    "APPOINTMENT",
    "MEDICATION",
    "PERIOD_PREDICTED",
    "OVULATION",
    "DUE_DATE",
    "CUSTOM",
  ]),
  location: z.string().max(120).optional(),
});

export async function createReminder(input: z.infer<typeof reminderSchema>) {
  const sess = await s();
  const data = reminderSchema.parse(input);
  return prisma.calendarEvent.create({
    data: {
      userId: sess.user.id,
      title: data.title,
      date: new Date(data.date),
      timeString: data.timeString,
      kind: data.kind,
      location: data.location,
    },
  });
}

export async function listUpcoming(limit = 10) {
  const sess = await s();
  return prisma.calendarEvent.findMany({
    where: { userId: sess.user.id, date: { gte: new Date() } },
    orderBy: { date: "asc" },
    take: limit,
  });
}

export async function deleteReminder(id: string) {
  const sess = await s();
  await prisma.calendarEvent.deleteMany({
    where: { id, userId: sess.user.id },
  });
  return { ok: true };
}

// In-app notifications inbox
export async function listNotifications(unreadOnly = false) {
  const sess = await s();
  return prisma.notification.findMany({
    where: {
      userId: sess.user.id,
      ...(unreadOnly ? { readAt: null } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function markNotificationRead(id: string) {
  const sess = await s();
  await prisma.notification.updateMany({
    where: { id, userId: sess.user.id },
    data: { readAt: new Date() },
  });
  return { ok: true };
}

export async function markAllNotificationsRead() {
  const sess = await s();
  await prisma.notification.updateMany({
    where: { userId: sess.user.id, readAt: null },
    data: { readAt: new Date() },
  });
  return { ok: true };
}

// Create a notification row (called by other actions / cron jobs)
export async function pushNotification(input: {
  userId: string;
  kind: "CYCLE_REMINDER" | "NUTRITION_TIP" | "REPORT_READY" | "APPOINTMENT" | "SAFETY_ALERT";
  title: string;
  body: string;
}) {
  return prisma.notification.create({ data: input });
}
