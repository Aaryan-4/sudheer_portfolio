import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/marketing/section-heading";
import { resumeRepository } from "@/features/resume/resume.repository";

export const dynamic = "force-dynamic";

export default async function ResumePage() {
  const resume = await resumeRepository.active().catch(() => null);

  return (
    <main className="container py-20 lg:py-28">
      <SectionHeading
        title="Resume"
        description="Download the active resume version managed through the admin dashboard."
      />
      <div className="max-w-xl border border-zinc-200/60 bg-white p-8 rounded-2xl shadow-sm dark:border-zinc-800 dark:bg-zinc-950 mt-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-coral/10 text-coral">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-sora text-lg font-bold text-navy dark:text-white">Active Version</h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-sans">
              Frequently updated with latest achievements and milestones.
            </p>
          </div>
        </div>
        {resume ? (
          <Button asChild className="bg-coral text-white hover:bg-coral/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 rounded-full px-8 py-6 shadow-md shadow-coral/10 font-poppins w-full sm:w-auto">
            <a href={resume.fileUrl} download>
              <Download className="mr-2 h-4 w-4" />
              Download Resume
            </a>
          </Button>
        ) : (
          <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400">
            Resume is currently being updated by the administrator. Please check back later.
          </p>
        )}
      </div>
    </main>
  );
}
