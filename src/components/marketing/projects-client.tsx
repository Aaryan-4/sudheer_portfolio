"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, Code, ExternalLink, Github } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/marketing/section-heading";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
}

interface ProjectsClientProps {
  projects: Project[];
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <main className="container py-20 lg:py-28">
      <SectionHeading
        title="Projects"
        description="Selected engineering case studies, products, and technical experiments."
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-8 md:grid-cols-2 mt-8"
      >
        {projects.map((project) => (
          <motion.div key={project.id} variants={itemVariants}>
            <Card className="h-full flex flex-col justify-between border border-zinc-200/60 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-coral/20 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
              <CardHeader className="p-0">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-coral/10 text-coral">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </div>
                  {/* GitHub & Live Links */}
                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-zinc-400 hover:text-navy dark:hover:text-white transition-colors"
                        aria-label="GitHub Repository"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-zinc-400 hover:text-coral transition-colors"
                        aria-label="Live Demo"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>

                <Link href={`/projects/${project.slug}`} className="group block">
                  <CardTitle className="font-poppins text-xl font-bold text-navy dark:text-white group-hover:text-coral transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="mt-3 font-sans text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
                    {project.description}
                  </CardDescription>
                </Link>
              </CardHeader>

              {/* Tech Stack and View Details Link */}
              <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900 flex flex-col gap-4">
                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 bg-zinc-100/80 px-2.5 py-1 rounded-md text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 font-poppins"
                      >
                        <Code className="h-3 w-3 text-coral" />
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  href={`/projects/${project.slug}`}
                  className="group inline-flex items-center text-sm font-bold text-coral font-poppins mt-2 self-start"
                >
                  Explore project details
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {projects.length === 0 ? (
        <div className="py-20 text-center text-zinc-400 dark:text-zinc-600">
          <BriefcaseBusiness className="mx-auto mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-700" />
          <p className="font-poppins">No published projects yet. Projects appear after they are published in the admin.</p>
        </div>
      ) : null}
    </main>
  );
}
