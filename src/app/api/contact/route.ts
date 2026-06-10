import { type NextRequest } from "next/server";
import { fail, ok } from "@/lib/errors/api-response";
import { submitContact } from "@/features/contacts/contacts.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = await submitContact(body, {
      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,
      userAgent: request.headers.get("user-agent") ?? undefined
    });

    return ok({ id: message.id }, 201);
  } catch (error) {
    return fail(error);
  }
}
