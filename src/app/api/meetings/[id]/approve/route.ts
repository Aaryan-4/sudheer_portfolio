import { type NextRequest } from "next/server";
import { fail, ok } from "@/lib/errors/api-response";
import { AppError } from "@/lib/errors/app-error";
import { auth } from "@/lib/auth";
import { approveMeeting } from "@/features/meetings/meetings.service";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (session?.user.role !== "ADMIN") {
      throw new AppError("Admin access required", 403, "FORBIDDEN");
    }

    const { id } = await params;
    const meeting = await approveMeeting(id);
    return ok({ id: meeting.id, status: meeting.status, googleMeetUrl: meeting.googleMeetUrl });
  } catch (error) {
    return fail(error);
  }
}
