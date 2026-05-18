"use client";

import { useState } from "react";
import { userSubmitContent } from "@/lib/actions/admin-content";

export function UserContentSubmit() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    summary: "",
    url: "",
    type: "ARTICLE" as "ARTICLE" | "VIDEO",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await userSubmitContent({
        title: form.title.trim(),
        summary: form.summary.trim() || undefined,
        url: form.url.trim() || undefined,
        type: form.type,
      });
      if (res.ok) {
        setDone(true);
        setOpen(false);
        setForm({ title: "", summary: "", url: "", type: "ARTICLE" });
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-primary/10 border border-primary/20 p-5 text-center">
        <p className="text-2xl mb-1">🎉</p>
        <p className="font-heading text-base text-primary">Thank you for your submission!</p>
        <p className="text-xs text-muted-foreground mt-1">
          Our team will review it before publishing.
        </p>
        <button
          className="mt-3 text-xs text-primary underline"
          onClick={() => setDone(false)}
        >
          Submit another
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border border-dashed border-border bg-card hover:bg-muted hover:border-primary/30 transition p-5 flex flex-col items-center gap-2 text-center"
      >
        <span className="text-2xl">📤</span>
        <p className="font-heading text-sm font-bold text-foreground">
          Share something useful?
        </p>
        <p className="text-xs text-muted-foreground">
          Submit an article or video for the community. Our team reviews all submissions.
        </p>
        <span className="mt-1 text-xs font-semibold text-primary">Submit content →</span>
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-base font-bold text-foreground">
          Share useful content
        </h3>
        <button
          onClick={() => setOpen(false)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Type toggle */}
        <div className="flex gap-2">
          {(["ARTICLE", "VIDEO"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm((f) => ({ ...f, type: t }))}
              className={`flex-1 rounded-xl border py-2 text-xs font-semibold transition ${
                form.type === t
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:bg-muted"
              }`}
            >
              {t === "ARTICLE" ? "📄 Article" : "🎬 Video"}
            </button>
          ))}
        </div>

        {/* Title */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Title *
          </label>
          <input
            className="input-base"
            placeholder="e.g. Iron-rich foods during pregnancy"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
            maxLength={140}
          />
        </div>

        {/* Summary */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Brief description (optional)
          </label>
          <textarea
            className="input-base min-h-[72px] resize-none"
            placeholder="Why is this useful? What will readers learn?"
            value={form.summary}
            onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
            maxLength={280}
          />
        </div>

        {/* URL */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Link (article URL, YouTube, Instagram — optional)
          </label>
          <input
            className="input-base"
            type="url"
            placeholder="https://..."
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
          />
        </div>

        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !form.title.trim()}
          className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Submit for review"}
        </button>

        <p className="text-[10px] text-muted-foreground text-center">
          Submissions are reviewed by our team before publishing. Thank you for contributing! 🙏
        </p>
      </form>
    </div>
  );
}
