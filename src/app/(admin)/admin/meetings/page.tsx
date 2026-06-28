import { meetingsRepository } from "@/features/meetings/meetings.repository";
import { AdminMeetingsList } from "@/components/layout/admin-meetings-list";

export const dynamic = "force-dynamic";

export default async function AdminMeetingsPage() {
  const meetings = await meetingsRepository.list().catch(() => []);

  // Map meeting model to local interface format safely
  const formattedMeetings = meetings.map((m) => ({
    id: m.id,
    fullName: m.fullName,
    email: m.email,
    preferredDate: m.preferredDate,
    preferredTime: m.preferredTime,
    duration: m.duration,
    purpose: m.purpose,
    status: m.status,
    googleMeetUrl: m.googleMeetUrl
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Meetings</h1>
      <AdminMeetingsList initialMeetings={formattedMeetings} />
    </div>
  );
}
