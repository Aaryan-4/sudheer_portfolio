import { blogsRepository } from "@/features/blogs/blogs.repository";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminBlogsList } from "@/components/layout/admin-blogs-list";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  const blogs = await blogsRepository.listAdmin().catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Blogs</h1>
        <Button asChild className="bg-coral text-white hover:bg-coral/90 rounded-full font-poppins">
          <Link href="/admin/blogs/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Blog
          </Link>
        </Button>
      </div>
      <AdminBlogsList initialBlogs={blogs} />
    </div>
  );
}
