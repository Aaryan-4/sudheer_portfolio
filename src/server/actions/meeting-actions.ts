"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { AppError } from "@/lib/errors/app-error";
import { approveMeeting } from "@/features/meetings/meetings.service";
import { writeAuditLog } from "@/features/audit-logs/audit.service";

export async function approveMeetingAction(id: string) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    throw new AppError("Admin access required", 403, "FORBIDDEN");
  }

  const meeting = await approveMeeting(id);
  await writeAuditLog({
    action: "MEETING_APPROVED",
    userId: session.user.id,
    entity: "MeetingRequest",
    entityId: meeting.id,
    message: `Meeting approved for ${meeting.email}`
  });

  revalidatePath("/admin/meetings");
  return meeting;
}
