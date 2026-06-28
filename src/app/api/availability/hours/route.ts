import { type NextRequest } from "next/server";
import { fail, ok } from "@/lib/errors/api-response";
import { AppError } from "@/lib/errors/app-error";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

function getMidnightDate(dateStr: string): Date {
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
  { hour: 12, minute: 0, label: "12:00 PM - 12:30 PM" },
  { hour: 12, minute: 30, label: "12:30 PM - 01:00 PM" },
  { hour: 13, minute: 0, label: "01:00 PM - 01:30 PM" },
  { hour: 13, minute: 30, label: "01:30 PM - 02:00 PM" },
  { hour: 14, minute: 0, label: "02:00 PM - 02:30 PM" },
  { hour: 14, minute: 30, label: "02:30 PM - 03:00 PM" },
  { hour: 15, minute: 0, label: "03:00 PM - 03:30 PM" },
  { hour: 15, minute: 30, label: "03:30 PM - 04:00 PM" },
  { hour: 16, minute: 0, label: "04:00 PM - 04:30 PM" },
  { hour: 16, minute: 30, label: "04:30 PM - 05:00 PM" },
  { hour: 17, minute: 0, label: "05:00 PM - 05:30 PM" },
  { hour: 17, minute: 30, label: "05:30 PM - 06:00 PM" },
  { hour: 18, minute: 0, label: "06:00 PM - 06:30 PM" },
  { hour: 18, minute: 30, label: "06:30 PM - 07:00 PM" },
  { hour: 19, minute: 0, label: "07:00 PM - 07:30 PM" },
  { hour: 19, minute: 30, label: "07:30 PM - 08:00 PM" },
  { hour: 20, minute: 0, label: "08:00 PM - 08:30 PM" },
  { hour: 20, minute: 30, label: "08:30 PM - 09:00 PM" },
  { hour: 21, minute: 0, label: "09:00 PM - 09:30 PM" },
  { hour: 21, minute: 30, label: "09:30 PM - 10:00 PM" },
  { hour: 22, minute: 0, label: "10:00 PM - 10:30 PM" },
  { hour: 22, minute: 30, label: "10:30 PM - 11:00 PM" },
  { hour: 23, minute: 0, label: "11:00 PM - 11:30 PM" },
  { hour: 23, minute: 30, label: "11:30 PM - 12:00 AM" }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date") || new Date().toISOString().split("T")[0];
    
    const startMidnight = getMidnightDate(dateStr);

    // Fetch manually blocked slots
    const blockedSlots = await prisma.blockedSlot.findMany({
      where: { date: startMidnight }
    });

    // Fetch approved meetings for this date
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

    return ok(result);
  } catch (error) {
    return fail(error);
  }
}

const hourlyBlockoutSchema = z.object({
  date: z.string(),
  blockedSlots: z.array(
    z.object({
      hour: z.number().int().min(9).max(23),
      minute: z.number().int().min(0).max(59)
    })
  )
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      throw new AppError("Admin access required", 403, "FORBIDDEN");
    }

    const body = await request.json();
    const { date, blockedSlots } = hourlyBlockoutSchema.parse(body);
    const targetDate = getMidnightDate(date);

    await prisma.$transaction(async (tx) => {
      await tx.blockedSlot.deleteMany({
        where: { date: targetDate }
      });

      if (blockedSlots.length > 0) {
        await tx.blockedSlot.createMany({
          data: blockedSlots.map((slot) => ({
            date: targetDate,
            hour: slot.hour,
            minute: slot.minute
          }))
        });
      }
    });

    return ok({ success: true, date });
  } catch (error) {
    return fail(error);
  }
}
