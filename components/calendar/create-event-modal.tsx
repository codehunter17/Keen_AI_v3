"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, MapPin, X, Loader2 } from "lucide-react";
import { addCalendarEvent } from "@/lib/actions/calendar";
import { useRouter } from "next/navigation";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateEventModal({ isOpen, onClose, onSuccess }: CreateEventModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addCalendarEvent({
        title: formData.title,
        date: new Date(formData.date),
        timeString: formData.time,
        location: formData.location,
      });
      onSuccess();
      onClose();
      router.refresh();
      setFormData({ title: "", date: "", time: "", location: "" });
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border shadow-2xl rounded-[2.5rem] w-full max-w-lg overflow-hidden relative"
            >
              <div className="absolute top-6 right-6 z-10">
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 md:p-10 space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-foreground">
                      Add Milestone
                    </h2>
                    <p className="text-sm text-muted-foreground font-medium">
                      Record a new event for your journey.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                      Event Title
                    </label>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        placeholder="e.g., Biweekly Check-up"
                        className="w-full bg-muted/30 border border-border rounded-2xl p-4 pl-12 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 w-5 h-5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                        Date
                      </label>
                      <div className="relative">
                        <input
                          required
                          type="date"
                          className="w-full bg-muted/30 border border-border rounded-2xl p-4 pl-12 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 w-5 h-5" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                        Time
                      </label>
                      <div className="relative">
                        <input
                          required
                          type="text"
                          placeholder="10:30 AM"
                          className="w-full bg-muted/30 border border-border rounded-2xl p-4 pl-12 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        />
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                      Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g., City Medical Wing"
                        className="w-full bg-muted/30 border border-border rounded-2xl p-4 pl-12 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 w-5 h-5" />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span>Save Milestone</span>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
