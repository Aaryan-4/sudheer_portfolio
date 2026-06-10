import { prisma } from "@/lib/db/prisma";
import type { BlogInput } from "./blogs.schemas";
import { toSlug } from "@/lib/utils/slug";

export const blogsRepository = {
  listPublic() {
    return prisma.blog.findMany({
      where: { status: "PUBLISHED" },
      include: { tags: true },
      orderBy: { publishedAt: "desc" }
    });
  },
  listAdmin() {
    return prisma.blog.findMany({
      include: { tags: true, author: true },
      orderBy: { createdAt: "desc" }
    });
  },
  findBySlug(slug: string) {
    return prisma.blog.findUnique({
      where: { slug },
      include: { tags: true, author: true }
    });
  },
  async create(data: BlogInput, authorId?: string) {
    return prisma.blog.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        featuredImage: data.featuredImage || null,
        status: data.status,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords,
        authorId,
        tags: {
          create: data.tags.map((name) => ({
            name,
            slug: toSlug(name)
          }))
        }
      }
    });
  }
};
