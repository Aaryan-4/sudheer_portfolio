import { prisma } from "@/lib/db/prisma";

export const resumeRepository = {
  active() {
    return prisma.resumeFile.findFirst({
      where: { status: "ACTIVE" },
      orderBy: { version: "desc" }
    });
  },
  list() {
    return prisma.resumeFile.findMany({
      orderBy: { version: "desc" }
    });
  },
  incrementDownload(id: string) {
    return prisma.resumeFile.update({
      where: { id },
      data: {
        downloadCount: { increment: 1 }
      }
    });
  }
};
