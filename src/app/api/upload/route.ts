import { NextResponse, type NextRequest } from "next/server";
import { AppError } from "@/lib/errors/app-error";
import { fail } from "@/lib/errors/api-response";
import { auth } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary/client";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (session?.user.role !== "ADMIN") {
      throw new AppError("Admin access required", 403, "FORBIDDEN");
    }

    if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
      throw new AppError("Cloudinary is not configured", 500, "CLOUDINARY_NOT_CONFIGURED");
    }

    const body = await request.json().catch(() => ({}));
    const folder = String(body.folder ?? "sudheer-portfolio");
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        folder,
        timestamp
      },
      process.env.CLOUDINARY_API_SECRET ?? ""
    );

    return NextResponse.json({
      data: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        folder,
        timestamp,
        signature
      }
    });
  } catch (error) {
    return fail(error);
  }
}
