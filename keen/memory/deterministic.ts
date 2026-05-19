/**
 * Deterministic memory — Postgres JSONB facts per pseudonymized user.
 *
 * Holds *hard* facts the brain must never approximate: current pregnancy week,
 * verified allergies, dietary preferences, life-stage flag. Anything that can
 * be answered without an LLM call belongs here.
 *
 * All queries key off the pseudonym (sha256 of userId from anonymize.ts) so
 * Keen never sees real user IDs.
 */

import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

export interface KeenFacts {
  pregnancyWeek?: number;
  dueDate?: string; // ISO date
  lifeStage?:
    | "MENSTRUATING"
    | "TRYING_TO_CONCEIVE"
    | "PREGNANT"
    | "POST_PARTUM"
    | "PERIMENOPAUSE"
    | "MENOPAUSE";
  allergies?: string[];
  dietary?: "VEGETARIAN" | "VEGAN" | "NON_VEG";
  conditions?: string[]; // e.g. "PCOS", "hypothyroid", "gestational_diabetes"
  preferredLang?: "en" | "hi" | string;
  regionalPref?: string;
  /** Free-form structured notes — keep keys stable. */
  notes?: Record<string, string | number | boolean>;
}

function hashFacts(facts: KeenFacts): string {
  return createHash("sha256").update(JSON.stringify(facts)).digest("hex");
}

export async function getProfile(pseudonym: string): Promise<KeenFacts | null> {
  if (!pseudonym) return null;
  const row = await prisma.keenUserProfile.findUnique({ where: { pseudonym } });
  return row ? (row.facts as KeenFacts) : null;
}

export async function upsertProfile(
  pseudonym: string,
  facts: KeenFacts,
): Promise<KeenFacts> {
  const hash = hashFacts(facts);
  await prisma.keenUserProfile.upsert({
    where: { pseudonym },
    create: { pseudonym, facts: facts as object, factsHash: hash },
    update: { facts: facts as object, factsHash: hash },
  });
  return facts;
}

/**
 * Patch — merges new facts on top of existing JSONB. Returns the merged result.
 * Arrays are replaced wholesale (not concatenated) so callers always pass the
 * full intended value.
 */
export async function patchProfile(
  pseudonym: string,
  patch: Partial<KeenFacts>,
): Promise<KeenFacts> {
  const existing = (await getProfile(pseudonym)) ?? {};
  const merged: KeenFacts = { ...existing, ...patch };
  if (patch.notes) {
    merged.notes = { ...(existing.notes ?? {}), ...patch.notes };
  }
  return upsertProfile(pseudonym, merged);
}

export async function deleteProfile(pseudonym: string): Promise<void> {
  await prisma.keenUserProfile.deleteMany({ where: { pseudonym } });
}
