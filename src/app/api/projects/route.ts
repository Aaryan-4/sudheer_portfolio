import { type NextRequest } from "next/server";
import { fail, ok } from "@/lib/errors/api-response";
import { AppError } from "@/lib/errors/app-error";
import { auth } from "@/lib/auth";
import { projectsRepository } from "@/features/projects/projects.repository";
import { projectSchema } from "@/features/projects/projects.schemas";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      throw new AppError("Admin access required", 403, "FORBIDDEN");
    }

    const body = await request.json();
    const data = projectSchema.parse(body);

    const project = await projectsRepository.create(data, session.user.id);

    return ok({ id: project.id, slug: project.slug }, 201);
  } catch (error) {
    return fail(error);
  }
}
