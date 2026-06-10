"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { AppError } from "@/lib/errors/app-error";
import { projectSchema } from "@/features/projects/projects.schemas";
import { projectsRepository } from "@/features/projects/projects.repository";
import { writeAuditLog } from "@/features/audit-logs/audit.service";

export async function createProjectAction(input: unknown) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    throw new AppError("Admin access required", 403, "FORBIDDEN");
  }

  const project = await projectsRepository.create(projectSchema.parse(input), session.user.id);
  await writeAuditLog({
    action: "PROJECT_CREATED",
    userId: session.user.id,
    entity: "Project",
    entityId: project.id,
    message: `Project created: ${project.title}`
  });

  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  return project;
}
