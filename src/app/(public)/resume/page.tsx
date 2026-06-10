import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/marketing/section-heading";
import { resumeRepository } from "@/features/resume/resume.repository";

export const dynamic = "force-dynamic";

export default async function ResumePage() {
  const resume = await resumeRepository.active().catch(() => null);

  return (
    <main className="container py-14">
      <SectionHeading title="Resume" description="Download the active resume version managed through the admin dashboard." />
      {resume ? (
        <Button asChild>
          <a href={resume.fileUrl} download>
            <Download className="mr-2 h-4 w-4" />
            Download resume
          </a>
        </Button>
      ) : (
        <p className="text-muted-foreground">Resume will be available after upload.</p>
      )}
    </main>
  );
}
