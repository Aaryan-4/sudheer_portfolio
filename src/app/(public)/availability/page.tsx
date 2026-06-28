"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CalendarDays, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/marketing/section-heading";

interface Slot {
  hour: number;
  minute: number;
  label: string;
  status: "available" | "occupied";
}

interface DayAvailability {
  date: string;
  dayName: string;
  slots: Slot[];
}

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<DayAvailability | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get visitor's local today date formatted as YYYY-MM-DD
    const localToday = new Date().toLocaleDateString("en-CA"); // Matches YYYY-MM-DD format exactly

    fetch(`/api/availability/hours?date=${localToday}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data[0]) {
          setAvailability(resData.data[0]);
        }
      })
      .catch((err) => console.error("Error fetching availability:", err))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const formattedDate = availability
    ? new Date(availability.date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

  return (
    <main className="container py-20 lg:py-28">
      <div className="flex flex-col gap-8 max-w-2xl mx-auto">
        {/* Page Header */}
        <SectionHeading
          title="Availability Calendar"
          description="View my real-time time slots for today to check if a slot is available before requesting a meeting."
        />

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between border-b border-zinc-200/50 pb-4 dark:border-zinc-800/50 gap-4">
          <div className="font-poppins text-lg font-bold text-navy dark:text-white">
            {isLoading ? "Loading today's date..." : formattedDate}
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10" />
              <span className="text-zinc-600 dark:text-zinc-400">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500 ring-4 ring-rose-500/10" />
              <span className="text-zinc-600 dark:text-zinc-400">Occupied / Booked</span>
            </div>
          </div>
        </div>

        {/* Today's Availability Card */}
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/40" />
            ))}
          </div>
        ) : !availability ? (
          <div className="text-center py-12 text-zinc-500">Failed to load availability data.</div>
        ) : (
          <div className="space-y-3">
            {availability.slots.map((slot, index) => {
              const isAvailable = slot.status === "available";

              return (
                <motion.div
                  key={slot.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                    isAvailable
                      ? "bg-emerald-50/10 border-emerald-100/50 hover:bg-emerald-50/20 dark:bg-emerald-950/5 dark:border-emerald-900/20"
                      : "bg-rose-50/10 border-rose-100/50 dark:bg-rose-950/5 dark:border-rose-900/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        isAvailable
                          ? "bg-emerald-100/50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                          : "bg-rose-100/50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                      }`}
                    >
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-poppins font-bold text-sm text-navy dark:text-white">
                        {slot.label}
                      </p>
                      <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Duration: 30 minutes
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold font-poppins uppercase tracking-wider flex items-center gap-1.5 ${
                      isAvailable
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                        : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isAvailable ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    {isAvailable ? "Available" : "Occupied"}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        <div className="rounded-2xl bg-navy p-6 text-white dark:bg-zinc-900 border border-navy dark:border-zinc-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Info className="h-5 w-5 text-coral shrink-0" />
            <p className="font-sans text-xs text-zinc-300">
              Find an open slot today? Click the button to schedule your meeting directly.
            </p>
          </div>
          <Button asChild size="sm" className="bg-coral text-white hover:bg-coral/90 rounded-full font-poppins shadow-md shadow-coral/25 shrink-0 px-5">
            <Link href="/book-meeting">
              <CalendarDays className="mr-2 h-4 w-4" />
              Book Meeting
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
