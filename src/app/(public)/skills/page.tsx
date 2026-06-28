"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const skills = [
  { name: "Next.js", category: "Frontend Framework", desc: "Building fast, SEO-optimized React web applications with Server Actions." },
  { name: "React", category: "UI Development", desc: "Designing complex interactive states and components using modern React patterns." },
  { name: "TypeScript", category: "Programming Language", desc: "Developing reliable codebases using static typing and robust compile-time safety." },
  { name: "PostgreSQL", category: "Relational Database", desc: "Configuring relational databases, indexing, and optimizing queries for scale." },
  { name: "Prisma", category: "Database ORM", desc: "Managing schemas, writing migrations, and interacting with type-safe query interfaces." },
  { name: "Security", category: "Authentication", desc: "Implementing NextAuth.json guards, password hashing, and endpoint authorization." },
  { name: "DevOps", category: "CI/CD & Deployment", desc: "Automating builds, managing container environments, and target Vercel hosting." },
  { name: "Product Design", category: "UX/UI Design", desc: "Creating visually premium styles, custom wave vectors, and responsive layouts." }
];

export default function SkillsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <main className="container py-20 lg:py-28">
      <SectionHeading
        title="Skills"
        description="Technical capabilities grouped around modern, reliable product engineering."
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8"
      >
        {skills.map((skill) => (
          <motion.div key={skill.name} variants={itemVariants}>
            <Card className="h-full border border-zinc-200/60 bg-white p-6 shadow-sm hover:shadow-xl hover:border-coral/20 hover:-translate-y-1 transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950 flex flex-col justify-between">
              <CardHeader className="p-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-coral shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <span className="font-poppins text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    {skill.category}
                  </span>
                </div>
                <CardTitle className="font-poppins text-lg font-bold text-navy dark:text-white mb-2">
                  {skill.name}
                </CardTitle>
                <CardDescription className="font-sans text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {skill.desc}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
