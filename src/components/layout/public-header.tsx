"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CalendarDays, Menu, X } from "lucide-react";
import { publicNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/70 backdrop-blur-md transition-all duration-300 dark:border-zinc-800/50 dark:bg-zinc-950/70">
      <div className="container flex h-20 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-coral text-white transition-transform group-hover:scale-105 shadow-md shadow-coral/25">
            <span className="font-sora text-lg font-bold">S</span>
          </div>
          <span className="font-sora text-xl font-bold tracking-tight text-navy dark:text-white transition-colors group-hover:text-coral">
            {siteConfig.name.split(" ")[0].toUpperCase()}
          </span>
        </Link>

        {/* Desktop Centered Nav Links */}
        <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
          {publicNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-1 font-poppins transition-colors hover:text-coral ${
                  isActive ? "text-coral font-semibold" : "text-zinc-600 dark:text-zinc-300"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-coral rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA and Hamburger */}
        <div className="flex items-center gap-3">
          <Button asChild className="hidden sm:inline-flex bg-coral text-white hover:bg-coral/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 rounded-full px-6 shadow-sm shadow-coral/10 font-poppins">
            <Link href="/book-meeting">
              <CalendarDays className="mr-2 h-4 w-4" />
              Book Meeting
            </Link>
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 lg:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="border-t border-zinc-200/50 bg-white/95 py-6 dark:border-zinc-800/50 dark:bg-zinc-950/95 lg:hidden animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="container flex flex-col gap-4">
            {publicNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 text-base font-medium font-poppins transition-colors hover:text-coral ${
                    isActive ? "text-coral font-bold" : "text-zinc-600 dark:text-zinc-300"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button asChild className="mt-2 w-full bg-coral text-white hover:bg-coral/90 rounded-full font-poppins">
              <Link href="/book-meeting" onClick={() => setIsOpen(false)}>
                <CalendarDays className="mr-2 h-4 w-4" />
                Book Meeting
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
