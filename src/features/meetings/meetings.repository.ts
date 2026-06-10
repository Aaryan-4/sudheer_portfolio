import { prisma } from "@/lib/db/prisma";
import type { MeetingRequestInput } from "./meetings.schemas";

export const meetingsRepository = {
  list() {
    return prisma.meetingRequest.findMany({
      orderBy: { createdAt: "desc" }
    });
  },
  listApprovedBetween(startAt: Date, endAt: Date) {
    return prisma.meetingRequest.findMany({
      where: {
        status: { in: ["APPROVED", "RESCHEDULED"] },
        startAt: { lt: endAt },
        endAt: { gt: startAt }
      }
    });
  },
  create(data: MeetingRequestInput & { approvalMode: "APPROVAL_REQUIRED" | "AUTO_APPROVAL"; ipAddress?: string; userAgent?: string }) {
    return prisma.meetingRequest.create({ data });
  },
  approve(id: string, data: { startAt: Date; endAt: Date; googleCalendarEventId?: string; googleMeetUrl?: string }) {
    return prisma.meetingRequest.update({
      where: { id },
      data: {
        ...data,
        status: "APPROVED",
        approvedAt: new Date()
      }
    });
  }
};
