import { PrismaClient } from "@prisma/client"

// Cache the client on globalThis so dev hot reload reuses one connection pool.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const pc = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = pc

/** The client handed to a pc.$transaction callback */
export type TxClient = Parameters<Parameters<typeof pc.$transaction>[0]>[0]
