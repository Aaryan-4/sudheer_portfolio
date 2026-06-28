import { resumeRepository } from "@/features/resume/resume.repository";
import { ResumeUploadForm } from "@/components/forms/resume-upload-form";
import { AdminResumesList } from "@/components/layout/admin-resumes-list";

export const dynamic = "force-dynamic";

export default async function AdminResumePage() {
  const resumes = await resumeRepository.list().catch(() => []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Resume</h1>
      
      <ResumeUploadForm />
      
      <AdminResumesList initialResumes={resumes} />
    </div>
  );
}
