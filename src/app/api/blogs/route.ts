import { type NextRequest } from "next/server";
import { fail, ok } from "@/lib/errors/api-response";
import { AppError } from "@/lib/errors/app-error";
import { auth } from "@/lib/auth";
import { blogsRepository } from "@/features/blogs/blogs.repository";
import { blogSchema } from "@/features/blogs/blogs.schemas";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      throw new AppError("Admin access required", 403, "FORBIDDEN");
    }

    const body = await request.json();
    const data = blogSchema.parse(body);

    const blog = await blogsRepository.create(data, session.user.id);

    return ok({ id: blog.id, slug: blog.slug }, 201);
  } catch (error) {
    return fail(error);
  }
}
