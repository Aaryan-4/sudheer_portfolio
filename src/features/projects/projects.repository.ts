import { prisma } from "@/lib/db/prisma";
import type { ProjectInput } from "./projects.schemas";

export const projectsRepository = {
  listPublic() {
    return prisma.project.findMany({
      where: { isPublished: true },
      include: { images: { orderBy: { sortOrder: "asc" } } },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
    });
  },
  listAdmin() {
    return prisma.project.findMany({
      include: { images: true },
      orderBy: { createdAt: "desc" }
    });
  },
  findBySlug(slug: string) {
    return prisma.project.findUnique({
      where: { slug },
      include: { images: { orderBy: { sortOrder: "asc" } } }
    });
  },
  create(data: ProjectInput, userId?: string) {
    return prisma.project.create({
      data: {
        ...data,
        githubUrl: data.githubUrl || null,
        liveUrl: data.liveUrl || null,
        createdById: userId
      }
    });
  }
};
