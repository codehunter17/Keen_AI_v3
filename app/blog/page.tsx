"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

import { BLOG_POSTS } from "@/lib/blog-data";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 md:px-8 max-w-7xl mx-auto">
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
            <div className="text-2xl font-bold font-heading bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent">
              NutriMama
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link
            href="/auth/sign-up"
            className="bg-primary text-white p-2 rounded-full font-bold hover:bg-primary/90 transition-all shadow-md hover:scale-105 active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <header className="mb-20 text-center md:text-left">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6">
            Our Journal
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
            Insights for your <br />
            <span className="text-primary italic">motherhood journey.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Expert advice, nutritional guides, and technology updates to support
            you every step of the way.
          </p>
        </header>

        {/* Featured Post */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative grid grid-cols-1 lg:grid-cols-2 gap-12 bg-card p-4 rounded-[3rem] border border-border overflow-hidden hover:shadow-2xl transition-all"
          >
            <div className="relative h-96 lg:h-full min-h-[400px] rounded-[2.5rem] overflow-hidden">
              <Image
                src={BLOG_POSTS[0].image}
                alt="Featured Blog"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute top-6 left-6 px-4 py-2 bg-background/80 backdrop-blur-md rounded-full text-xs font-bold text-primary">
                Featured Post
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-6 p-6 lg:p-12">
              <div className="flex items-center space-x-4 text-sm font-semibold text-primary">
                <span>{BLOG_POSTS[0].category}</span>
                <span className="w-1 h-1 bg-primary/30 rounded-full" />
                <span className="text-muted-foreground">
                  {BLOG_POSTS[0].readTime}
                </span>
              </div>
              <h2 className="text-4xl font-heading font-bold leading-tight">
                {BLOG_POSTS[0].title}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {BLOG_POSTS[0].excerpt}
              </p>
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center font-bold text-primary">
                    {BLOG_POSTS[0].author[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{BLOG_POSTS[0].author}</p>
                    <p className="text-xs text-muted-foreground">
                      {BLOG_POSTS[0].date}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/blog/${BLOG_POSTS[0].id}`}
                  className="flex items-center space-x-2 text-primary font-bold hover:translate-x-2 transition-transform"
                >
                  <span>Read Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Blog Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {BLOG_POSTS.slice(1).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group space-y-6 flex flex-col cursor-pointer"
              >
                <Link href={`/blog/${post.id}`} className="w-full h-full block">
                  <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-border shadow-md">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute bottom-6 right-6 px-4 py-2 bg-background/90 backdrop-blur-md rounded-full text-xs font-bold text-secondary">
                      {post.category}
                    </div>
                  </div>
                  <div className="flex-1 space-y-4 p-4">
                    <div className="flex items-center space-x-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> {post.date}
                      </span>
                      <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-3xl font-heading font-bold group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="pt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2 font-semibold text-sm">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                          {post.author[0]}
                        </div>
                        <span>{post.author}</span>
                      </div>
                      <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="mt-32 bg-secondary/10 rounded-[3rem] p-12 md:p-24 text-center space-y-8 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/30 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="text-4xl md:text-5xl font-heading font-bold">
              Stay in the loop
            </h3>
            <p className="text-lg text-muted-foreground">
              Get the latest maternal health tips and NutriMama updates
              delivered directly to your inbox every week.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-8 py-5 rounded-full border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
              />
              <button className="bg-primary text-white px-10 py-5 rounded-full font-bold hover:scale-105 transition-all shadow-xl shadow-primary/20">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer (Simplified) */}
      <footer className="bg-card pt-12 pb-12 border-t border-border mt-32 text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest">
        <p>© 2026 NutriMama. All rights reserved.</p>
      </footer>
    </div>
  );
}
