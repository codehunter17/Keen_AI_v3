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
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 pb-20 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <div className="space-y-1 min-w-0">
          <Link
            href="/dashboard"
            className="flex items-center text-primary/60 hover:text-primary mb-3 md:mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-[10px] uppercase tracking-widest">
              Dashboard
            </span>
          </Link>
          <h1 className="text-2xl md:text-4xl font-heading font-bold text-foreground tracking-tight break-words">
            Your Full Journey Schedule
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium">
            Keep track of all your appointments and milestones.
          </p>
        </div>

        <Link
          href="/dashboard/schedule/create"
          className="bg-primary text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm w-full md:w-auto"
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
              className="bg-card p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 shadow-sm hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-center gap-4 md:gap-8 min-w-0">
                <div className="text-center w-[60px] md:w-[80px] border-r border-border pr-4 md:pr-8 flex flex-col justify-center shrink-0">
                  <p className="text-[10px] font-bold tracking-widest text-primary uppercase">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground leading-none mt-1">
                    {new Date(event.date).getDate()}
                  </p>
                </div>
                <div className="space-y-2 min-w-0 flex-1">
                  <h4 className="font-heading font-bold text-base md:text-xl text-foreground break-words">
                    {event.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-muted-foreground font-medium">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1.5 opacity-60 shrink-0" />
                      <span className="break-words">{event.timeString}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center min-w-0">
                        <MapPin className="w-4 h-4 mr-1.5 opacity-60 shrink-0" />
                        <span className="break-words">{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(event.id)}
                aria-label="Delete event"
                className="w-full md:w-auto bg-red-500/5 text-red-500/60 md:text-red-500/40 hover:bg-red-500 hover:text-white px-6 py-3 md:py-4 rounded-2xl transition-all flex items-center justify-center"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 md:py-20 px-6 bg-muted/20 rounded-3xl md:rounded-[3rem] border border-dashed border-border">
            <Calendar className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg md:text-xl font-bold text-muted-foreground">
              No events scheduled yet
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-sm mx-auto">
              Start tracking your pregnancy journey by adding your first
              milestone.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
