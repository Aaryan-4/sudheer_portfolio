import { prisma } from "@/lib/db/prisma";
import { AdminAvailabilityPanel } from "@/components/layout/admin-availability-panel";

export const dynamic = "force-dynamic";

export default async function AdminAvailabilityPage() {
  const availability = await prisma.availability
    .findMany({ orderBy: { dayOfWeek: "asc" } })
    .catch(() => []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Availability</h1>
      <AdminAvailabilityPanel initialSlots={availability} />
    </div>
  );
}
