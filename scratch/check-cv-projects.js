require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

async function check() {
  const rv = await prisma.resumeVersion.findFirst({
    where: { isMain: true }
  });

  const projects = Array.isArray(rv.projects) ? rv.projects : [];
  console.log(`CV Projects Count: ${projects.length}`);
  for (const p of projects) {
    console.log(` - Title: ${p.title}`);
    console.log(`   Repo: ${p.repoUrl}`);
  }
}

check().then(() => prisma.$disconnect());
