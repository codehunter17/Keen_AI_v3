"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getCalendarEvents,
  deleteCalendarEvent,
  type CalendarEvent,
} from "@/lib/actions/calendar";
import { motion } from "motion/react";
import { Calendar, Plus, Trash2, MapPin, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SchedulePage() {
  const {
    data: events,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["calendar-events"],
    queryFn: async () => await getCalendarEvents(),
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      await deleteCalendarEvent(id);
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex flex-col h-full items-center justify-center gap-3 min-h-[60vh]"
        role="status"
        aria-live="polite"
      >
        <div
          className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"
          aria-hidden
        />
        <p className="text-sm text-muted-foreground font-medium">
          Loading your reminders…
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center text-primary/60 hover:text-primary mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-[10px] uppercase tracking-widest">
              Dashboard
            </span>
          </Link>
          <h1 className="text-4xl font-heading font-bold text-foreground tracking-tight">
            Your Full Journey Schedule
          </h1>
          <p className="text-muted-foreground font-medium">
            Keep track of all your appointments and milestones.
          </p>
        </div>

        <Link
          href="/dashboard/schedule/create"
          className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Event</span>
        </Link>
      </div>

      <div className="space-y-4">
        {events && events.length > 0 ? (
          events.map((event: CalendarEvent, i: number) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={event.id}
              className="bg-card p-8 rounded-[2.5rem] border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-center space-x-8">
                <div className="text-center w-[80px] border-r border-border pr-8 flex flex-col justify-center">
                  <p className="text-[10px] font-bold tracking-widest text-primary uppercase">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </p>
                  <p className="text-3xl font-bold text-foreground leading-none mt-1">
                    {new Date(event.date).getDate()}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-xl text-foreground">
                    {event.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-medium">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1.5 opacity-60" />
                      {event.timeString}
                    </div>
                    {event.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5 opacity-60" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(event.id)}
                className="w-full md:w-auto bg-red-500/5 text-red-500/40 hover:bg-red-500 hover:text-white px-6 py-4 rounded-2xl transition-all flex items-center justify-center"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-[3rem] border border-dashed border-border">
            <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-muted-foreground">
              No events scheduled yet
            </h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              Start tracking your pregnancy journey by adding your first
              milestone.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
