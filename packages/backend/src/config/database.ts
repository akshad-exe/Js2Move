import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | undefined;

async function initPrisma() {
  if (prisma) return prisma;
  prisma = new PrismaClient();
  return prisma;
}

export async function connectWithRetry(retries = 5, delayMs = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = await initPrisma();
      await client.$connect();
      // Do not log here to avoid duplicate startup messages; caller (index.ts) will log success.
      return;
    } catch (err: any) {
      console.warn(`DB connect attempt ${attempt} failed: ${err?.message || err}`);
      if (attempt === retries) throw err;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

export function getPrisma(): PrismaClient {
  if (!prisma) throw new Error('Prisma client not initialized. Call connectWithRetry() first.');
  return prisma;
}

export function isDbConnected(): boolean {
  return !!prisma;
}

// Export the prisma instance getter for use in services
export { getPrisma as prisma };
