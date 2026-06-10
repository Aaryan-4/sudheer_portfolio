import { prisma } from "@/lib/db/prisma";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminAvailabilityPage() {
  const availability = await prisma.availability.findMany({ orderBy: { dayOfWeek: "asc" } }).catch(() => []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Availability</h1>
      <div className="grid gap-3">
        {availability.map((slot) => (
          <Card key={slot.id}>
            <CardTitle>Day {slot.dayOfWeek}</CardTitle>
            <CardDescription>
              {slot.startTime} - {slot.endTime}
            </CardDescription>
          </Card>
        ))}
      </div>
      {availability.length === 0 ? <p className="text-muted-foreground">No availability configured.</p> : null}
    </div>
  );
}
