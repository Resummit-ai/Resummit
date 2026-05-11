const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const globalForPrisma = global;

function createClient() {
  // Prisma 7 Requires a explicit driver adapter for SQLite due to the removal of the native binary engine.
  // The PrismaBetterSqlite3 adapter expects the url to be passed in options.
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || "file:./prisma/dev.db"
  });

  return new PrismaClient({
    adapter,
    log: ['error', 'warn'],
  });
}

const prisma = globalForPrisma.prisma || createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = { prisma };
