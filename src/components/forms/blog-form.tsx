"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function BlogForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const tagsRaw = String(formData.get("tags") ?? "");
    const tags = tagsRaw
      ? tagsRaw.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [];

    const blogData = {
      title: String(formData.get("title")),
      slug: String(formData.get("slug")),
      excerpt: String(formData.get("excerpt")),
      content: String(formData.get("content")),
      featuredImage: String(formData.get("featuredImage") || ""),
      status: String(formData.get("status") || "DRAFT"),
      tags,
      seoTitle: String(formData.get("seoTitle") || ""),
      seoDescription: String(formData.get("seoDescription") || ""),
      seoKeywords: String(formData.get("seoKeywords") || "")
        ? String(formData.get("seoKeywords")).split(",").map((k) => k.trim()).filter(Boolean)
        : []
    };

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        body: JSON.stringify(blogData),
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        const resData = await response.json().catch(() => ({}));
        throw new Error(resData.error?.message || "Failed to create blog post.");
      }

      router.push("/admin/blogs");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl bg-white p-8 border border-zinc-200/60 rounded-2xl shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-lg font-medium">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Blog Title</label>
          <Input name="title" placeholder="e.g. Getting Started with Next.js" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Slug</label>
          <Input name="slug" placeholder="e.g. getting-started-nextjs" required />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Excerpt / Short Description</label>
        <Textarea name="excerpt" placeholder="A short 1-2 sentence description of the post..." required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Tags (comma-separated)</label>
        <Input name="tags" placeholder="e.g. Nextjs, React, Web Development" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Featured Image URL</label>
          <Input name="featuredImage" type="url" placeholder="https://res.cloudinary.com/..." />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 block">Status</label>
          <select name="status" className="h-10 w-full rounded-md border border-zinc-200 bg-background px-3 text-sm outline-none dark:border-zinc-800" defaultValue="PUBLISHED">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Blog Content (Markdown supported)</label>
        <Textarea name="content" className="min-h-40" placeholder="Write the main blog body content here..." required />
      </div>

      <Button type="submit" disabled={loading} className="bg-coral text-white hover:bg-coral/90 rounded-full px-6 py-2 transition-all font-poppins">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Create Blog Post
          </>
        )}
      </Button>
    </form>
  );
}
