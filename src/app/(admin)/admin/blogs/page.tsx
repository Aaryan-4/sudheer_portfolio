import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { blogsRepository } from "@/features/blogs/blogs.repository";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  const blogs = await blogsRepository.listAdmin().catch(() => []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Blogs</h1>
      <div className="grid gap-3">
        {blogs.map((blog) => (
          <Card key={blog.id}>
            <CardTitle>{blog.title}</CardTitle>
            <CardDescription>{blog.status}</CardDescription>
          </Card>
        ))}
      </div>
      {blogs.length === 0 ? <p className="text-muted-foreground">No blogs yet.</p> : null}
    </div>
  );
}
