import { PrismaClient } from "@prisma/client";
import { config } from "./index";
import { logger } from "./logger";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: config.isDev
      ? [
          { emit: "event", level: "query" },
          { emit: "event", level: "error" },
          { emit: "event", level: "warn" },
        ]
      : [{ emit: "event", level: "error" }],
  });

if (config.isDev) {
  prisma.$on("query" as never, (e: { query: string; duration: number }) => {
    logger.debug({ query: e.query, duration: `${e.duration}ms` }, "Prisma query");
  });
}

prisma.$on("error" as never, (e: { message: string }) => {
  logger.error({ error: e.message }, "Prisma error");
});

if (!config.isProd) {
  globalForPrisma.prisma = prisma;
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  logger.info("Database disconnected");
}
