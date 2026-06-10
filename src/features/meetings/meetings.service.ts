import { addMinutes } from "date-fns";
import { createCalendarEvent } from "@/lib/calendar/google-calendar";
import { AppError } from "@/lib/errors/app-error";
import { sendEmail } from "@/lib/email/resend";
import { meetingStatusTemplate } from "@/lib/email/templates";
import { assertRateLimit } from "@/lib/rate-limit/memory-rate-limit";
import { sanitizeOptionalText, sanitizeText } from "@/lib/security/sanitize";
import { prisma } from "@/lib/db/prisma";
import { meetingsRepository } from "./meetings.repository";
import { meetingRequestSchema, type MeetingRequestInput } from "./meetings.schemas";

const durationMinutes = {
  MINUTES_15: 15,
  MINUTES_30: 30,
  MINUTES_45: 45,
  MINUTES_60: 60
} as const;

export async function submitMeetingRequest(input: MeetingRequestInput, meta: { ipAddress?: string; userAgent?: string }) {
  assertRateLimit(`meeting:${meta.ipAddress ?? input.email}`, 4, 60_000);
  const data = meetingRequestSchema.parse({
    ...input,
    fullName: sanitizeText(input.fullName),
    company: sanitizeOptionalText(input.company),
    purpose: sanitizeText(input.purpose)
  });

  const availability = await prisma.availability.findFirst({
    where: { vacationMode: false },
    orderBy: { dayOfWeek: "asc" }
  });

  const approvalMode = availability?.approvalMode ?? "APPROVAL_REQUIRED";
  const meeting = await meetingsRepository.create({ ...data, approvalMode, ...meta });

  await sendEmail({
    to: data.email,
    subject: "Meeting request received",
    html: meetingStatusTemplate("request received", "Your meeting request has been received.")
  });

  return meeting;
}

export async function approveMeeting(id: string) {
  const meeting = await prisma.meetingRequest.findUnique({ where: { id } });

  if (!meeting) {
    throw new AppError("Meeting not found", 404, "MEETING_NOT_FOUND");
  }

  const [hour, minute] = meeting.preferredTime.split(":").map(Number);
  const startAt = new Date(meeting.preferredDate);
  startAt.setHours(hour, minute, 0, 0);
  const endAt = addMinutes(startAt, durationMinutes[meeting.duration]);

  const conflicts = await meetingsRepository.listApprovedBetween(startAt, endAt);
  if (conflicts.length > 0) {
    throw new AppError("Selected slot is already booked", 409, "SLOT_BOOKED");
  }

  const calendar = await createCalendarEvent({
    summary: `Portfolio meeting with ${meeting.fullName}`,
    description: meeting.purpose,
    startAt,
    endAt,
    attendeeEmail: meeting.email
  });

  const approved = await meetingsRepository.approve(id, {
    startAt,
    endAt,
    googleCalendarEventId: calendar.eventId,
    googleMeetUrl: calendar.meetUrl
  });

  await sendEmail({
    to: meeting.email,
    subject: "Meeting approved",
    html: meetingStatusTemplate("approved", calendar.meetUrl ? `Join with Google Meet: ${calendar.meetUrl}` : "Your meeting has been approved.")
  });

  return approved;
}
