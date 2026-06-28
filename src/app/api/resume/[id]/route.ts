import { type NextRequest } from "next/server";
import { fail, ok } from "@/lib/errors/api-response";
import { AppError } from "@/lib/errors/app-error";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      throw new AppError("Admin access required", 403, "FORBIDDEN");
    }

    const { id } = await params;
    await prisma.resumeFile.delete({ where: { id } });

    return ok({ message: "Resume deleted successfully" });
  } catch (error) {
    return fail(error);
  }
}
