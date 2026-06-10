import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CalendarDays, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { projectsRepository } from "@/features/projects/projects.repository";
import type { LucideIcon } from "lucide-react";

const featureCards: Array<{ title: string; description: string; Icon: LucideIcon }> = [
  { title: "Projects", description: "Production-grade case studies and technical work.", Icon: BriefcaseBusiness },
  { title: "Resume", description: "Versioned resume downloads and professional profile.", Icon: FileText },
  { title: "Meetings", description: "Approval workflow with Google Calendar readiness.", Icon: CalendarDays }
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await projectsRepository.listPublic().catch(() => []);

  return (
    <main>
      <section className="border-b">
        <div className="container grid min-h-[calc(100vh-4rem)] items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 text-sm font-medium uppercase text-primary">Full-stack portfolio platform</p>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-normal sm:text-6xl">
              Sudheer Kumar builds reliable software, useful products, and measurable digital systems.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Explore projects, writing, certifications, resume details, and book a professional meeting through a secure workflow-backed platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/projects">
                  View projects <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/book-meeting">Book a meeting</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            {featureCards.map(({ title, description, Icon }) => (
              <Card key={title}>
                <CardHeader>
                  <Icon className="mb-2 h-5 w-5 text-primary" />
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="container py-16">
        <h2 className="mb-6 text-2xl font-semibold">Featured projects</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {projects.slice(0, 3).map((project) => (
            <Card key={project.id}>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription className="mt-2">{project.description}</CardDescription>
            </Card>
          ))}
          {projects.length === 0 ? <p className="text-muted-foreground">Projects will appear after the admin adds them.</p> : null}
        </div>
      </section>
    </main>
  );
}
