"use client";

import { useState, useTransition } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminListContent,
  adminCreateContent,
  adminTogglePublish,
  adminDeleteContent,
  type ContentInput,
} from "@/lib/actions/admin-content";
import {
  Plus, Edit3, Trash2, Eye, EyeOff, Youtube, Instagram,
  FileText, Video, Users, ShieldCheck, Globe, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const TOPICS = ["nutrition", "period", "pcos", "pregnancy", "postpartum", "mentalhealth", "safety", "puberty", "fertility", "menopause"];
const LIFE_STAGES = [
  "CHILD_4_7", "CHILD_8_10", "TEEN_11_13", "TEEN_14_17",
  "ADULT_MENSTRUATING", "TRYING_TO_CONCEIVE", "PREGNANT",
  "POSTPARTUM", "PERIMENOPAUSE", "MENOPAUSE",
];
const AGE_BANDS = ["BAND_4_7", "BAND_8_10", "BAND_11_13", "BAND_14_17"];

const EMPTY_FORM: ContentInput = {
  title: "", summary: "", body: "", videoUrl: "", instagramUrl: "",
  thumbnailUrl: "", readTimeMin: undefined, topics: [],
  lifeStages: [], ageBands: [], language: "en",
  parentalGuidance: false, source: "", sourceUrl: "", isPublished: true,
};

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

export function AdminClient() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ContentInput>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["adminContent"],
    queryFn: () => adminListContent({ limit: 100 }),
  });

  const handleCreate = () => {
    if (!form.title || !form.summary || form.topics.length === 0) {
      setFormError("Title, summary and at least one topic are required.");
      return;
    }
    setFormError(null);
    startTransition(async () => {
      const res = await adminCreateContent(form);
      if (!res.ok) { setFormError("Failed to create"); return; }
      qc.invalidateQueries({ queryKey: ["adminContent"] });
      setShowForm(false);
      setForm(EMPTY_FORM);
    });
  };

  const handleToggle = (id: string) => {
    startTransition(async () => {
      await adminTogglePublish(id);
      qc.invalidateQueries({ queryKey: ["adminContent"] });
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await adminDeleteContent(id);
      qc.invalidateQueries({ queryKey: ["adminContent"] });
      setConfirmDelete(null);
    });
  };

  const items = data?.items ?? [];
  const published = items.filter((i) => i.isPublished).length;
  const pending_mod = items.filter((i) => !i.isPublished && i.isUserSubmitted).length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl text-foreground flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" /> Content Studio
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Staff-only · Manage articles, videos & Instagram reels</p>
        </div>
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus className="w-4 h-4 mr-1" /> New Article
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: data?.total ?? 0, icon: FileText },
          { label: "Published", value: published, icon: Globe },
          { label: "Pending review", value: pending_mod, icon: Users },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 text-center">
            <s.icon className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Content list */}
      {isLoading ? (
        <div className="py-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground text-sm">
          No articles yet. Create your first one above.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-start gap-3 rounded-2xl border p-4 transition-colors",
                item.isPublished ? "border-border bg-card" : "border-dashed border-border bg-muted/40"
              )}
            >
              {/* Icon */}
              <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mt-0.5">
                {item.videoUrl ? <Video className="w-5 h-5 text-primary" /> :
                 item.instagramUrl ? <Instagram className="w-5 h-5 text-primary" /> :
                 <FileText className="w-5 h-5 text-primary" />}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm text-foreground truncate">{item.title}</p>
                  {!item.isPublished && (
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full px-2 py-0.5 border border-amber-200 dark:border-amber-700">
                      {item.isUserSubmitted ? "Pending review" : "Draft"}
                    </span>
                  )}
                  {item.isUserSubmitted && item.isPublished && (
                    <span className="text-[10px] bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full px-2 py-0.5">Community</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.summary}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {item.topics.slice(0, 3).map((t) => (
                    <span key={t} className="text-[9px] bg-primary/10 text-primary rounded-full px-1.5 py-0.5">{t}</span>
                  ))}
                  <span className="text-[9px] text-muted-foreground">{item._count.views} views · {item.language.toUpperCase()}</span>
                  {item.videoUrl && <Youtube className="w-3.5 h-3.5 text-red-500" />}
                  {item.instagramUrl && <Instagram className="w-3.5 h-3.5 text-pink-500" />}
                </div>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <Link
                  href={`/dashboard/learn/${item.slug}`}
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleToggle(item.id)}
                  disabled={pending}
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                  title={item.isPublished ? "Unpublish" : "Publish"}
                >
                  {item.isPublished ? <EyeOff className="w-4 h-4" /> : <Globe className="w-4 h-4 text-primary" />}
                </button>
                <button
                  onClick={() => setConfirmDelete(item.id)}
                  disabled={pending}
                  className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="font-heading text-xl text-foreground sticky top-0 bg-card pb-2">New Article / Video</h2>

            <Field label="Title*">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={200}
                className="input-base" placeholder="e.g. Iron-Rich Foods for Pregnancy" />
            </Field>

            <Field label="Summary* (shown in cards)">
              <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })}
                rows={2} maxLength={500} className="input-base resize-none"
                placeholder="Short description — 1-2 sentences" />
            </Field>

            <Field label="Article body (Markdown)">
              <textarea value={form.body ?? ""} onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows={8} className="input-base resize-none font-mono text-xs"
                placeholder="## Heading&#10;&#10;Article content in Markdown..." />
            </Field>

            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="YouTube URL">
                <input value={form.videoUrl ?? ""} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  className="input-base" placeholder="https://youtu.be/..." />
              </Field>
              <Field label="Instagram Reel URL">
                <input value={form.instagramUrl ?? ""} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
                  className="input-base" placeholder="https://www.instagram.com/reel/..." />
              </Field>
              <Field label="Thumbnail URL">
                <input value={form.thumbnailUrl ?? ""} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                  className="input-base" placeholder="https://..." />
              </Field>
              <Field label="Read time (minutes)">
                <input type="number" min={1} max={120} value={form.readTimeMin ?? ""}
                  onChange={(e) => setForm({ ...form, readTimeMin: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="input-base" placeholder="e.g. 5" />
              </Field>
            </div>

            <Field label="Topics* (pick at least 1)">
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button key={t} type="button" onClick={() => setForm({ ...form, topics: toggle(form.topics, t) })}
                    className={cn("h-8 px-3 rounded-full border text-xs font-medium transition-all",
                      form.topics.includes(t) ? "bg-primary text-white border-primary" : "bg-card border-border hover:border-primary/40")}>
                    {t}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Life stages (leave empty = all adults)">
              <div className="flex flex-wrap gap-2">
                {LIFE_STAGES.map((ls) => (
                  <button key={ls} type="button" onClick={() => setForm({ ...form, lifeStages: toggle(form.lifeStages, ls) })}
                    className={cn("h-7 px-2.5 rounded-full border text-[10px] font-medium transition-all",
                      form.lifeStages.includes(ls) ? "bg-secondary text-secondary-foreground border-secondary" : "bg-card border-border hover:border-primary/40")}>
                    {ls}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Age bands (for child/teen content)">
              <div className="flex flex-wrap gap-2">
                {AGE_BANDS.map((ab) => (
                  <button key={ab} type="button" onClick={() => setForm({ ...form, ageBands: toggle(form.ageBands, ab) })}
                    className={cn("h-7 px-2.5 rounded-full border text-[10px] font-medium transition-all",
                      form.ageBands.includes(ab) ? "bg-rose-500 text-white border-rose-500" : "bg-card border-border hover:border-primary/40")}>
                    {ab}
                  </button>
                ))}
              </div>
            </Field>

            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Source">
                <input value={form.source ?? ""} onChange={(e) => setForm({ ...form, source: e.target.value })}
                  className="input-base" placeholder="e.g. WHO, ICMR" />
              </Field>
              <Field label="Source URL">
                <input value={form.sourceUrl ?? ""} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
                  className="input-base" placeholder="https://..." />
              </Field>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={form.parentalGuidance} onChange={(e) => setForm({ ...form, parentalGuidance: e.target.checked })}
                  className="h-4 w-4 accent-primary" />
                Parent co-watch recommended
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="h-4 w-4 accent-primary" />
                Publish immediately
              </label>
            </div>

            {formError && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{formError}</p>}

            <div className="flex justify-end gap-3 pt-2 sticky bottom-0 bg-card">
              <Button variant="ghost" onClick={() => setShowForm(false)} disabled={pending}>Cancel</Button>
              <Button onClick={handleCreate} disabled={pending}>
                {pending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                {pending ? "Saving…" : "Create Article"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-card rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="font-heading text-lg text-foreground">Delete this article?</h3>
            <p className="text-sm text-muted-foreground">This cannot be undone. All views will also be removed.</p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => handleDelete(confirmDelete)} disabled={pending}>
                {pending ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}
