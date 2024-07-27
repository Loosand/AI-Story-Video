import { PrismaClient } from "@prisma/client"

import { DATABASE_URL } from "@/config"

const globalForPrisma = global as typeof global & { prisma?: PrismaClient }

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		datasources: {
			db: {
				url: DATABASE_URL,
			},
		},
		log: process.env.NODE_ENV === "development" ? ["warn", "error"] : undefined,
	})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
