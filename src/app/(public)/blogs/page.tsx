import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/marketing/section-heading";
import { blogsRepository } from "@/features/blogs/blogs.repository";

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  const blogs = await blogsRepository.listPublic().catch(() => []);

  return (
    <main className="container py-14">
      <SectionHeading title="Blogs" description="Markdown-ready writing with tags, SEO metadata, and publication workflow." />
      <div className="grid gap-4 md:grid-cols-2">
        {blogs.map((blog) => (
          <Link key={blog.id} href={`/blogs/${blog.slug}`}>
            <Card className="h-full transition hover:border-primary">
              <CardTitle>{blog.title}</CardTitle>
              <CardDescription className="mt-2">{blog.excerpt}</CardDescription>
            </Card>
          </Link>
        ))}
      </div>
      {blogs.length === 0 ? <p className="text-muted-foreground">No published blogs yet.</p> : null}
    </main>
  );
}
