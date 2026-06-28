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
    html: meetingStatusTemplate("request received", "Your meeting request has been received. You will be notified once it is approved.")
  });

  if (process.env.ADMIN_EMAIL) {
    const formattedDate = typeof data.preferredDate === "string" 
      ? data.preferredDate 
      : new Date(data.preferredDate).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `[Portfolio Meeting Request] ${data.fullName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #1F2937;">
          <h2 style="color: #0F2B5B; border-bottom: 2px solid #FF6B57; padding-bottom: 8px;">New Meeting Request</h2>
          <p>Hi Sudheer,</p>
          <p>You have received a new meeting request through your portfolio platform. Here are the details:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px;">Name:</td>
              <td style="padding: 8px 0;">${data.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td>
            </tr>
            ${data.phone ? `<tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td style="padding: 8px 0;">${data.phone}</td></tr>` : ""}
            ${data.company ? `<tr><td style="padding: 8px 0; font-weight: bold;">Company:</td><td style="padding: 8px 0;">${data.company}</td></tr>` : ""}
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Preferred Date:</td>
              <td style="padding: 8px 0;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Preferred Time:</td>
              <td style="padding: 8px 0;">${data.preferredTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Duration:</td>
              <td style="padding: 8px 0;">${data.duration.replace("MINUTES_", "")} minutes</td>
            </tr>
          </table>
          <div style="background-color: #F5F7FA; border-left: 4px solid #FF6B57; padding: 12px; margin-top: 16px; border-radius: 4px;">
            <p style="margin: 0; font-weight: bold;">Purpose:</p>
            <p style="margin: 4px 0 0 0; font-style: italic;">"${data.purpose}"</p>
          </div>
          <p style="margin-top: 24px;">Please log in to your admin dashboard to approve or reject this request.</p>
        </div>
      `
    });
  }

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
