import { prisma } from "@/lib/db/prisma";

export const certificationsRepository = {
  listPublic() {
    return prisma.certification.findMany({
      orderBy: [{ sortOrder: "asc" }, { issueDate: "desc" }]
    });
  },
  listAdmin() {
    return prisma.certification.findMany({
      orderBy: { createdAt: "desc" }
    });
  }
};
