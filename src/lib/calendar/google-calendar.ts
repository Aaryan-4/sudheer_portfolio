import { google } from "googleapis";

export type CalendarEventInput = {
  summary: string;
  description: string;
  startAt: Date;
  endAt: Date;
  attendeeEmail: string;
};

function getCalendarClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey || !process.env.GOOGLE_CALENDAR_ID) {
    return null;
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"]
  });

  return google.calendar({ version: "v3", auth });
}

export async function createCalendarEvent(input: CalendarEventInput): Promise<{
  eventId?: string;
  meetUrl?: string;
}> {
  const calendar = getCalendarClient();

  if (!calendar || !process.env.GOOGLE_CALENDAR_ID) {
    return {};
  }

  const response = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    conferenceDataVersion: 1,
    requestBody: {
      summary: input.summary,
      description: input.description,
      start: { dateTime: input.startAt.toISOString() },
      end: { dateTime: input.endAt.toISOString() },
      attendees: [{ email: input.attendeeEmail }],
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID(),
          conferenceSolutionKey: { type: "hangoutsMeet" }
        }
      }
    }
  });

  return {
    eventId: response.data.id ?? undefined,
    meetUrl: response.data.hangoutLink ?? undefined
  };
}
