import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/marketing/section-heading";
import { projectsRepository } from "@/features/projects/projects.repository";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await projectsRepository.listPublic().catch(() => []);

  return (
    <main className="container py-14">
      <SectionHeading title="Projects" description="Selected work with technical detail, links, images, and measurable context." />
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.slug}`}>
            <Card className="h-full transition hover:border-primary">
              <CardTitle>{project.title}</CardTitle>
              <CardDescription className="mt-2">{project.description}</CardDescription>
            </Card>
          </Link>
        ))}
      </div>
      {projects.length === 0 ? <p className="text-muted-foreground">No published projects yet.</p> : null}
    </main>
  );
}
