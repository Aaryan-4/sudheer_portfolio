"use client";

import { motion } from "framer-motion";
import { Award, Calendar, ExternalLink } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/marketing/section-heading";

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date | string;
  credentialUrl?: string | null;
}

interface CertificationsClientProps {
  certifications: Certification[];
}

export function CertificationsClient({ certifications }: CertificationsClientProps) {
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const formatDate = (dateInput: Date | string) => {
    try {
      const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
      return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
    } catch {
      return "Issued Date";
    }
  };

  return (
    <main className="container py-20 lg:py-28">
      <SectionHeading
        title="Certifications"
        description="Verified learning milestones, professional credentials, and training credentials."
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 mt-8"
      >
        {certifications.map((cert) => (
          <motion.div key={cert.id} variants={itemVariants}>
            <Card className="h-full border border-zinc-200/60 bg-white p-6 shadow-sm hover:shadow-xl hover:border-coral/20 hover:-translate-y-1 transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950 flex flex-col justify-between">
              <CardHeader className="p-0">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-coral/10 text-coral">
                    <Award className="h-5 w-5" />
                  </div>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-coral hover:underline font-poppins"
                    >
                      Verify <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <CardTitle className="font-poppins text-lg font-bold text-navy dark:text-white mb-2 leading-snug">
                  {cert.name}
                </CardTitle>
                <CardDescription className="font-sans text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                  {cert.issuer}
                </CardDescription>
              </CardHeader>
              
              {/* Bottom metadata */}
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900 flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 font-sans">
                <Calendar className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-700" />
                <span>Issued {formatDate(cert.issueDate)}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {certifications.length === 0 ? (
        <div className="py-20 text-center text-zinc-400 dark:text-zinc-600">
          <Award className="mx-auto mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-700" />
          <p className="font-poppins">No credentials or certifications have been added yet.</p>
        </div>
      ) : null}
    </main>
  );
}
