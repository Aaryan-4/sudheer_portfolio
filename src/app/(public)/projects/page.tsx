import { projectsRepository } from "@/features/projects/projects.repository";
import { ProjectsClient } from "@/components/marketing/projects-client";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await projectsRepository.listPublic().catch(() => []);

  return <ProjectsClient projects={projects} />;
}
