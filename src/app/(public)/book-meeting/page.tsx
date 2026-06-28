"use client";

import { motion } from "framer-motion";
import { MeetingForm } from "@/components/forms/meeting-form";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Calendar, Clock, Laptop } from "lucide-react";

export default function BookMeetingPage() {
  return (
    <main className="container py-20 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid gap-12 lg:grid-cols-[1fr_1.2fr]"
      >
        <div>
          <SectionHeading
            title="Book a meeting"
            description="Request a professional time slot with automated Google Calendar availability integrations."
          />
          
          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-coral/10 text-coral">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="font-poppins text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Duration</span>
                <p className="font-sans text-sm font-semibold text-navy dark:text-white">15 to 60 Minute Slots</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-coral/10 text-coral">
                <Laptop className="h-5 w-5" />
              </div>
              <div>
                <span className="font-poppins text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Platform</span>
                <p className="font-sans text-sm font-semibold text-navy dark:text-white">Google Meet Video Conferencing</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-coral/10 text-coral">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <span className="font-poppins text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Approval</span>
                <p className="font-sans text-sm font-semibold text-navy dark:text-white">Workflow-backed availability verification</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-zinc-200/60 bg-white p-8 rounded-2xl shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="font-sora text-xl font-bold text-navy dark:text-white mb-6 font-poppins">Select Date &amp; Time</h2>
          <MeetingForm />
        </div>
      </motion.div>
    </main>
  );
}
