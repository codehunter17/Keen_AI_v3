"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { type CalendarEvent } from "./calendar";


export async function getDashboardData() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if (!session) {
        throw new Error("Unauthorized");
    }

    // Get today's log (from midnight today to midnight tomorrow)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Run all database queries in parallel for better performance
    const [user, todayLog, reportsCount, calendarEvents, reportsAnalyzedCount, chatsCount] = await Promise.all([
        prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                name: true,
                email: true,
                lifeStage: true,
                pregnancyStage: true,
                pregnancyWeek: true,
                dueDate: true,
                dietaryPref: true,
                regionalPref: true,
                createdAt: true,
                age: true,
                height: true,
                weight: true,
                previousPregnancies: true,
                supplements: true,
                friedFoods: true,
                sugaryFoods: true,
                waterIntake: true,
                useFortifiedFood: true,
                supplementFrequency: true,
                avoidingFoods: true,
                symptoms: true,
                smokeAlcohol: true,
                physicalActivity: true,
                sleepDuration: true,
                movementDuration: true,
                mood: true,
                tier: true,
            }
        }),
        prisma.dailyLog.findFirst({
            where: {
                userId: session.user.id,
                date: {
                    gte: today,
                    lt: tomorrow
                }
            }
        }),
        prisma.report.count({
            where: { userId: session.user.id }
        }),
        ("calendarEvent" in (prisma as unknown as Record<string, unknown>))
            ? (prisma as unknown as { calendarEvent: { findMany: (args: unknown) => Promise<CalendarEvent[]> } }).calendarEvent.findMany({
                where: { userId: session.user.id },
                orderBy: { date: 'desc' },
                take: 3
            })
            : (prisma as unknown as { $queryRaw: <T>(query: TemplateStringsArray, ...values: unknown[]) => Promise<T> }).$queryRaw<CalendarEvent[]>`
                SELECT * FROM "calendar_event" 
                WHERE "userId" = ${session.user.id}
                ORDER BY date DESC
                LIMIT 3
              `,
        prisma.report.count({
            where: { userId: session.user.id, aiAnalysis: { not: null } }
        }),
        prisma.chatMessage.count({
            where: { session: { userId: session.user.id }, role: "user" }
        })
    ]);

    return { user, todayLog, reportsCount, reportsAnalyzedCount, chatsCount, calendarEvents };
}
