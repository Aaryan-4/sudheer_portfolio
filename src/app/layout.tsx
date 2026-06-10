import type { Metadata } from "next";
import "./globals.css";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
