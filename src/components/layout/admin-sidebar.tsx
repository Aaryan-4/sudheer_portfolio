import Link from "next/link";
import { adminNavigation } from "@/config/navigation";

export function AdminSidebar() {
  return (
    <aside className="hidden w-64 border-r bg-muted/30 p-4 md:block">
      <div className="mb-6 font-semibold">Admin</div>
      <nav className="grid gap-1">
        {adminNavigation.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm hover:bg-muted">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
