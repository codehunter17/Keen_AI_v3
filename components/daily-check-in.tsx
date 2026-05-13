"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Moon, Footprints, Smile, X, CheckCircle2 } from "lucide-react";
import { updateProfile } from "@/lib/actions/profile";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDashboardData } from "@/lib/actions/dashboard";
import { cn } from "@/lib/utils";

export function DailyCheckIn() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    sleepDuration: "8",
    movementDuration: "30",
    mood: "Refreshed",
  });

  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => await getDashboardData(),
    staleTime: 60000, // Cache for 1 minute
  });

  useEffect(() => {
    if (!data) return;
    
    const lastCheckIn = localStorage.getItem("lastCheckInDate");
    const today = new Date().toLocaleDateString();

    // Show if:
    // 1. Never checked in on this device today
    // 2. OR User metrics are missing (new user)
    const hasMissingData = !data?.user?.mood || !data?.user?.sleepDuration;
    const isNewDay = lastCheckIn !== today;

    if (isNewDay || hasMissingData) {
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [data]);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await updateProfile(formData);
      localStorage.setItem("lastCheckInDate", new Date().toLocaleDateString());
      setIsSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
      }, 2000);
    } catch {
      // Failed to save
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 no-print">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden"
          >
            {isSuccess ? (
              <div className="p-12 text-center space-y-4">
                <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto text-secondary">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-heading font-bold text-foreground">
                  Check-in Complete!
                </h2>
                <p className="text-muted-foreground font-medium">
                  Your daily vitals have been logged. Have a wonderful day!
                </p>
              </div>
            ) : (
              <div className="p-8 md:p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-heading font-bold text-foreground">
                      Daily Check-in
                    </h2>
                    <p className="text-muted-foreground font-medium">
                      How are you feeling today?
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Sleep */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-primary">
                      <Moon className="w-4 h-4" />
                      <label className="text-sm font-bold uppercase tracking-widest">
                        Restful Sleep (Hours)
                      </label>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {["6", "7", "8", "9", "10"].map((hours) => (
                        <button
                          key={hours}
                          onClick={() => setFormData({ ...formData, sleepDuration: hours })}
                          className={cn(
                            "py-3 rounded-2xl border font-bold transition-all",
                            formData.sleepDuration === hours
                              ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                              : "bg-background border-border text-muted-foreground hover:border-primary/50"
                          )}
                        >
                          {hours}h
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Movement */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-secondary">
                      <Footprints className="w-4 h-4" />
                      <label className="text-sm font-bold uppercase tracking-widest">
                        Gentle Movement
                      </label>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { l: "None", v: "0" },
                        { l: "15m", v: "15" },
                        { l: "30m", v: "30" },
                        { l: "45m+", v: "45" },
                      ].map((item) => (
                        <button
                          key={item.v}
                          onClick={() => setFormData({ ...formData, movementDuration: item.v })}
                          className={cn(
                            "py-3 rounded-2xl border font-bold transition-all",
                            formData.movementDuration === item.v
                              ? "bg-secondary text-white border-secondary shadow-lg shadow-secondary/20 scale-105"
                              : "bg-background border-border text-muted-foreground hover:border-secondary/50"
                          )}
                        >
                          {item.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mood */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-orange-500">
                      <Smile className="w-4 h-4" />
                      <label className="text-sm font-bold uppercase tracking-widest">
                        Current Mood
                      </label>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {["Refreshed", "Steady", "Tired", "Anxious", "Joyful", "Grumpy"].map((mood) => (
                        <button
                          key={mood}
                          onClick={() => setFormData({ ...formData, mood: mood })}
                          className={cn(
                            "py-3 rounded-2xl border font-bold text-xs transition-all",
                            formData.mood === mood
                              ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20 scale-105"
                              : "bg-background border-border text-muted-foreground hover:border-orange-500/50"
                          )}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="w-full py-5 bg-foreground text-background dark:bg-white dark:text-black rounded-[2rem] font-bold shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Logging Vitals..." : "Complete Check-in"}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
