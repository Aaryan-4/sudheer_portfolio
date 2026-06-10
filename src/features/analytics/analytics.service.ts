import { prisma } from "@/lib/db/prisma";

export async function trackAnalytics(input: {
  eventType: "PAGE_VIEW" | "UNIQUE_VISITOR" | "RESUME_DOWNLOAD" | "PROJECT_VIEW" | "BLOG_VIEW" | "MEETING_REQUEST" | "CONTACT_REQUEST";
  path: string;
  visitorId?: string;
  sessionId?: string;
  referrer?: string;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  return prisma.analytics.create({ data: input });
}

export async function getAnalyticsSummary() {
  const [pageViews, resumeDownloads, meetingRequests, contactRequests] = await Promise.all([
    prisma.analytics.count({ where: { eventType: "PAGE_VIEW" } }),
    prisma.analytics.count({ where: { eventType: "RESUME_DOWNLOAD" } }),
    prisma.meetingRequest.count(),
    prisma.contactMessage.count()
  ]);

  return {
    pageViews,
    resumeDownloads,
    meetingRequests,
    contactRequests
  };
}
