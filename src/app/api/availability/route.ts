import { type NextRequest } from "next/server";
import { fail, ok } from "@/lib/errors/api-response";
import { AppError } from "@/lib/errors/app-error";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const availabilityUpdateSchema = z.object({
  dayOfWeek: z.coerce.number().int().min(1).max(7),
  isWorkingDay: z.boolean(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)")
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      throw new AppError("Admin access required", 403, "FORBIDDEN");
    }

    const body = await request.json();
    const data = availabilityUpdateSchema.parse(body);

    const slot = await prisma.availability.upsert({
      where: { dayOfWeek: data.dayOfWeek },
      update: {
        isWorkingDay: data.isWorkingDay,
        startTime: data.startTime,
        endTime: data.endTime
      },
      create: {
        dayOfWeek: data.dayOfWeek,
        isWorkingDay: data.isWorkingDay,
        startTime: data.startTime,
        endTime: data.endTime
      }
    });

    return ok({ id: slot.id, dayOfWeek: slot.dayOfWeek });
  } catch (error) {
    return fail(error);
  }
}
