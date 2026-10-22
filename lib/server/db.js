const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const globalForPrisma = global;

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return new Proxy({}, {
      get(target, prop) {
        if (prop === 'then' || prop === 'catch' || typeof prop === 'symbol') {
          return undefined;
        }
        return () => {
          throw new Error('DATABASE_URL is not set. Please configure DATABASE_URL in your environment variables.');
        };
      }
    });
  }
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({
    adapter,
    log: ['error', 'warn'],
  });
}

function getPrisma() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = createClient();
  if (process.env.NODE_ENV !== 'production' && process.env.DATABASE_URL) {
    globalForPrisma.prisma = client;
  }
  return client;
}

const prisma = new Proxy({}, {
  get(target, prop) {
    const client = getPrisma();
    return client[prop];
  }
});

module.exports = { prisma };
