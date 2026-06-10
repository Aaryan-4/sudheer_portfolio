import { type NextRequest, NextResponse } from "next/server";
import { blogsRepository } from "@/features/blogs/blogs.repository";
import { projectsRepository } from "@/features/projects/projects.repository";

function answerFromPortfolio(question: string, context: { projects: string[]; blogs: string[] }): string {
  const normalized = question.toLowerCase();

  if (normalized.includes("project")) {
    return context.projects.length > 0
      ? `Sudheer's published projects include: ${context.projects.join(", ")}. Open the Projects page for details and links.`
      : "Project details are managed in the admin dashboard and will appear publicly after publishing.";
  }

  if (normalized.includes("blog") || normalized.includes("write")) {
    return context.blogs.length > 0
      ? `Published writing includes: ${context.blogs.join(", ")}.`
      : "Published blogs will appear after the admin creates and publishes posts.";
  }

  if (normalized.includes("meeting") || normalized.includes("call")) {
    return "You can request a meeting from the Book a meeting page. The system supports approval workflow, duration selection, and calendar integration.";
  }

  if (normalized.includes("skill")) {
    return "Sudheer's core skills include Next.js, React, TypeScript, PostgreSQL, Prisma, secure backend workflows, DevOps, and product-focused UI engineering.";
  }

  return "I can answer questions about Sudheer's projects, skills, writing, resume, and meeting availability.";
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const question = String(body.question ?? "").trim();
  const [projects, blogs] = await Promise.all([
    projectsRepository.listPublic().catch(() => []),
    blogsRepository.listPublic().catch(() => [])
  ]);

  return NextResponse.json({
    data: {
      answer: answerFromPortfolio(question, {
        projects: projects.map((project) => project.title),
        blogs: blogs.map((blog) => blog.title)
      })
    }
  });
}
