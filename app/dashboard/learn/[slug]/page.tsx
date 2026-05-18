import { notFound } from "next/navigation";
import { getContentBySlug, recordContentView } from "@/lib/actions/content";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { ArticleView } from "./article-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getContentBySlug(slug);
  if (!item) return { title: "Article not found – NutriMama" };
  return {
    title: `${item.title} – NutriMama`,
    description: item.summary,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getContentBySlug(slug);
  if (!item) notFound();

  // Record view (best-effort — fire and forget)
  const s = await auth.api.getSession({ headers: await headers() });
  if (s) {
    recordContentView({ contentId: item.id }).catch(() => {});
  }

  return <ArticleView item={item as any} />;
}
