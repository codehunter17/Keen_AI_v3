import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Neon-friendly pool config.
// Neon's free tier silently drops idle Postgres connections after ~60s.
// If our pool hangs on to them, the NEXT query lands on a dead socket and
// the user sees: "Connection terminated unexpectedly".
//
// Defence in depth:
//   1) Keep pool tiny — Next.js dev creates several PrismaClients via HMR.
//   2) Cycle idle conns before Neon does (idleTimeoutMillis < ~60s).
//   3) TCP keepalive — long-lived conns stay warm.
//   4) Pool-level error listener — background errors no longer crash the
//      process; the pool just opens a fresh socket on the next checkout.
//   5) Prisma $extends with a 1-retry wrapper for the specific connection-
//      terminated error class. Transparent to callers.

const connectionString = process.env.DATABASE_URL ?? "";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaPool: Pool | undefined;
};

function createPool(): Pool {
  const pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 8_000,
    keepAlive: true,
    allowExitOnIdle: false,
  });

  pool.on("error", (err) => {
    // Background pool errors (idle conn killed by Neon, etc.) — log and
    // recover. Without this, an unhandled "error" event on the EventEmitter
    // crashes the Node process.
    console.warn(
      "[prisma:pool] background error (will recover on next query):",
      err.message,
    );
  });

  return pool;
}

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not set");
    return new PrismaClient();
  }

  const pool =
    globalForPrisma.prismaPool ??
    (globalForPrisma.prismaPool = createPool());

  const adapter = new PrismaPg(pool);
  const base = new PrismaClient({ adapter });

  // Retry-once wrapper: catches the specific "connection terminated"
  // family of errors from pg and retries the operation a single time.
  // This survives Neon's idle-conn drops without exposing them to callers.
  return base.$extends({
    query: {
      async $allOperations({ args, query }) {
        try {
          return await query(args);
        } catch (err) {
          if (isTransientConnectionError(err)) {
            console.warn(
              "[prisma] transient connection error — retrying once:",
              messageOf(err),
            );
            return await query(args);
          }
          throw err;
        }
      },
    },
  }) as unknown as PrismaClient;
}

function messageOf(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

function isTransientConnectionError(err: unknown): boolean {
  const msg = messageOf(err).toLowerCase();
  if (!msg) return false;
  // pg-emitted phrases seen in the wild when Neon drops an idle socket.
  return (
    msg.includes("connection terminated") ||
    msg.includes("connection terminated unexpectedly") ||
    msg.includes("connection reset by peer") ||
    msg.includes("connection ended") ||
    msg.includes("client has encountered a connection error") ||
    msg.includes("write econnreset") ||
    msg.includes("read econnreset") ||
    msg.includes("server has closed the connection")
  );
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? (globalForPrisma.prisma = createPrismaClient());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
