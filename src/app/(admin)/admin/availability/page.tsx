import { AdminHourlyBlockoutPanel } from "@/components/layout/admin-hourly-blockout-panel";

export const dynamic = "force-dynamic";

export default function AdminAvailabilityPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-navy dark:text-white font-poppins">Availability Manager</h1>
      <AdminHourlyBlockoutPanel />
    </div>
  );
}
