import { prisma } from "@/lib/db/prisma";
import { AdminAvailabilityPanel } from "@/components/layout/admin-availability-panel";
import { AdminHourlyBlockoutPanel } from "@/components/layout/admin-hourly-blockout-panel";

export const dynamic = "force-dynamic";

export default async function AdminAvailabilityPage() {
  const availability = await prisma.availability
    .findMany({ orderBy: { dayOfWeek: "asc" } })
    .catch(() => []);

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-navy dark:text-white font-poppins">Weekly Working Days</h1>
        <AdminAvailabilityPanel initialSlots={availability} />
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
        <AdminHourlyBlockoutPanel />
      </div>
    </div>
  );
}
