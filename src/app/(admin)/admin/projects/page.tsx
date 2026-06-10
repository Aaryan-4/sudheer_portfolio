import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { projectsRepository } from "@/features/projects/projects.repository";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await projectsRepository.listAdmin().catch(() => []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Projects</h1>
      <div className="grid gap-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription>{project.slug}</CardDescription>
          </Card>
        ))}
      </div>
      {projects.length === 0 ? <p className="text-muted-foreground">No projects yet.</p> : null}
    </div>
  );
}
