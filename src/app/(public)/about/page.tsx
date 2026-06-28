"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Award, Code2, Cpu } from "lucide-react";

const pillars = [
  {
    title: "Engineering Discipline",
    description: "Emphasis on clean code, secure systems, automated test coverage, and strict performance metrics.",
    Icon: Code2
  },
  {
    title: "Product-Oriented Mindset",
    description: "Aligning software architecture to target audience user journeys, converting ideas into functional systems.",
    Icon: Cpu
  },
  {
    title: "Operational Excellence",
    description: "Continuous integration, automated analytics tracking, versioned artifacts, and responsive uptime.",
    Icon: Award
  }
];

export default function AboutPage() {
  return (
    <main className="container py-20 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeading
          title="About Sudheer"
          description="A focused profile for engineering, product thinking, and delivery discipline."
        />

        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start mt-8">
          {/* Detailed Paragraph Text */}
          <div className="space-y-6 text-zinc-600 dark:text-zinc-300 font-sans text-base leading-relaxed">
            <p>
              Sudheer Kumar is a full-stack software professional specializing in designing, building, and deploying
              high-performance web applications. This platform acts as a showcase for reliable delivery, secure workflows,
              and modern user interfaces.
            </p>
            <p>
              By combining robust database configurations, strict server-side logic, and interactive user interfaces, Sudheer
              aims to build web applications that deliver measurable value.
            </p>
            <p>
              Beyond traditional portfolios, this system integrates features like real-time contact management, meeting scheduling,
              and visitor analytics to behave like a true personal operating platform.
            </p>
          </div>

          {/* Pillars Cards */}
          <div className="grid gap-6">
            {pillars.map(({ title, description, Icon }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border border-zinc-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950 flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-coral/10 text-coral">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="font-poppins text-base font-bold text-navy dark:text-white mb-2">
                      {title}
                    </CardTitle>
                    <CardDescription className="font-sans text-sm text-zinc-500 dark:text-zinc-400">
                      {description}
                    </CardDescription>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </main>
  );
}
