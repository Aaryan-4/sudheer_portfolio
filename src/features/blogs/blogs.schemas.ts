import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(2).max(180),
  slug: z.string().min(2).max(180),
  content: z.string().min(20),
  excerpt: z.string().min(10).max(300),
  featuredImage: z.string().url().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  tags: z.array(z.string().min(1)).default([]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).default([])
});

export type BlogInput = z.infer<typeof blogSchema>;
