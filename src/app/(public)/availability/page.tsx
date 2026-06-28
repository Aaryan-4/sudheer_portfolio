"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/marketing/section-heading";

interface Slot {
  hour: number;
  label: string;
  status: "available" | "occupied" | "closed";
}

interface DayAvailability {
  date: string;
  dayName: string;
  slots: Slot[];
}

export default function AvailabilityPage() {
  const [currentDate, setCurrentDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch availability when currentDate changes
  useEffect(() => {
    let active = true;
    setIsLoading(true);

    fetch(`/api/availability/hours?date=${currentDate}`)
      .then((res) => res.json())
      .then((resData) => {
        if (active && resData.success) {
          setAvailability(resData.data);
        }
      })
      .catch((err) => console.error("Error fetching availability:", err))
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [currentDate]);

  const handlePrevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d.toISOString().split("T")[0]);
  };

  const handleNextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d.toISOString().split("T")[0]);
  };

  const handleResetToday = () => {
    setCurrentDate(new Date().toISOString().split("T")[0]);
  };

  // Determine date label range
  const startDateLabel = availability[0]
    ? new Date(availability[0].date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";
  const endDateLabel = availability[availability.length - 1]
    ? new Date(availability[availability.length - 1].date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

  // Check if we can go back (disable if start date is in the past)
  const todayStr = new Date().toISOString().split("T")[0];
  const isPrevDisabled = availability[0] ? availability[0].date <= todayStr : true;

  return (
    <main className="container py-20 lg:py-28">
      <div className="flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            title="Availability Calendar"
            description="View real-time calendar availability to choose the perfect slot before requesting a meeting."
          />

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-zinc-100 p-1.5 rounded-xl dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevWeek}
              disabled={isPrevDisabled || isLoading}
              className="h-9 w-9 rounded-lg hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <button
              onClick={handleResetToday}
              disabled={isLoading || currentDate === todayStr}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg font-poppins text-navy hover:bg-white dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all disabled:opacity-50"
            >
              Today
            </button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextWeek}
              disabled={isLoading}
              className="h-9 w-9 rounded-lg hover:bg-white dark:hover:bg-zinc-800"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Legend & Date Range */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200/50 pb-4 dark:border-zinc-800/50">
          <div className="font-poppins text-lg font-bold text-navy dark:text-white">
            {startDateLabel && endDateLabel ? `${startDateLabel} — ${endDateLabel}` : "Loading range..."}
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10" />
              <span className="font-medium text-zinc-600 dark:text-zinc-400">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500 ring-4 ring-rose-500/10" />
              <span className="font-medium text-zinc-600 dark:text-zinc-400">Occupied / Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-700 ring-4 ring-zinc-500/10" />
              <span className="font-medium text-zinc-600 dark:text-zinc-400">Closed / Holiday</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-[500px] animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/40"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
            {availability.map((day, dayIndex) => {
              const parsedDate = new Date(day.date);
              const isToday = day.date === todayStr;

              return (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: dayIndex * 0.05 }}
                  className={`flex flex-col rounded-2xl border bg-white dark:bg-zinc-950 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${
                    isToday
                      ? "border-coral/40 ring-1 ring-coral/20"
                      : "border-zinc-200/60 dark:border-zinc-800/60"
                  }`}
                >
                  {/* Day Header */}
                  <div
                    className={`p-4 text-center border-b flex flex-col items-center justify-center ${
                      isToday
                        ? "bg-coral/5 border-coral/10 dark:bg-coral/10"
                        : "bg-zinc-50/50 border-zinc-100 dark:bg-zinc-900/20 dark:border-zinc-900"
                    }`}
                  >
                    <span className="font-poppins text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                      {day.dayName.substring(0, 3)}
                    </span>
                    <span className="font-sora text-lg font-bold text-navy dark:text-white mt-1">
                      {parsedDate.toLocaleDateString("en-US", { day: "numeric", timeZone: "UTC" })}
                    </span>
                    {isToday && (
                      <span className="mt-1 px-2 py-0.5 rounded-full bg-coral/10 text-coral text-[10px] font-bold font-poppins uppercase">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Hourly Slots List */}
                  <div className="p-3 space-y-2 max-h-[460px] overflow-y-auto">
                    {day.slots.map((slot) => {
                      const isAvailable = slot.status === "available";
                      const isClosed = slot.status === "closed";

                      return (
                        <div
                          key={slot.hour}
                          className={`flex items-center justify-between p-2 rounded-xl border text-xs font-medium transition-colors ${
                            isAvailable
                              ? "bg-emerald-50/20 border-emerald-100/40 text-emerald-800 dark:text-emerald-400 dark:bg-emerald-950/10 dark:border-emerald-900/20"
                              : isClosed
                              ? "bg-zinc-50/50 border-zinc-100 text-zinc-400 dark:bg-zinc-900/10 dark:border-zinc-900 dark:text-zinc-600"
                              : "bg-rose-50/20 border-rose-100/40 text-rose-800 dark:text-rose-400 dark:bg-rose-950/10 dark:border-rose-900/20"
                          }`}
                        >
                          <span className="font-sans flex items-center gap-1.5">
                            <Clock className="h-3 w-3 opacity-60" />
                            {slot.label.split(" ")[0]}
                          </span>
                          
                          <span className="flex items-center gap-1 font-poppins font-bold uppercase text-[9px] tracking-wider">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isAvailable
                                  ? "bg-emerald-500"
                                  : isClosed
                                  ? "bg-zinc-300 dark:bg-zinc-700"
                                  : "bg-rose-500"
                              }`}
                            />
                            {slot.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 rounded-2xl bg-navy p-8 text-white dark:bg-zinc-900 md:flex-row border border-navy dark:border-zinc-800 shadow-xl shadow-navy/10">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-coral">
              <Info className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-poppins text-lg font-bold">Ready to book a slot?</h3>
              <p className="font-sans text-sm text-zinc-300 mt-1 max-w-xl">
                Slots listed as <span className="text-emerald-400 font-semibold">available</span> are free to book. Click the booking button to select your preferred date/time and fill out the details.
              </p>
            </div>
          </div>
          <Button asChild size="lg" className="bg-coral text-white hover:bg-coral/90 rounded-full font-poppins shadow-md shadow-coral/20 shrink-0">
            <Link href="/book-meeting">
              <CalendarDays className="mr-2 h-4 w-4" />
              Book Meeting Now
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
