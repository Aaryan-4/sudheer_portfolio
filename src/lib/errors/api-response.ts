import { NextResponse } from "next/server";
import { toSafeError } from "./app-error";

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ data }, { status });
}

export function fail(error: unknown): NextResponse {
  const safe = toSafeError(error);
  return NextResponse.json(
    {
      error: {
        code: safe.code,
        message: safe.message
      }
    },
    { status: safe.statusCode }
  );
}
