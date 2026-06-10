import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(2).max(160),
  slug: z.string().min(2).max(180),
  description: z.string().min(10),
  content: z.string().optional(),
  techStack: z.array(z.string().min(1)).default([]),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).default([])
});

export type ProjectInput = z.infer<typeof projectSchema>;
