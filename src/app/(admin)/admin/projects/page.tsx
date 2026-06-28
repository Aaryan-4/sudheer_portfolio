import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { projectsRepository } from "@/features/projects/projects.repository";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await projectsRepository.listAdmin().catch(() => []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Projects</h1>
        <Button asChild className="bg-coral text-white hover:bg-coral/90 rounded-full font-poppins">
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Link>
        </Button>
      </div>
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
