"use server";

// Admin + user content submission actions.
// Admin access = email in ADMIN_EMAILS env var (no DB flag required).
// Any logged-in user → can submit content for moderation.

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin, ensureStaffFlag } from "@/lib/admin-emails";

async function requireSession() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) throw new Error("UNAUTHORIZED");
  return s;
}

async function requireStaff() {
  const s = await requireSession();
  // Primary check: email in ADMIN_EMAILS env var — no DB query needed.
  requireAdmin(s.user.email);
  // Sync the DB flag lazily so session reflects isStaff = true.
  ensureStaffFlag(s.user.id).catch(() => {});
  return s;
}

// ── Slug helpers ──────────────────────────────────────────────────────────────
function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let i = 1;
  while (true) {
    const existing = await prisma.contentItem.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${i++}`;
  }
}

// ── Schema ────────────────────────────────────────────────────────────────────
const contentSchema = z.object({
  title: z.string().trim().min(5).max(200),
  summary: z.string().trim().min(10).max(500),
  body: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  readTimeMin: z.number().int().min(1).max(120).optional(),
  topics: z.array(z.string()).min(1),
  lifeStages: z.array(z.string()),
  ageBands: z.array(z.string()),
  language: z.enum(["en", "hi", "ta", "te", "bn", "mr"]).default("en"),
  parentalGuidance: z.boolean().default(false),
  source: z.string().optional(),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  isPublished: z.boolean().default(true),
});

export type ContentInput = z.infer<typeof contentSchema>;

// ── Staff: create article ─────────────────────────────────────────────────────
export async function adminCreateContent(input: ContentInput) {
  await requireStaff();
  const data = contentSchema.parse(input);
  const slug = await uniqueSlug(toSlug(data.title));

  const item = await prisma.contentItem.create({
    data: {
      slug,
      title: data.title,
      summary: data.summary,
      body: data.body || null,
      videoUrl: data.videoUrl || null,
      instagramUrl: data.instagramUrl || null,
      thumbnailUrl: data.thumbnailUrl || null,
      readTimeMin: data.readTimeMin || null,
      topics: data.topics,
      lifeStages: data.lifeStages,
      ageBands: data.ageBands,
      language: data.language,
      parentalGuidance: data.parentalGuidance,
      source: data.source || null,
      sourceUrl: data.sourceUrl || null,
      isPublished: data.isPublished,
      isUserSubmitted: false,
    },
  });

  revalidatePath("/dashboard/learn");
  return { ok: true, id: item.id, slug: item.slug } as const;
}

// ── Staff: update article ─────────────────────────────────────────────────────
export async function adminUpdateContent(id: string, input: ContentInput) {
  await requireStaff();
  const data = contentSchema.parse(input);

  await prisma.contentItem.update({
    where: { id },
    data: {
      title: data.title,
      summary: data.summary,
      body: data.body || null,
      videoUrl: data.videoUrl || null,
      instagramUrl: data.instagramUrl || null,
      thumbnailUrl: data.thumbnailUrl || null,
      readTimeMin: data.readTimeMin || null,
      topics: data.topics,
      lifeStages: data.lifeStages,
      ageBands: data.ageBands,
      language: data.language,
      parentalGuidance: data.parentalGuidance,
      source: data.source || null,
      sourceUrl: data.sourceUrl || null,
      isPublished: data.isPublished,
    },
  });

  revalidatePath("/dashboard/learn");
  revalidatePath(`/dashboard/admin`);
  return { ok: true } as const;
}

// ── Staff: list all content (including unpublished) ───────────────────────────
export async function adminListContent(opts: { limit?: number; offset?: number } = {}) {
  await requireStaff();
  const [items, total] = await Promise.all([
    prisma.contentItem.findMany({
      take: opts.limit ?? 50,
      skip: opts.offset ?? 0,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, slug: true, title: true, summary: true, topics: true,
        isPublished: true, isUserSubmitted: true, language: true,
        videoUrl: true, instagramUrl: true, createdAt: true,
        _count: { select: { views: true } },
      },
    }),
    prisma.contentItem.count(),
  ]);
  return { items, total };
}

// ── Staff: toggle publish ─────────────────────────────────────────────────────
export async function adminTogglePublish(id: string) {
  await requireStaff();
  const item = await prisma.contentItem.findUnique({ where: { id }, select: { isPublished: true } });
  if (!item) return { ok: false, message: "Not found" } as const;

  await prisma.contentItem.update({
    where: { id },
    data: { isPublished: !item.isPublished },
  });
  revalidatePath("/dashboard/learn");
  revalidatePath("/dashboard/admin");
  return { ok: true, isPublished: !item.isPublished } as const;
}

// ── Staff: delete (hard) ──────────────────────────────────────────────────────
export async function adminDeleteContent(id: string) {
  await requireStaff();
  await prisma.contentItem.delete({ where: { id } });
  revalidatePath("/dashboard/learn");
  revalidatePath("/dashboard/admin");
  return { ok: true } as const;
}

// ── Any user: submit content for moderation ───────────────────────────────────
// Simple schema — the user just types a title, optional description, and a URL.
// We auto-detect Instagram vs YouTube vs generic article from the URL.
const userSubmitSchema = z.object({
  title: z.string().trim().min(3).max(200),
  summary: z.string().trim().max(500).optional(),
  url: z.string().url().optional().or(z.literal("")).optional(),
  type: z.enum(["ARTICLE", "VIDEO"]).default("ARTICLE"),
});

export async function userSubmitContent(input: z.infer<typeof userSubmitSchema>) {
  const s = await requireSession();
  const data = userSubmitSchema.parse(input);
  const slug = await uniqueSlug(`user-${toSlug(data.title)}`);

  // Auto-detect URL type
  const url = data.url?.trim() || null;
  const isInstagram = url?.includes("instagram.com") ?? false;
  const isYoutube   = url ? /youtube\.com|youtu\.be/.test(url) : false;

  await prisma.contentItem.create({
    data: {
      slug,
      title: data.title,
      summary: data.summary || data.title,
      body: null,
      videoUrl: isYoutube ? url : null,
      instagramUrl: isInstagram ? url : null,
      // Generic article link stored in a body note if not video platform
      ...(url && !isInstagram && !isYoutube
        ? { body: `Source: ${url}` }
        : {}),
      topics: [data.type === "VIDEO" ? "video" : "article"],
      lifeStages: [],
      ageBands: [],
      language: "en",
      isPublished: false,  // awaits staff review
      isUserSubmitted: true,
      submittedById: s.user.id,
    },
  });

  return { ok: true } as const;
}
