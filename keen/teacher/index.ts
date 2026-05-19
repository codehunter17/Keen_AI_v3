/**
 * Teacher Ingest — Module 2.
 *
 * Captures doctor consults as structured ClinicalCase rows. These are weighted
 * higher than user signals during retrieval (see knowledge/index.ts).
 *
 * Inputs come from the operator console (/admin/cases/new) where Krishna logs
 * what each clinician decided, the reasoning, and a follow-up checkpoint.
 */

import { prisma } from "@/lib/prisma";
import type { ClinicalCase, Outcome } from "../types";

export interface AddTeacherInput {
  displayName: string;
  specialty: string;
  trustWeight?: number;
}

export async function addTeacher(input: AddTeacherInput) {
  return prisma.keenTeacher.create({
    data: {
      displayName: input.displayName,
      specialty: input.specialty,
      trustWeight: input.trustWeight ?? 1.0,
    },
  });
}

export async function listTeachers() {
  return prisma.keenTeacher.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function ingestCase(input: Omit<ClinicalCase, "id">) {
  return prisma.keenClinicalCase.create({
    data: {
      teacherId: input.teacherId,
      occurredAt: input.occurredAt,
      inputs: input.inputs as object,
      differential: input.differential ? (input.differential as unknown[] as object) : undefined,
      decision: input.decision as object,
      reasoning: input.reasoning ?? null,
    },
  });
}

export async function recordOutcome(input: Omit<Outcome, "id">) {
  return prisma.keenOutcome.create({
    data: {
      caseId: input.caseId,
      checkpointAt: input.checkpointAt,
      status: input.status,
      notes: input.notes ?? null,
    },
  });
}

export async function listCases(limit = 50) {
  return prisma.keenClinicalCase.findMany({
    orderBy: { occurredAt: "desc" },
    take: limit,
    include: {
      teacher: { select: { displayName: true, specialty: true } },
      outcomes: { orderBy: { checkpointAt: "asc" } },
    },
  });
}
