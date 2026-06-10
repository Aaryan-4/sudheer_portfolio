import type { Role } from "@prisma/client";
import { AppError } from "@/lib/errors/app-error";

export function assertAdmin(role?: Role | null): void {
  if (role !== "ADMIN") {
    throw new AppError("Admin access required", 403, "FORBIDDEN");
  }
}
