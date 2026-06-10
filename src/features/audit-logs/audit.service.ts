import type { AuditAction, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export async function writeAuditLog(input: {
  action: AuditAction;
  userId?: string;
  entity?: string;
  entityId?: string;
  message: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  return prisma.auditLog.create({
    data: {
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      message: input.message,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      metadata: input.metadata,
      user: input.userId ? { connect: { id: input.userId } } : undefined
    }
  });
}
