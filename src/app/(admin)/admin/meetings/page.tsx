import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { meetingsRepository } from "@/features/meetings/meetings.repository";

export const dynamic = "force-dynamic";

export default async function AdminMeetingsPage() {
  const meetings = await meetingsRepository.list().catch(() => []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Meetings</h1>
      <div className="grid gap-3">
        {meetings.map((meeting) => (
          <Card key={meeting.id}>
            <CardTitle>{meeting.fullName}</CardTitle>
            <CardDescription>
              {meeting.email} · {meeting.status}
            </CardDescription>
          </Card>
        ))}
      </div>
      {meetings.length === 0 ? <p className="text-muted-foreground">No meeting requests yet.</p> : null}
    </div>
  );
}
