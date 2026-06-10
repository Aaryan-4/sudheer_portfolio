import { prisma } from "@/lib/db/prisma";
import type { ContactInput } from "./contacts.schemas";

export const contactsRepository = {
  list() {
    return prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" }
    });
  },
  create(data: ContactInput & { ipAddress?: string; userAgent?: string }) {
    return prisma.contactMessage.create({ data });
  },
  markRead(id: string) {
    return prisma.contactMessage.update({
      where: { id },
      data: { status: "READ", readAt: new Date() }
    });
  }
};
