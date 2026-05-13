"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addCalendarEvent } from "@/lib/actions/calendar";
import { motion } from "motion/react";
import { Calendar, Clock, MapPin, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CreateEventPage() {
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
      router.push("/dashboard");
      router.refresh();
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Link
        href="/dashboard"
        className="flex items-center text-primary/60 hover:text-primary mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold text-sm uppercase tracking-widest">Back to Dashboard</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border shadow-2xl rounded-[3rem] p-8 md:p-12"
      >
        <div className="flex items-center space-x-4 mb-10">
          <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Add Journey Mile
            </h1>
            <p className="text-muted-foreground font-medium">
              Mark a new milestone in your pregnancy.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              What&apos;s the occasion?
            </label>
            <div className="relative">
              <input
                required
                type="text"
                placeholder="e.g., Biweekly Check-up, Yoga Session"
                className="w-full bg-muted/30 border border-border rounded-2xl p-5 pl-14 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-lg font-medium"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 w-6 h-6" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Date
              </label>
              <div className="relative">
                <input
                  required
                  type="date"
                  className="w-full bg-muted/30 border border-border rounded-2xl p-5 pl-14 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 w-6 h-6" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Time
              </label>
              <div className="relative">
                <input
                  required
                  type="text"
                  placeholder="e.g., 10:30 AM"
                  className="w-full bg-muted/30 border border-border rounded-2xl p-5 pl-14 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
                <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g., City Medical Wing, Virtual"
                className="w-full bg-muted/30 border border-border rounded-2xl p-5 pl-14 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 w-6 h-6" />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-primary text-white py-6 rounded-3xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <span>Save Milestone</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
