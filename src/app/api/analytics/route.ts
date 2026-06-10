import { type NextRequest } from "next/server";
import { fail, ok } from "@/lib/errors/api-response";
import { trackAnalytics } from "@/features/analytics/analytics.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = await trackAnalytics({
      eventType: body.eventType,
      path: body.path,
      visitorId: body.visitorId,
      sessionId: body.sessionId,
      referrer: body.referrer,
      source: body.source,
      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,
      userAgent: request.headers.get("user-agent") ?? undefined
    });

    return ok({ id: event.id }, 201);
  } catch (error) {
    return fail(error);
  }
}
