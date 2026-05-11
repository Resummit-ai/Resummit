import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log("Testing Prisma connection...");
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    console.log("Success! Result:", result);
  } catch (e) {
    console.error("Failed to connect to database:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
