import { PrismaClient } from "@/generated/prisma";

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./prisma/dev.db"
    }
  }
});