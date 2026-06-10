import { notFound } from "next/navigation";
import { blogsRepository } from "@/features/blogs/blogs.repository";

export default async function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await blogsRepository.findBySlug(slug).catch(() => null);

  if (!blog || blog.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <main className="container py-14">
      <p className="text-sm text-primary">Blog</p>
      <h1 className="mt-2 text-4xl font-semibold">{blog.title}</h1>
      <p className="mt-4 max-w-3xl text-muted-foreground">{blog.excerpt}</p>
      <article className="mt-8 max-w-3xl whitespace-pre-wrap leading-7">{blog.content}</article>
    </main>
  );
}
