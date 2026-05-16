require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

async function check() {
  const rv = await prisma.resumeVersion.findFirst({
    where: { isMain: true }
  });

  if (!rv) {
    console.log('No Main version found.');
    return;
  }

  const projects = Array.isArray(rv.projects) ? rv.projects : [];
  console.log(`Main Version: ${rv.id}`);
  console.log(`Projects Count: ${projects.length}`);
  console.log('Projects Titles:', projects.map(p => p.title));
}

check().then(() => prisma.$disconnect());
