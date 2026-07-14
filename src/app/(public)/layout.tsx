import { PublicHeader } from "@/components/layout/public-header";
import { siteConfig } from "@/config/site";
import { Github, Linkedin } from "lucide-react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <PublicHeader />
      <div className="flex-1">{children}</div>
      <footer className="border-t border-zinc-200/50 bg-zinc-50/40 py-12 dark:border-zinc-900 dark:bg-zinc-900/10 font-poppins">
        <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="font-sora text-base font-bold text-navy dark:text-white">
              {siteConfig.name.toUpperCase()}
            </span>
            <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 md:text-left">
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="text-zinc-500 hover:text-coral transition-colors dark:text-zinc-400"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-zinc-500 hover:text-coral transition-colors dark:text-zinc-400"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
