"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, CalendarDays, FileText } from "lucide-react";
import { AuroraBackground } from "@/components/ui/starfall-portfolio-landing";
import type { LucideIcon } from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
}

interface HomeClientProps {
  initialProjects: Project[];
}

const featureCards: Array<{ title: string; description: string; Icon: LucideIcon; href: string }> = [
  { title: "Featured Projects", description: "Explore production-grade case studies and technical work.", Icon: BriefcaseBusiness, href: "/projects" },
  { title: "Professional Resume", description: "Download versioned resume files and review profile details.", Icon: FileText, href: "/resume" },
  { title: "Book a Session", description: "Secure, approval-backed calendar booking workflow.", Icon: CalendarDays, href: "/book-meeting" }
];

export function HomeClient({ initialProjects }: HomeClientProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <main className="overflow-hidden bg-transparent relative min-h-screen">
      {/* WebGL Aurora background */}
      <AuroraBackground />

      <div className="relative z-10 bg-transparent">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-transparent">
          <div className="container grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Hero Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col justify-center"
            >
              <span className="mb-4 inline-block font-poppins text-sm font-bold tracking-widest text-coral uppercase">
                GET EVERY SINGLE SOLUTIONS.
              </span>
              <h1 className="font-sora text-4xl font-extrabold tracking-tight text-navy dark:text-white sm:text-6xl lg:leading-tight">
                I&apos;m Developer &amp; Designer <br />
                <span className="gradient-text font-black">Sudheer Kumar</span>
              </h1>
              <p className="mt-6 max-w-lg font-sans text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                Reliable software architecture, user-focused workflows, and clean delivery discipline combined in a modern dashboard-backed platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button className="primary-button px-8 py-4 text-white rounded-full font-poppins font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-coral/10">
                  <Link href="/projects" className="flex items-center gap-2">
                    View projects <ArrowRight className="h-4 w-4" />
                  </Link>
                </button>
                <button className="glass-button px-8 py-4 text-navy dark:text-white rounded-full font-poppins font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                  <Link href="/book-meeting">Book a meeting</Link>
                </button>
              </div>
            </motion.div>

            {/* Hero Right Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative flex justify-center lg:justify-end float-animation"
            >
              {/* Decorative background elements and rings */}
              <div className="absolute right-1/2 top-1/2 h-[350px] w-[350px] -translate-y-1/2 translate-x-1/2 rounded-full border border-coral/10 dark:border-coral/5" />
              <div className="absolute right-1/2 top-1/2 h-[420px] w-[420px] -translate-y-1/2 translate-x-1/2 rounded-full border border-navy/5 dark:border-navy/2" />
              
              <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-white bg-white shadow-2xl shadow-navy/10 dark:border-zinc-800 dark:bg-zinc-950 w-[280px] h-[373px] sm:w-[320px] sm:h-[427px] lg:w-[380px] lg:h-[507px] transition-transform duration-300">
                <Image
                  src="/profile.jpg"
                  alt="Sudheer Kumar"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 320px, 380px"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="container py-24 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-6 md:grid-cols-3"
          >
            {featureCards.map(({ title, description, Icon, href }) => (
              <motion.div key={title} variants={itemVariants}>
                <Link href={href} className="group block h-full">
                  <div className="glass-card h-full rounded-2xl p-8 transition-all duration-300">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-coral/10 text-coral transition-colors group-hover:bg-coral group-hover:text-white shadow-inner">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-poppins text-xl font-bold text-navy dark:text-white transition-colors group-hover:text-coral">
                      {title}
                    </h3>
                    <p className="mt-3 font-sans text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Featured Projects Section */}
        <section className="border-t border-zinc-200/20 bg-transparent py-24">
          <div className="container">
            <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between">
              <div>
                <span className="font-poppins text-xs font-bold tracking-widest text-coral uppercase">Portfolio showcase</span>
                <h2 className="mt-2 font-sora text-3xl font-extrabold text-navy dark:text-white sm:text-4xl">Featured projects</h2>
              </div>
              <Link href="/projects" className="mt-4 inline-flex items-center text-sm font-semibold text-coral hover:underline md:mt-0 font-poppins">
                All projects <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-8 md:grid-cols-3"
            >
              {initialProjects.slice(0, 3).map((project) => (
                <motion.div key={project.id} variants={itemVariants}>
                  <Link href={`/projects/${project.slug}`} className="group block h-full">
                    <div className="glass-card h-full flex flex-col justify-between rounded-2xl p-6 transition-all duration-300">
                      <div>
                        <h3 className="font-poppins text-lg font-bold text-navy dark:text-white transition-colors group-hover:text-coral">
                          {project.title}
                        </h3>
                        <p className="mt-3 font-sans text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3">
                          {project.description}
                        </p>
                      </div>
                      <div className="mt-6 flex items-center text-xs font-bold text-coral group-hover:translate-x-1 transition-transform duration-200 font-poppins">
                        View details <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
              {initialProjects.length === 0 ? (
                <div className="col-span-full py-12 text-center text-zinc-400 dark:text-zinc-600">
                  <BriefcaseBusiness className="mx-auto mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-700" />
                  <p className="font-poppins">Projects will appear after they are published in the admin dashboard.</p>
                </div>
              ) : null}
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}
