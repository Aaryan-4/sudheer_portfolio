"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

interface Blog {
  id: string;
  title: string;
  slug: string;
  status: string;
}

interface AdminBlogsListProps {
  initialBlogs: Blog[];
}

export function AdminBlogsList({ initialBlogs }: AdminBlogsListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog post");
      }

      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting blog post");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="grid gap-4">
      {initialBlogs.map((blog) => (
        <Card key={blog.id} className="flex items-center justify-between p-6 border border-zinc-200 bg-white hover:shadow-md transition-all dark:border-zinc-800 dark:bg-zinc-950">
          <div>
            <CardTitle className="font-poppins text-lg font-bold text-navy dark:text-white">
              {blog.title}
            </CardTitle>
            <CardDescription className="mt-1 font-sans text-sm text-zinc-500">
              /{blog.slug} · <span className="font-semibold text-coral">{blog.status}</span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="text-zinc-500 hover:text-zinc-700"
              onClick={() => window.open(`/blogs/${blog.slug}`, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={deletingId === blog.id}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => handleDelete(blog.id)}
            >
              {deletingId === blog.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </Card>
      ))}
      {initialBlogs.length === 0 && (
        <p className="text-zinc-500 dark:text-zinc-400 font-poppins">No blogs created yet.</p>
      )}
    </div>
  );
}
