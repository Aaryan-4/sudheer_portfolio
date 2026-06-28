import dotenv from "dotenv";
dotenv.config();
import { google } from "googleapis";

function getCalendarClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.trim();
  let privateKey = process.env.GOOGLE_PRIVATE_KEY?.trim();

  if (!clientEmail || !privateKey || !process.env.GOOGLE_CALENDAR_ID) {
    throw new Error("Missing environment variables in .env file.");
  }

  // Remove surrounding quotes and replace literal \n with newlines
  privateKey = privateKey.replace(/^["']|["']$/g, "");
  privateKey = privateKey.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"]
  });

  return google.calendar({ version: "v3", auth });
}

async function test() {
  console.log("Running direct Google Calendar API diagnostics...");
  try {
    const calendar = getCalendarClient();
    
    console.log("1. Authenticating & inserting test event...");
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      conferenceDataVersion: 1,
      requestBody: {
        summary: "Diagnostic Test Event",
        description: "Testing Google Meet Link Generation",
        start: { dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString() },
        end: { dateTime: new Date(Date.now() + 90 * 60 * 1000).toISOString() },
        conferenceData: {
          createRequest: {
            requestId: crypto.randomUUID(),
            conferenceSolutionKey: { type: "eventHangout" }
          }
        }
      }
    });

    console.log("✅ SUCCESS!");
    console.log("Event ID:", response.data.id);
    console.log("Meet URL:", response.data.hangoutLink);
  } catch (error) {
    console.error("❌ DIAGNOSTIC FAILED with error:");
    console.error(error);
  }
}

test();
