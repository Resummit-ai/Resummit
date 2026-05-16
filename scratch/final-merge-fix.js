require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

async function mergeAndFix() {
  const versionWithProjects = await prisma.resumeVersion.findUnique({
    where: { id: 'cmp1e8drk0004veok3fi0m0tu' }
  });

  const versionWithSkills = await prisma.resumeVersion.findUnique({
    where: { id: 'cmp1e8drj0003veokuwsd8lhr' }
  });

  if (!versionWithProjects || !versionWithSkills) {
    console.log('Versions not found.');
    return;
  }

  console.log(`Merging projects from ${versionWithProjects.id} into ${versionWithSkills.id}`);

  // Perform the merge
  await prisma.resumeVersion.update({
    where: { id: versionWithSkills.id },
    data: { 
      projects: versionWithProjects.projects,
      isMain: true 
    }
  });

  // Ensure the other one is NOT main
  await prisma.resumeVersion.update({
    where: { id: versionWithProjects.id },
    data: { isMain: false }
  });

  console.log('Merge complete. Main version now has projects and skills.');
}

mergeAndFix().then(() => prisma.$disconnect());
