"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  date: Date;
  timeString: string;
  location: string | null;
  createdAt: Date;
}

export async function addCalendarEvent(formData: {
  title: string;
  date: Date;
  timeString: string;
  location?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    // Attempt standard Prisma first
    if ("calendarEvent" in prisma) {
      const event = await prisma.calendarEvent.create({
        data: {
          userId: session.user.id,
          title: formData.title,
          date: formData.date,
          timeString: formData.timeString,
          location: formData.location || null,
        },
      });
      revalidatePath("/dashboard");
      revalidatePath("/dashboard/schedule");
      return event;
    }
    throw new Error("Prisma client not ready");
  } catch (e) {
    console.error("Calendar add fallback triggered:", e);
    // FALLBACK: Raw SQL
    const id = crypto.randomUUID();
    const createdAt = new Date();
    await prisma.$executeRaw`
      INSERT INTO "calendar_event" ("id", "userId", "title", "date", "timeString", "location", "createdAt")
      VALUES (${id}, ${session.user.id}, ${formData.title}, ${formData.date}, ${formData.timeString}, ${formData.location || null}, ${createdAt})
    `;
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/schedule");
    return { 
      id, 
      userId: session.user.id, 
      title: formData.title, 
      date: formData.date, 
      timeString: formData.timeString, 
      location: formData.location || null,
      createdAt
    };
  }
}

export async function deleteCalendarEvent(eventId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    if ("calendarEvent" in prisma) {
      // Ensure user owns the event
      const event = await prisma.calendarEvent.findUnique({
        where: { id: eventId },
      });

      if (!event || event.userId !== session.user.id) {
        throw new Error("Unauthorized or not found");
      }

      await prisma.calendarEvent.delete({
        where: { id: eventId },
      });

      revalidatePath("/dashboard");
      revalidatePath("/dashboard/schedule");
      return { success: true };
    }
    throw new Error("Prisma client not ready");
  } catch (e) {
    console.error("Calendar delete fallback triggered:", e);
    // FALLBACK: Raw SQL
    await prisma.$executeRaw`DELETE FROM "calendar_event" WHERE id = ${eventId} AND "userId" = ${session.user.id}`;
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/schedule");
    return { success: true };
  }
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    if ("calendarEvent" in prisma) {
      return await prisma.calendarEvent.findMany({
        where: { userId: session.user.id },
        orderBy: { date: "asc" },
      }) as CalendarEvent[];
    }
    throw new Error("Prisma client not ready");
  } catch (e) {
    console.error("Calendar get fallback triggered:", e);
    // FALLBACK: Raw SQL
    return await prisma.$queryRaw<CalendarEvent[]>`
          SELECT * FROM "calendar_event" 
          WHERE "userId" = ${session.user.id} 
          ORDER BY "date" ASC
        `;
  }
}
