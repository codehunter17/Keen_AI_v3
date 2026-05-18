"use client";

import { useState, useTransition } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listDependentProfiles, createDependentProfile, softDeleteDependentProfile } from "@/lib/actions/dependent";
import { ageFromDob } from "@/lib/lifecycle";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Users, Plus, Baby, Trash2, ChevronRight, Heart, Apple, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AGE_BAND_LABEL: Record<string, string> = {
  BAND_4_7: "4–7 years",
  BAND_8_10: "8–10 years",
  BAND_11_13: "11–13 years",
  BAND_14_17: "14–17 years",
};

const RELATIONSHIP_LABEL: Record<string, string> = {
  DAUGHTER: "Daughter",
  NIECE: "Niece",
  SISTER: "Sister",
  OTHER: "Other",
};

export function FamilyClient() {
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [dob, setDob] = useState("");
  const [relationship, setRelationship] = useState<"DAUGHTER" | "NIECE" | "SISTER" | "OTHER">("DAUGHTER");
  const [consent, setConsent] = useState(false);

  const { data: dependents = [], isLoading } = useQuery({
    queryKey: ["dependentProfiles"],
    queryFn: () => listDependentProfiles(),
  });

  const handleAdd = () => {
    if (!firstName.trim() || !dob || !consent) return;
    setError(null);
    startTransition(async () => {
      const res = await createDependentProfile({
        firstName: firstName.trim(),
        dob,
        relationship,
        parentalConsentGiven: true,
      });
      if (!res.ok) {
        setError(res.message);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["dependentProfiles"] });
      setShowAdd(false);
      setFirstName(""); setDob(""); setConsent(false);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await softDeleteDependentProfile(id);
      queryClient.invalidateQueries({ queryKey: ["dependentProfiles"] });
      setDeleteId(null);
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" /> Family Profiles
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add a child or teen to NutriMama. Their content is curated for their age — safely.
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="shrink-0" size="sm">
          <Plus className="w-4 h-4 mr-1" /> Add Profile
        </Button>
      </div>

      {/* Info banner */}
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-sm text-foreground flex gap-3">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-primary">DPDP-compliant child safety</p>
          <p className="text-muted-foreground mt-0.5">
            Under-12 profiles see only body-safety education and nutrition. AI chat is disabled for all minors.
            All data is stored under your account.
          </p>
        </div>
      </div>

      {/* Profile list */}
      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground text-sm">Loading…</div>
      ) : dependents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <Baby className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-foreground">No family profiles yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add a daughter, niece, or sister and NutriMama adapts to her age.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {dependents.map((dep) => {
            const age = ageFromDob(dep.dob);
            return (
              <Link
                key={dep.id}
                href={`/dashboard/family/${dep.id}`}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:bg-accent/40 transition-colors group"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                  {dep.firstName.charAt(0).toUpperCase()}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{dep.firstName}</p>
                  <p className="text-xs text-muted-foreground">
                    {RELATIONSHIP_LABEL[dep.relationship]} · Age {age} · {AGE_BAND_LABEL[dep.ageBand] ?? dep.ageBand}
                  </p>
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    {age < 12 && (
                      <>
                        <span className="inline-flex items-center gap-1 text-[10px] bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-full px-2 py-0.5">
                          <ShieldCheck className="w-3 h-3" /> Safety education
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full px-2 py-0.5">
                          <Apple className="w-3 h-3" /> Nutrition
                        </span>
                      </>
                    )}
                    {age >= 12 && (
                      <>
                        <span className="inline-flex items-center gap-1 text-[10px] bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full px-2 py-0.5">
                          <Heart className="w-3 h-3" /> Period education
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full px-2 py-0.5">
                          <Apple className="w-3 h-3" /> Nutrition
                        </span>
                        {dep.cycleTrackingEnabled && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full px-2 py-0.5">
                            Cycle tracker
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </Link>
            );
          })}
        </div>
      )}

      {/* Add profile sheet */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
            />
            <motion.div
              className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl p-6 space-y-4"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
            >
              <h2 className="font-heading text-xl text-foreground">Add family profile</h2>

              <div>
                <label className="block text-sm font-medium mb-1">Child's first name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  maxLength={50}
                  placeholder="e.g. Ananya"
                  className="w-full h-11 rounded-xl border border-border bg-input/40 px-3 outline-none focus:ring-2 focus:ring-ring text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date of birth</label>
                <input
                  type="date"
                  value={dob}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border bg-input/40 px-3 outline-none focus:ring-2 focus:ring-ring text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Relationship</label>
                <div className="flex flex-wrap gap-2">
                  {(["DAUGHTER", "NIECE", "SISTER", "OTHER"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRelationship(r)}
                      className={cn(
                        "h-9 px-4 rounded-full border text-xs font-semibold transition-all",
                        relationship === r
                          ? "bg-primary text-white border-primary"
                          : "bg-card border-border text-foreground hover:border-primary/40"
                      )}
                    >
                      {RELATIONSHIP_LABEL[r]}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <span className="text-xs text-muted-foreground">
                  I confirm I am this child's parent/guardian and give consent for NutriMama to store
                  their health data as a dependent profile under my account, as required by the DPDP Act 2023.
                </span>
              </label>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setShowAdd(false)} disabled={pending}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAdd}
                  disabled={!firstName.trim() || !dob || !consent || pending}
                >
                  {pending ? "Adding…" : "Add profile"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
