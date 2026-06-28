"use client";

import { motion } from "framer-motion";
import { ContactForm } from "@/components/forms/contact-form";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
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
            title="Contact"
            description="Send a secure message that appears in the admin contact manager."
          />
          
          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-coral/10 text-coral">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <span className="font-poppins text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Email</span>
                <p className="font-sans text-sm font-semibold text-navy dark:text-white">contact@example.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-coral/10 text-coral">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <span className="font-poppins text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Phone</span>
                <p className="font-sans text-sm font-semibold text-navy dark:text-white">+1 (234) 567-890</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-coral/10 text-coral">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <span className="font-poppins text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Location</span>
                <p className="font-sans text-sm font-semibold text-navy dark:text-white">San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-zinc-200/60 bg-white p-8 rounded-2xl shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="font-sora text-xl font-bold text-navy dark:text-white mb-6 font-poppins">Send a Message</h2>
          <ContactForm />
        </div>
      </motion.div>
    </main>
  );
}
