"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AvailabilitySlot {
  id: string;
  dayOfWeek: number;
  isWorkingDay: boolean;
  startTime: string;
  endTime: string;
}

interface AdminAvailabilityPanelProps {
  initialSlots: AvailabilitySlot[];
}

const DAYS_OF_WEEK = [
  "",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

export function AdminAvailabilityPanel({ initialSlots }: AdminAvailabilityPanelProps) {
  const router = useRouter();
  const [slots, setSlots] = useState<AvailabilitySlot[]>(() => {
    // Fill in missing days
    const map = new Map(initialSlots.map((s) => [s.dayOfWeek, s]));
    const result: AvailabilitySlot[] = [];
    for (let day = 1; day <= 7; day++) {
      result.push(
        map.get(day) || {
          id: "",
          dayOfWeek: day,
          isWorkingDay: false,
          startTime: "09:00",
          endTime: "17:00"
        }
      );
    }
    return result;
  });

  const [savingDay, setSavingDay] = useState<number | null>(null);

  function handleChange(dayOfWeek: number, field: keyof AvailabilitySlot, value: boolean | string) {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.dayOfWeek === dayOfWeek ? { ...slot, [field]: value } : slot
      )
    );
  }

  async function handleSave(slot: AvailabilitySlot) {
    setSavingDay(slot.dayOfWeek);
    try {
      const response = await fetch("/api/availability", {
        method: "POST",
        body: JSON.stringify({
          dayOfWeek: slot.dayOfWeek,
          isWorkingDay: slot.isWorkingDay,
          startTime: slot.startTime,
          endTime: slot.endTime
        }),
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        throw new Error("Failed to save availability settings");
      }

      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving availability");
    } finally {
      setSavingDay(null);
    }
  }

  return (
    <div className="grid gap-4 max-w-3xl">
      {slots.map((slot) => (
        <Card key={slot.dayOfWeek} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 border border-zinc-200 bg-white hover:shadow-md transition-all dark:border-zinc-800 dark:bg-zinc-950">
          <div className="w-32">
            <CardTitle className="font-poppins text-lg font-bold text-navy dark:text-white">
              {DAYS_OF_WEEK[slot.dayOfWeek]}
            </CardTitle>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 flex-1">
            <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
              <input
                type="checkbox"
                checked={slot.isWorkingDay}
                onChange={(e) => handleChange(slot.dayOfWeek, "isWorkingDay", e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-coral focus:ring-coral"
              />
              Working Day
            </label>

            {slot.isWorkingDay && (
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => handleChange(slot.dayOfWeek, "startTime", e.target.value)}
                  className="w-28 h-9"
                />
                <span className="text-zinc-400">to</span>
                <Input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => handleChange(slot.dayOfWeek, "endTime", e.target.value)}
                  className="w-28 h-9"
                />
              </div>
            )}
          </div>

          <Button
            size="sm"
            onClick={() => handleSave(slot)}
            disabled={savingDay === slot.dayOfWeek}
            className="bg-coral text-white hover:bg-coral/90 rounded-full px-4"
          >
            {savingDay === slot.dayOfWeek ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Save className="h-4 w-4 mr-1" />
            )}
            Save
          </Button>
        </Card>
      ))}
    </div>
  );
}
