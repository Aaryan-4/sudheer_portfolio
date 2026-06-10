import { type NextRequest } from "next/server";
import { fail, ok } from "@/lib/errors/api-response";
import { submitMeetingRequest } from "@/features/meetings/meetings.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const meeting = await submitMeetingRequest(body, {
      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,
      userAgent: request.headers.get("user-agent") ?? undefined
    });

    return ok({ id: meeting.id, status: meeting.status }, 201);
  } catch (error) {
    return fail(error);
  }
}
