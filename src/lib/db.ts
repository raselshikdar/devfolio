import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Runtime-aware Prisma client.
 *
 * - Vercel / Node.js: uses the standard PrismaClient with TCP connection.
 * - Cloudflare Pages (edge): uses @neondatabase/serverless + @prisma/adapter-neon
 *   so the database connection works over HTTP in the Workers runtime.
 *
 * The detection relies on `process.env.NEXT_RUNTIME === "edge"` which
 * @opennextjs/cloudflare sets automatically for API routes running on Workers.
 */
function createPrismaClient(): PrismaClient {
  const isEdge = process.env.NEXT_RUNTIME === "edge";

  if (isEdge) {
    // Lazy-import edge-only packages — they are never bundled for Node.js
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool } = require("@neondatabase/serverless");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaNeon } = require("@prisma/adapter-neon");

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaNeon(pool);
    return new PrismaClient({ adapter } as any);
  }

  // Standard Node.js PrismaClient (Vercel, local dev, etc.)
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
