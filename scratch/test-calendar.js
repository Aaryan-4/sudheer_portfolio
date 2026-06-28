import dotenv from "dotenv";
dotenv.config();
import { google } from "googleapis";

function getCalendarClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.trim();
  let privateKey = process.env.GOOGLE_PRIVATE_KEY?.trim();

  if (!clientEmail || !privateKey || !process.env.GOOGLE_CALENDAR_ID) {
    throw new Error("Missing environment variables in .env file.");
  }

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
  console.log("Verifying service account write permissions...");
  try {
    const calendar = getCalendarClient();
    
    // We create a basic event without attendees and without Meet conference
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: "🎉 API Setup Verified Successfully!",
        description: "This event proves that the Service Account has successfully authenticated and has full write access to your Google Calendar.",
        start: { dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString() }, // 1 hour from now
        end: { dateTime: new Date(Date.now() + 90 * 60 * 1000).toISOString() }
      }
    });

    console.log("✅ SUCCESS!");
    console.log("Event created successfully!");
    console.log("Event ID:", response.data.id);
    console.log("Check your Google Calendar - this event should now be visible!");
  } catch (error) {
    console.error("❌ API verification failed:");
    console.error(error);
  }
}

test();
