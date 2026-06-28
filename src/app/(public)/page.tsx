import { projectsRepository } from "@/features/projects/projects.repository";
import { HomeClient } from "@/components/marketing/home-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await projectsRepository.listPublic().catch(() => []);

  return <HomeClient initialProjects={projects} />;
}
