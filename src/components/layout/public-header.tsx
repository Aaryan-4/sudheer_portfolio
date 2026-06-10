import Link from "next/link";
import { CalendarDays, Github } from "lucide-react";
import { publicNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="font-semibold">
          {siteConfig.name}
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex">
          {publicNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" aria-label="GitHub">
            <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild size="sm">
            <Link href="/book-meeting">
              <CalendarDays className="mr-2 h-4 w-4" />
              Book
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
