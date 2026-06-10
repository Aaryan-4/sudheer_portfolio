export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400,
    public readonly code = "APP_ERROR"
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function toSafeError(error: unknown): { message: string; statusCode: number; code: string } {
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code
    };
  }

  return {
    message: "Unexpected server error",
    statusCode: 500,
    code: "INTERNAL_SERVER_ERROR"
  };
}
