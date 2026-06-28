"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function MeetingForm() {
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/meetings", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { "Content-Type": "application/json" }
    });

    const resData = await response.json();
    if (response.ok && resData.success !== false) {
      setStatus("Meeting request submitted successfully.");
      event.currentTarget.reset();
    } else {
      setStatus(resData.error?.message || "Unable to submit request. Check if input details are correct.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Input name="fullName" placeholder="Full name" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="phone" placeholder="Phone" />
      <Input name="company" placeholder="Company" />
      
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Date</label>
          <Input name="preferredDate" type="date" required className="h-10" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Preferred Time</label>
          <select 
            name="preferredTime" 
            required 
            className="h-10 rounded-md border border-zinc-200 bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950"
            defaultValue="09:00"
          >
            <option value="09:00">09:00 AM</option>
            <option value="09:30">09:30 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="10:30">10:30 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="11:30">11:30 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="12:30">12:30 PM</option>
            <option value="13:00">01:00 PM</option>
            <option value="13:30">01:30 PM</option>
            <option value="14:00">02:00 PM</option>
            <option value="14:30">02:30 PM</option>
            <option value="15:00">03:00 PM</option>
            <option value="15:30">03:30 PM</option>
            <option value="16:00">04:00 PM</option>
            <option value="16:30">04:30 PM</option>
            <option value="17:00">05:00 PM</option>
            <option value="17:30">05:30 PM</option>
            <option value="18:00">06:00 PM</option>
            <option value="18:30">06:30 PM</option>
            <option value="19:00">07:00 PM</option>
            <option value="19:30">07:30 PM</option>
            <option value="20:00">08:00 PM</option>
            <option value="20:30">08:30 PM</option>
            <option value="21:00">09:00 PM</option>
            <option value="21:30">09:30 PM</option>
            <option value="22:00">10:00 PM</option>
            <option value="22:30">10:30 PM</option>
            <option value="23:00">11:00 PM</option>
            <option value="23:30">11:30 PM</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Duration</label>
        <select 
          name="duration" 
          className="h-10 w-full rounded-md border border-zinc-200 bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950" 
          defaultValue="MINUTES_30"
        >
          <option value="MINUTES_15">15 minutes</option>
          <option value="MINUTES_30">30 minutes</option>
          <option value="MINUTES_45">45 minutes</option>
          <option value="MINUTES_60">60 minutes</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Purpose</label>
        <Textarea 
          name="purpose" 
          placeholder="What would you like to discuss?" 
          minLength={30} 
          required 
          className="min-h-[100px]"
        />
        <p className="text-[11px] text-zinc-500 mt-0.5">
          Purpose must be at least 30 characters long, otherwise the slot cannot be booked.
        </p>
      </div>

      <Button type="submit" className="bg-coral text-white hover:bg-coral/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 rounded-full px-6 py-5 shadow-md shadow-coral/10 font-poppins mt-2">
        <CalendarPlus className="mr-2 h-4 w-4" />
        Request meeting
      </Button>
      {status ? <p className="text-sm text-center font-semibold text-coral mt-2">{status}</p> : null}
    </form>
  );
}
