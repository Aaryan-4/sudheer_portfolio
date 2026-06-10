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

    setStatus(response.ok ? "Meeting request submitted." : "Unable to submit request.");
    if (response.ok) {
      event.currentTarget.reset();
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Input name="fullName" placeholder="Full name" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="phone" placeholder="Phone" />
      <Input name="company" placeholder="Company" />
      <Input name="preferredDate" type="date" required />
      <Input name="preferredTime" type="time" required />
      <select name="duration" className="h-10 rounded-md border bg-background px-3 text-sm" defaultValue="MINUTES_30">
        <option value="MINUTES_15">15 minutes</option>
        <option value="MINUTES_30">30 minutes</option>
        <option value="MINUTES_45">45 minutes</option>
        <option value="MINUTES_60">60 minutes</option>
      </select>
      <Textarea name="purpose" placeholder="Purpose" required />
      <Button type="submit">
        <CalendarPlus className="mr-2 h-4 w-4" />
        Request meeting
      </Button>
      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
    </form>
  );
}
