"use server";

// Curated content library actions.
// AI only RANKS — it does not author. Critical for legal safety
// (especially for minor profiles, where freeform LLM is forbidden).

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ageFromDob, ageBandFromAge, contentTopicsForUser, unlockFeatures, type LifeStage, type CycleStage } from "@/lib/lifecycle";

async function getUserContext() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) throw new Error("UNAUTHORIZED");
  const u = await prisma.user.findUnique({
    where: { id: s.user.id },
    select: { id: true, dob: true, lifeStage: true, cycleStage: true, languagePref: true },
  });
  if (!u || !u.dob) throw new Error("ONBOARDING_REQUIRED");
  return {
    userId: u.id,
    age: ageFromDob(u.dob),
    lifeStage: u.lifeStage as LifeStage | null,
    cycleStage: u.cycleStage as CycleStage | null,
    language: u.languagePref ?? "en",
  };
}

export async function getRecommendedContent(opts: {
  dependentId?: string;
  limit?: number;
} = {}) {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) throw new Error("UNAUTHORIZED");

  let age: number;
  let isDependent = false;
  let language = "en";
  let lifeStage: LifeStage | undefined;
  let cycleStage: CycleStage | undefined;
  let hasMenarche = false;

  if (opts.dependentId) {
    const dep = await prisma.dependentProfile.findFirst({
      where: { id: opts.dependentId, parentId: s.user.id, deletedAt: null },
    });
    if (!dep) throw new Error("DEPENDENT_NOT_FOUND");
    age = ageFromDob(dep.dob);
    isDependent = true;
    hasMenarche = dep.hasMenarche;
  } else {
    const ctx = await getUserContext();
    age = ctx.age;
    language = ctx.language;
    lifeStage = ctx.lifeStage ?? undefined;
    cycleStage = ctx.cycleStage ?? undefined;
  }

  const features = unlockFeatures({
    age,
    isDependent,
    hasParentalConsent: isDependent ? true : undefined,
    hasMenarche,
    lifeStage,
    cycleStage,
  });
  const topics = contentTopicsForUser({
    age,
    isDependent,
    hasParentalConsent: isDependent ? true : undefined,
    hasMenarche,
    lifeStage,
    cycleStage,
  });
  const ageBand = ageBandFromAge(age);

  if (!features.curatedContentRecs) return [];

  // Filter by ageBand AND topic intersection.
  const items = await prisma.contentItem.findMany({
    where: {
      OR: [
        { ageBands: { has: ageBand } },
        { ageBands: { isEmpty: true } },
      ],
      topics: { hasSome: topics },
      ...(isDependent ? {} : {}),
      language,
    },
    take: opts.limit ?? 24,
    orderBy: { createdAt: "desc" },
  });

  return items;
}

export async function recordContentView(input: {
  contentId: string;
  watchedSec?: number;
  completed?: boolean;
  dependentId?: string;
}) {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) throw new Error("UNAUTHORIZED");
  await prisma.contentView.create({
    data: {
      contentId: input.contentId,
      userId: input.dependentId ? null : s.user.id,
      dependentId: input.dependentId ?? null,
      watchedSec: input.watchedSec,
      completed: input.completed ?? false,
    },
  });
  return { ok: true };
}

export async function getContentBySlug(slug: string) {
  return prisma.contentItem.findUnique({ where: { slug } });
}
