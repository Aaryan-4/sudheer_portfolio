import { type NextRequest } from "next/server";
import { fail, ok } from "@/lib/errors/api-response";
import { AppError } from "@/lib/errors/app-error";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const resumeSchema = z.object({
  version: z.coerce.number().int().positive(),
  fileName: z.string().min(1),
  fileUrl: z.string().url(),
  secureUrl: z.string().url(),
  publicId: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.coerce.number().int().positive(),
  status: z.enum(["ACTIVE", "ARCHIVED"]).default("ARCHIVED")
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      throw new AppError("Admin access required", 403, "FORBIDDEN");
    }

    const body = await request.json();
    const data = resumeSchema.parse(body);

    const resume = await prisma.$transaction(async (tx) => {
      // If setting this one to active, archive all other resumes
      if (data.status === "ACTIVE") {
        await tx.resumeFile.updateMany({
          where: { status: "ACTIVE" },
          data: { status: "ARCHIVED" }
        });
      }

      return tx.resumeFile.create({
        data: {
          version: data.version,
          fileName: data.fileName,
          fileUrl: data.fileUrl,
          secureUrl: data.secureUrl,
          publicId: data.publicId,
          mimeType: data.mimeType,
          sizeBytes: data.sizeBytes,
          status: data.status,
          uploadedById: session.user.id
        }
      });
    });

    return ok({ id: resume.id, version: resume.version }, 201);
  } catch (error) {
    return fail(error);
  }
}
