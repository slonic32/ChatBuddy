import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

function getPrisma() {
    console.info('Prisma initialized');
    const adapter = new PrismaPg({
        connectionString: process.env.DATABASE_URL,
    });
    return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = getPrisma();
}

export const prisma = globalForPrisma.prisma;
