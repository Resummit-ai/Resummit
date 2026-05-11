const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ adapter: { provider: 'postgres' }}); // Mock adapter to pass initialization check
console.log(Object.keys(prisma).filter(k => typeof prisma[k] === 'object' && !k.startsWith('_')));
