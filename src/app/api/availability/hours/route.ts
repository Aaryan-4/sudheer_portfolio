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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date") || new Date().toISOString().split("T")[0];
    
    const startMidnight = getMidnightDate(dateStr);
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(startMidnight);
      nextDate.setUTCDate(startMidnight.getUTCDate() + i);
      dates.push(nextDate);
    }

    const weeklyAvailability = await prisma.availability.findMany();
    const availabilityMap = new Map(weeklyAvailability.map((a) => [a.dayOfWeek, a]));

    const blockedSlots = await prisma.blockedSlot.findMany({
      where: {
        date: {
          gte: dates[0],
          lte: dates[dates.length - 1]
        }
      }
    });

    const startRange = new Date(dates[0]);
    startRange.setUTCHours(0, 0, 0, 0);
    const endRange = new Date(dates[dates.length - 1]);
    endRange.setUTCHours(23, 59, 59, 999);

    const approvedMeetings = await prisma.meetingRequest.findMany({
      where: {
        status: "APPROVED",
        startAt: { gte: startRange },
        endAt: { lte: endRange }
      }
    });

    const result = dates.map((d) => {
      const formattedDate = d.toISOString().split("T")[0];
      
      const dayOfWeekMap = [7, 1, 2, 3, 4, 5, 6];
      const dbDayOfWeek = dayOfWeekMap[d.getUTCDay()];
      const dayConfig = availabilityMap.get(dbDayOfWeek);

      const isWorkingDay = dayConfig ? dayConfig.isWorkingDay : true;
      const startHour = dayConfig ? parseInt(dayConfig.startTime.split(":")[0], 10) : 9;
      const endHour = dayConfig ? parseInt(dayConfig.endTime.split(":")[0], 10) : 17;

      const slots = Array.from({ length: 12 }, (_, index) => {
        const hour = 9 + index; // 9:00 AM to 8:00 PM
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const label = `${String(displayHour).padStart(2, "0")}:00 ${ampm}`;

        const isManuallyBlocked = blockedSlots.some(
          (bs) =>
            bs.date.toISOString().split("T")[0] === formattedDate &&
            bs.hour === hour
        );

        const isOutsideWorkingHours = hour < startHour || hour >= endHour;

        const slotStart = new Date(d);
        slotStart.setUTCHours(hour, 0, 0, 0);
        const slotEnd = new Date(d);
        slotEnd.setUTCHours(hour + 1, 0, 0, 0);

        const hasMeeting = approvedMeetings.some((m) => {
          if (!m.startAt || !m.endAt) return false;
          const meetingStart = new Date(m.startAt);
          const meetingEnd = new Date(m.endAt);
          return meetingStart < slotEnd && meetingEnd > slotStart;
        });

        let status = "available";
        if (!isWorkingDay) {
          status = "closed";
        } else if (isManuallyBlocked || isOutsideWorkingHours || hasMeeting) {
          status = "occupied";
        }

        return { hour, label, status };
      });

      return {
        date: formattedDate,
        dayName: d.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }),
        slots
      };
    });

    return ok(result);
  } catch (error) {
    return fail(error);
  }
}

const hourlyBlockoutSchema = z.object({
  date: z.string(),
  blockedHours: z.array(z.number().int().min(9).max(20))
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      throw new AppError("Admin access required", 403, "FORBIDDEN");
    }

    const body = await request.json();
    const { date, blockedHours } = hourlyBlockoutSchema.parse(body);
    const targetDate = getMidnightDate(date);

    await prisma.$transaction(async (tx) => {
      await tx.blockedSlot.deleteMany({
        where: { date: targetDate }
      });

      if (blockedHours.length > 0) {
        await tx.blockedSlot.createMany({
          data: blockedHours.map((hour) => ({
            date: targetDate,
            hour
          }))
        });
      }
    });

    return ok({ success: true, date });
  } catch (error) {
    return fail(error);
  }
}
