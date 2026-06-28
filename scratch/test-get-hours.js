import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function getMidnightDate(dateStr) {
  const d = new Date(dateStr);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

async function test() {
  console.log("Running GET availability hours logic test...");
  try {
    const dateStr = new Date().toISOString().split("T")[0];
    const startMidnight = getMidnightDate(dateStr);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(startMidnight);
      nextDate.setUTCDate(startMidnight.getUTCDate() + i);
      dates.push(nextDate);
    }

    console.log("1. Fetching weekly availability...");
    const weeklyAvailability = await prisma.availability.findMany();
    console.log("Weekly availability count:", weeklyAvailability.length);

    console.log("2. Fetching blocked slots...");
    const blockedSlots = await prisma.blockedSlot.findMany({
      where: {
        date: {
          gte: dates[0],
          lte: dates[dates.length - 1]
        }
      }
    });
    console.log("Blocked slots count:", blockedSlots.length);

    console.log("3. Fetching approved meetings...");
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
    console.log("Approved meetings count:", approvedMeetings.length);

    console.log("4. Mapping slots...");
    const result = dates.map((d) => {
      const formattedDate = d.toISOString().split("T")[0];
      const dayOfWeekMap = [7, 1, 2, 3, 4, 5, 6];
      const dbDayOfWeek = dayOfWeekMap[d.getUTCDay()];
      const dayConfig = weeklyAvailability.find((a) => a.dayOfWeek === dbDayOfWeek);

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

    console.log("✅ SUCCESS! First day data sample:", result[0]);
  } catch (error) {
    console.error("❌ FAILED WITH ERROR:");
    console.error(error);
  }
}

test();
