"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Briefcase } from "lucide-react";

const experiences = [
  {
    role: "Full-Stack Software Engineering",
    company: "Portfolio Operating Systems",
    period: "2024 - Present",
    desc: "Building highly interactive web applications with clean architecture. Implementing secure authentication flows, complex database migrations using Prisma, and robust REST/GraphQL endpoints. Designing responsive, visually modern user interfaces with custom HSL theme configuration and responsive break points.",
    bullets: [
      "Designed and integrated a secure automated contact response system.",
      "Developed a custom calendar scheduling workflow that integrates Google Calendar availability.",
      "Configured robust analytics to track platform-level unique visitors and downloads."
    ]
  },
  {
    role: "Product-Oriented Delivery",
    company: "Digital Systems Platform",
    period: "2022 - 2024",
    desc: "Collaborated on translating user requirements into actionable software solutions. Focused on visual elegance, user flow micro-interactions, responsive frameworks, and web page rendering speed optimizations.",
    bullets: [
      "Optimized React bundle sizes and rendering cycles to boost Lighthouse scores.",
      "Introduced strict accessibility rules, standardizing ARIA labels and keyboard navigation.",
      "Managed CI/CD deployment pipelines on Vercel ensuring near 100% build reliability."
    ]
  }
];

export default function ExperiencePage() {
  return (
    <main className="container py-20 lg:py-28">
      <SectionHeading
        title="Experience"
        description="A timeline of professional background, roles, and technical achievements."
      />

      <div className="relative max-w-4xl mt-12 pl-6 sm:pl-8 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-200/80 dark:before:bg-zinc-800/80">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.role}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="relative pb-12 last:pb-0"
          >
            {/* Timeline Dot Icon */}
            <div className="absolute -left-12 sm:-left-[3.25rem] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-coral text-coral dark:bg-zinc-950 shadow-md">
              <Briefcase className="h-4 w-4" />
            </div>

            {/* Experience Card */}
            <div className="border border-zinc-200/60 bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <div>
                  <h2 className="font-sora text-xl font-bold text-navy dark:text-white">
                    {exp.role}
                  </h2>
                  <span className="font-poppins text-sm font-semibold text-coral mt-1 block">
                    {exp.company}
                  </span>
                </div>
                <span className="self-start sm:self-center bg-zinc-100 text-zinc-600 font-poppins text-xs font-semibold px-3 py-1.5 rounded-full dark:bg-zinc-800 dark:text-zinc-300">
                  {exp.period}
                </span>
              </div>
              <p className="font-sans text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 mb-6">
                {exp.desc}
              </p>
              <ul className="space-y-3 pl-5 list-disc text-sm text-zinc-600 dark:text-zinc-300 font-sans">
                {exp.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="leading-relaxed">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
