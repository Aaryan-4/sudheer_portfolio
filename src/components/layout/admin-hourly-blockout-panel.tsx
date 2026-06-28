"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Calendar, Check, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

export function AdminHourlyBlockoutPanel() {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toLocaleDateString("en-CA");
  });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<{ hour: number; minute: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch slots whenever the selectedDate changes
  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setMessage(null);

    fetch(`/api/availability/hours?date=${selectedDate}`)
      .then((res) => res.json())
      .then((resData) => {
        if (active && resData.data && resData.data[0]) {
          const dayData: DayAvailability = resData.data[0];
          setSlots(dayData.slots);
          
          // Initialize blocked slots based on currently occupied slots
          const initiallyBlocked = dayData.slots
            .filter((s) => s.status === "occupied")
            .map((s) => ({ hour: s.hour, minute: s.minute }));
          setBlockedSlots(initiallyBlocked);
        }
      })
      .catch((err) => {
        console.error("Error fetching hourly availability:", err);
        if (active) setMessage({ type: "error", text: "Failed to load slots for this date." });
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedDate]);

  // Automatically roll over selectedDate if it's set to "today" and the day ends (passes midnight)
  useEffect(() => {
    const todayStr = new Date().toLocaleDateString("en-CA");
    
    // Set up check interval
    const intervalId = setInterval(() => {
      const currentToday = new Date().toLocaleDateString("en-CA");
      const pageWasSetToToday = selectedDate === todayStr;
      
      if (currentToday !== todayStr && pageWasSetToToday) {
        console.log("Midnight rollover detected! Shifting selected date to new day:", currentToday);
        setSelectedDate(currentToday);
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [selectedDate]);

  function handleToggleSlot(hour: number, minute: number) {
    setBlockedSlots((prev) => {
      const exists = prev.some((s) => s.hour === hour && s.minute === minute);
      if (exists) {
        return prev.filter((s) => !(s.hour === hour && s.minute === minute));
      } else {
        return [...prev, { hour, minute }];
      }
    });
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/availability/hours", {
        method: "POST",
        body: JSON.stringify({
          date: selectedDate,
          blockedSlots: blockedSlots
        }),
        headers: { "Content-Type": "application/json" }
      });

      const resData = await response.json();
      if (!response.ok || !resData.data?.success) {
        throw new Error(resData.error?.message || "Failed to save blockouts");
      }

      setMessage({ type: "success", text: "Hourly availability updated successfully!" });
      
      // Update local slots state status to match blocked selection
      setSlots((prev) =>
        prev.map((slot) => {
          const isBlocked = blockedSlots.some(
            (s) => s.hour === slot.hour && s.minute === slot.minute
          );
          return {
            ...slot,
            status: isBlocked ? "occupied" : "available"
          };
        })
      );
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error saving hourly blockouts"
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <CardHeader>
        <CardTitle className="font-poppins text-xl font-bold text-navy dark:text-white">
          Hourly Availability Manager
        </CardTitle>
        <CardDescription className="text-zinc-500 dark:text-zinc-400">
          Select a date to customize your availability. Red slots are marked as Occupied (Blocked), green slots are Available.
          All slots automatically reset to Available daily at midnight/12:30 AM rollover.
        </CardDescription>
      </CardHeader>

      <div className="p-6 pt-0 space-y-6">
        {/* Date Selector */}
        <div className="flex flex-col gap-2 max-w-xs">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Target Date
          </label>
          <div className="relative">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 h-10"
              disabled={isLoading || isSaving}
            />
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`flex items-start gap-2.5 p-4 rounded-xl text-sm border font-medium ${
              message.type === "success"
                ? "bg-emerald-50/30 border-emerald-100/50 text-emerald-800 dark:bg-emerald-950/10 dark:border-emerald-900/20 dark:text-emerald-400"
                : "bg-rose-50/30 border-rose-100/50 text-rose-800 dark:bg-rose-950/10 dark:border-rose-900/20 dark:text-rose-400"
            }`}
          >
            {message.type === "success" ? (
              <Check className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Hourly Slots Toggles */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 animate-pulse">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-zinc-100 dark:bg-zinc-900" />
            ))}
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-6 text-zinc-500">No slots defined.</div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {slots.map((slot) => {
                const isBlocked = blockedSlots.some(
                  (s) => s.hour === slot.hour && s.minute === slot.minute
                );

                return (
                  <button
                    key={slot.label}
                    type="button"
                    onClick={() => handleToggleSlot(slot.hour, slot.minute)}
                    disabled={isSaving}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left ${
                      isBlocked
                        ? "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/10 dark:border-rose-900/20 dark:text-rose-400"
                        : "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/10 dark:border-emerald-900/20 dark:text-emerald-400"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 opacity-70" />
                      <div>
                        <span className="font-poppins text-xs font-bold block">{slot.label}</span>
                        <span className="text-[10px] opacity-80 block mt-0.5">30 mins</span>
                      </div>
                    </div>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ring-4 ${
                        isBlocked ? "bg-rose-500 ring-rose-500/10" : "bg-emerald-500 ring-emerald-500/10"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-coral text-white hover:bg-coral/90 rounded-full px-6 font-poppins"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Availability
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
