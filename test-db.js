const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const Database = require('better-sqlite3');

const sqlite = new Database('./prisma/dev.db');
const adapter = new PrismaBetterSqlite3(sqlite);
const prisma = new PrismaClient({ adapter });

async function check() {
  const projs = await prisma.project.findMany();
  console.log(projs.map(p => ({ id: p.id, name: p.name, lastEditedBy: p.lastEditedBy })));
}
check();
