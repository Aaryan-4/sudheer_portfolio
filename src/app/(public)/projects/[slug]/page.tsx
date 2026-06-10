import { notFound } from "next/navigation";
import { projectsRepository } from "@/features/projects/projects.repository";

export default async function ProjectDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await projectsRepository.findBySlug(slug).catch(() => null);

  if (!project || !project.isPublished) {
    notFound();
  }

  return (
    <main className="container py-14">
      <p className="text-sm text-primary">Project</p>
      <h1 className="mt-2 text-4xl font-semibold">{project.title}</h1>
      <p className="mt-4 max-w-3xl text-muted-foreground">{project.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span key={tech} className="rounded-md bg-muted px-3 py-1 text-sm">
            {tech}
          </span>
        ))}
      </div>
      {project.content ? <article className="prose mt-8 max-w-3xl dark:prose-invert">{project.content}</article> : null}
    </main>
  );
}
