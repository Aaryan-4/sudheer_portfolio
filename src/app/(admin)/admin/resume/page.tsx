import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { resumeRepository } from "@/features/resume/resume.repository";

export const dynamic = "force-dynamic";

export default async function AdminResumePage() {
  const resumes = await resumeRepository.list().catch(() => []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Resume</h1>
      <div className="grid gap-3">
        {resumes.map((resume) => (
          <Card key={resume.id}>
            <CardTitle>Version {resume.version}</CardTitle>
            <CardDescription>{resume.status}</CardDescription>
          </Card>
        ))}
      </div>
      {resumes.length === 0 ? <p className="text-muted-foreground">No resume uploads yet.</p> : null}
    </div>
  );
}
