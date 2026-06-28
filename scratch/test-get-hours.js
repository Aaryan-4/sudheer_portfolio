import { PrismaClient } from "@prisma/client";

// Set environment variables directly to connect to Supabase
process.env.DATABASE_URL = "postgresql://postgres.axgmqaafrkaoxavemjbu:Sudheer%40123@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
process.env.DIRECT_URL = "postgresql://postgres.axgmqaafrkaoxavemjbu:Sudheer%40123@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres";

const prisma = new PrismaClient();

function getMidnightDate(dateStr) {
  const d = new Date(dateStr);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

const DEFINED_SLOTS = [
  { hour: 9, minute: 0, label: "09:00 AM - 09:30 AM" },
  { hour: 9, minute: 30, label: "09:30 AM - 10:00 AM" },
  { hour: 10, minute: 0, label: "10:00 AM - 10:30 AM" },
  { hour: 10, minute: 30, label: "10:30 AM - 11:00 AM" },
  { hour: 11, minute: 0, label: "11:00 AM - 11:30 AM" },
  { hour: 11, minute: 30, label: "11:30 AM - 12:00 PM" },
  { hour: 12, minute: 0, label: "12:00 PM - 12:30 PM" }
];

async function test() {
  console.log("Running direct GET availability hours logic test against Supabase...");
  try {
    const dateStr = new Date().toISOString().split("T")[0];
    const startMidnight = getMidnightDate(dateStr);

    console.log("1. Fetching manually blocked slots...");
    const blockedSlots = await prisma.blockedSlot.findMany({
      where: { date: startMidnight }
    });
    console.log("Blocked slots fetched:", blockedSlots);

    console.log("2. Fetching approved meetings...");
    const startRange = new Date(startMidnight);
    startRange.setUTCHours(0, 0, 0, 0);
    const endRange = new Date(startMidnight);
    endRange.setUTCHours(23, 59, 59, 999);

    const approvedMeetings = await prisma.meetingRequest.findMany({
      where: {
        status: "APPROVED",
        startAt: { gte: startRange },
        endAt: { lte: endRange }
      }
    });
    console.log("Approved meetings fetched:", approvedMeetings);

    console.log("3. Mapping slots...");
    const slots = DEFINED_SLOTS.map((slot) => {
      const isManuallyBlocked = blockedSlots.some(
        (bs) => bs.hour === slot.hour && bs.minute === slot.minute
      );

      const slotStart = new Date(startMidnight);
      slotStart.setUTCHours(slot.hour, slot.minute, 0, 0);
      const slotEnd = new Date(slotStart);
      slotEnd.setUTCMinutes(slotStart.getUTCMinutes() + 30);

      const hasMeeting = approvedMeetings.some((m) => {
        if (!m.startAt || !m.endAt) return false;
        const meetingStart = new Date(m.startAt);
        const meetingEnd = new Date(m.endAt);
        return meetingStart < slotEnd && meetingEnd > slotStart;
      });

      const status = isManuallyBlocked || hasMeeting ? "occupied" : "available";

      return {
        hour: slot.hour,
        minute: slot.minute,
        label: slot.label,
        status
      };
    });

    const result = [{
      date: dateStr,
      dayName: startMidnight.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }),
      slots
    }];

    console.log("✅ SUCCESS! Result data:", result);
  } catch (error) {
    console.error("❌ FAILED WITH ERROR:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
