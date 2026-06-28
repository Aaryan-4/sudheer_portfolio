import { projectsRepository } from "@/features/projects/projects.repository";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminProjectsList } from "@/components/layout/admin-projects-list";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await projectsRepository.listAdmin().catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Projects</h1>
        <Button asChild className="bg-coral text-white hover:bg-coral/90 rounded-full font-poppins">
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Link>
        </Button>
      </div>
      <AdminProjectsList initialProjects={projects} />
    </div>
  );
}
