import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { notFound } from "next/navigation";

import { BLOG_POSTS } from "@/lib/blog-data";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = parseInt(id, 10);
  const post = BLOG_POSTS.find((p) => p.id === postId);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="flex items-center space-x-1 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/Nutrilogo.jpg"
              alt="NutriMama Logo"
              width={40}
              height={40}
              className="rounded-xl shadow-sm"
            />
            <div className="text-2xl font-bold font-heading  bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent">
              NutriMama
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link
            href="/auth/sign-up"
            className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-all shadow-md hover:scale-105 active:scale-95 text-sm md:text-base"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <Link
          href="/blog"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-12 font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>

        <header className="space-y-6 mb-12 text-center md:text-left">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest">
            {post.category}
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-6 text-sm font-semibold text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                {post.author[0]}
              </div>
              <span>{post.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-secondary" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </header>

        <div className="relative w-full aspect-21/9 md:aspect-3/1 rounded-4xl overflow-hidden shadow-xl border border-border mb-16">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>

        <article className="max-w-none text-muted-foreground leading-relaxed space-y-6 [&>p]:text-lg [&>h3]:text-3xl [&>h3]:font-heading [&>h3]:font-bold [&>h3]:text-foreground [&>h3]:mt-12 [&>h3]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-3 [&>ul]:text-lg [&>ul>li>strong]:text-foreground">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        <div className="mt-24 pt-12 border-t border-border flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mb-4">
            {post.author[0]}
          </div>
          <h3 className="text-xl font-bold mb-2">Written by {post.author}</h3>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            Sharing expert insights and practical advice to help expecting
            mothers navigate their journey with confidence.
          </p>
        </div>
      </main>

      {/* Footer (Simplified) */}
      <footer className="bg-card pt-12 pb-12 border-t border-border text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest">
        <p>© 2026 NutriMama. All rights reserved.</p>
      </footer>
    </div>
  );
}
