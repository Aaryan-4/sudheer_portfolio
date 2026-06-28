"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ProjectForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const techStackRaw = String(formData.get("techStack") ?? "");
    const techStack = techStackRaw
      ? techStackRaw.split(",").map((tech) => tech.trim()).filter(Boolean)
      : [];

    const projectData = {
      title: String(formData.get("title")),
      slug: String(formData.get("slug")),
      description: String(formData.get("description")),
      content: String(formData.get("content") || ""),
      techStack,
      githubUrl: String(formData.get("githubUrl") || ""),
      liveUrl: String(formData.get("liveUrl") || ""),
      featured: formData.get("featured") === "true",
      isPublished: formData.get("isPublished") === "true",
      seoTitle: String(formData.get("seoTitle") || ""),
      seoDescription: String(formData.get("seoDescription") || ""),
      seoKeywords: String(formData.get("seoKeywords") || "")
        ? String(formData.get("seoKeywords")).split(",").map((k) => k.trim()).filter(Boolean)
        : []
    };

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify(projectData),
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        const resData = await response.json().catch(() => ({}));
        throw new Error(resData.error?.message || "Failed to create project.");
      }

      router.push("/admin/projects");
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
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Project Title</label>
          <Input name="title" placeholder="e.g. Sudheer Portfolio Platform" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Slug</label>
          <Input name="slug" placeholder="e.g. portfolio-platform" required />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Brief Description</label>
        <Textarea name="description" placeholder="A brief summary of the project..." required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Tech Stack (comma-separated)</label>
        <Input name="techStack" placeholder="e.g. Next.js, React, Tailwind, Prisma, PostgreSQL" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">GitHub Repository URL</label>
          <Input name="githubUrl" type="url" placeholder="https://github.com/..." />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Live Website URL</label>
          <Input name="liveUrl" type="url" placeholder="https://..." />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 block">Featured Project</label>
          <select name="featured" className="h-10 w-full rounded-md border border-zinc-200 bg-background px-3 text-sm outline-none dark:border-zinc-800" defaultValue="false">
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 block">Published Status</label>
          <select name="isPublished" className="h-10 w-full rounded-md border border-zinc-200 bg-background px-3 text-sm outline-none dark:border-zinc-800" defaultValue="true">
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Project Details (Markdown/Content)</label>
        <Textarea name="content" className="min-h-40" placeholder="Extended details of the project case-study..." />
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
            Add Project
          </>
        )}
      </Button>
    </form>
  );
}
