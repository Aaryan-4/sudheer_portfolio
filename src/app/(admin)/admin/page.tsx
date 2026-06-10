import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getAnalyticsSummary } from "@/features/analytics/analytics.service";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const summary = await getAnalyticsSummary().catch(() => ({
    pageViews: 0,
    resumeDownloads: 0,
    meetingRequests: 0,
    contactRequests: 0
  }));

  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Overview</h1>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Page views", summary.pageViews],
          ["Resume downloads", summary.resumeDownloads],
          ["Meetings", summary.meetingRequests],
          ["Contacts", summary.contactRequests]
        ].map(([label, value]) => (
          <Card key={label}>
            <CardDescription>{label}</CardDescription>
            <CardTitle className="mt-2 text-3xl">{value}</CardTitle>
          </Card>
        ))}
      </div>
    </div>
  );
}
