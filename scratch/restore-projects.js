require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

async function restore() {
  const source = await prisma.resumeVersion.findUnique({
    where: { id: 'cmp1e8drk0004veok3fi0m0tu' }
  });

  const target = await prisma.resumeVersion.findUnique({
    where: { id: 'cmp1e8drj0003veokuwsd8lhr' }
  });

  if (!source || !target) {
    console.log('Source or Target version not found.');
    return;
  }

  console.log(`Restoring ${source.projects.length} projects from ${source.id} to ${target.id}`);

  await prisma.resumeVersion.update({
    where: { id: target.id },
    data: { projects: source.projects }
  });

  console.log('Restore complete.');
}

restore().then(() => prisma.$disconnect());
