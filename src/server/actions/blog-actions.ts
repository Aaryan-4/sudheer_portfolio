"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { AppError } from "@/lib/errors/app-error";
import { blogSchema } from "@/features/blogs/blogs.schemas";
import { blogsRepository } from "@/features/blogs/blogs.repository";
import { writeAuditLog } from "@/features/audit-logs/audit.service";

export async function createBlogAction(input: unknown) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    throw new AppError("Admin access required", 403, "FORBIDDEN");
  }

  const blog = await blogsRepository.create(blogSchema.parse(input), session.user.id);
  await writeAuditLog({
    action: "BLOG_CREATED",
    userId: session.user.id,
    entity: "Blog",
    entityId: blog.id,
    message: `Blog created: ${blog.title}`
  });

  revalidatePath("/blogs");
  revalidatePath("/admin/blogs");
  return blog;
}
