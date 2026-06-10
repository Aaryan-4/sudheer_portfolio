import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type MetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
};

export function buildMetadata(input: MetadataInput = {}): Metadata {
  const title = input.title ? `${input.title} | ${siteConfig.name}` : siteConfig.title;
  const description = input.description ?? siteConfig.description;
  const url = `${siteConfig.url}${input.path ?? ""}`;

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: input.image ? [{ url: input.image }] : undefined,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: input.image ? [input.image] : undefined
    }
  };
}
