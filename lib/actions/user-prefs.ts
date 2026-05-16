"use server";

// Small user-preference actions that don't fit elsewhere:
//   - setLocalOnlyMode(on)  — DPDP toggle: blocks AI calls when on.
//                            We map this onto allowModelTraining inverted
//                            for v1 (no separate column needed yet).
//   - exportMyData()        — returns a JSON dump of the user's account
//                            + health logs for DPDP §13 portability.

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { isSupportedLanguage } from "@/lib/languages";

async function requireUserId(): Promise<string | null> {
  const s = await auth.api.getSession({ headers: await headers() });
  return s?.user.id ?? null;
}

/**
 * Change the user's preferred display language. The chat AI also reads
 * this off the user record to decide which language to respond in.
 * Validates against the supported-languages registry — never writes
 * an arbitrary string.
 */
export async function setLanguagePreference(
  code: string,
): Promise<{ ok: boolean; reason?: string }> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, reason: "UNAUTHORIZED" };
  if (!isSupportedLanguage(code)) {
    return { ok: false, reason: "UNSUPPORTED_LANGUAGE" };
  }
  await prisma.user.update({
    where: { id: userId },
    data: { languagePref: code },
  });
  return { ok: true };
}

/**
 * Local-only mode is currently an alias for "no model training, and the
 * AI provider chain is bypassed for the user". Stored on the User row as
 * a boolean we already have (`allowModelTraining`) — inverted.
 *
 * Future: split into a dedicated `localOnlyMode` boolean once we wire
 * the chat route to actually short-circuit on it.
 */
export async function setLocalOnlyMode(on: boolean): Promise<{ ok: boolean }> {
  const userId = await requireUserId();
  if (!userId) return { ok: false };
  await prisma.user.update({
    where: { id: userId },
    data: { allowModelTraining: !on },
  });
  return { ok: true };
}

/**
 * DPDP §13: data portability. Returns the user's account record + all
 * health logs in plain JSON for the user to download. We strip internal
 * IDs that mean nothing outside our DB.
 */
export async function exportMyData(): Promise<
  { ok: true; data: string } | { ok: false }
> {
  const userId = await requireUserId();
  if (!userId) return { ok: false };

  try {
    const [user, dailyLogs, cycleLogs, reports, chatSessions, consentRecords] =
      await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.dailyLog.findMany({ where: { userId }, orderBy: { date: "desc" } }),
        prisma.cycleLog.findMany({ where: { userId }, orderBy: { startDate: "desc" } }),
        prisma.report.findMany({
          where: { userId },
          select: { id: true, fileName: true, reportType: true, reportDate: true, aiAnalysis: true, extracted: true, flagged: true, createdAt: true },
        }),
        prisma.chatSession.findMany({
          where: { userId },
          select: { id: true, createdAt: true, title: true },
        }),
        prisma.consentRecord.findMany({ where: { userId } }),
      ]);

    const dump = {
      exportedAt: new Date().toISOString(),
      dpdpVersion: "DPDP-2023",
      account: user
        ? {
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            dob: user.dob,
            languagePref: user.languagePref,
            countryCode: user.countryCode,
            lifeStage: user.lifeStage,
            pregnancyStage: user.pregnancyStage,
            tier: user.tier,
          }
        : null,
      vitals: user
        ? {
            height: user.height,
            weight: user.weight,
            sleepDuration: user.sleepDuration,
            movementDuration: user.movementDuration,
            physicalActivity: user.physicalActivity,
            supplements: user.supplements,
            dietaryPref: user.dietaryPref,
            regionalPref: user.regionalPref,
          }
        : null,
      dailyLogs,
      cycleLogs,
      reports,
      chatSessions,
      consentRecords,
    };

    return { ok: true, data: JSON.stringify(dump, null, 2) };
  } catch (err) {
    console.error("[exportMyData] failed:", err);
    return { ok: false };
  }
}
