import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: Role.ADMIN,
      isActive: true
    },
    create: {
      name: "Sudheer Kumar",
      email,
      passwordHash,
      role: Role.ADMIN,
      isActive: true
    }
  });

  for (const dayOfWeek of [1, 2, 3, 4, 5]) {
    await prisma.availability.upsert({
      where: { dayOfWeek },
      update: {},
      create: {
        dayOfWeek,
        isWorkingDay: true,
        startTime: "09:00",
        endTime: "18:00"
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
