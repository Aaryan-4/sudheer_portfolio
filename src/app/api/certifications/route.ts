import { type NextRequest } from "next/server";
import { fail, ok } from "@/lib/errors/api-response";
import { AppError } from "@/lib/errors/app-error";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const certificationSchema = z.object({
  name: z.string().min(2).max(200),
  issuer: z.string().min(2).max(200),
  issueDate: z.coerce.date(),
  expirationDate: z.coerce.date().nullable().optional(),
  credentialUrl: z.string().url().optional().or(z.literal("")),
  certificateUrl: z.string().url().optional().or(z.literal("")),
  sortOrder: z.coerce.number().default(0)
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      throw new AppError("Admin access required", 403, "FORBIDDEN");
    }

    const body = await request.json();
    const data = certificationSchema.parse(body);

    const certification = await prisma.certification.create({
      data: {
        name: data.name,
        issuer: data.issuer,
        issueDate: data.issueDate,
        expirationDate: data.expirationDate || null,
        credentialUrl: data.credentialUrl || null,
        certificateUrl: data.certificateUrl || null,
        sortOrder: data.sortOrder,
        createdById: session.user.id
      }
    });

    return ok({ id: certification.id }, 201);
  } catch (error) {
    return fail(error);
  }
}
