require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

async function debug() {
  const user = await prisma.user.findFirst({
    where: { email: 'adelmuhammed786@gmail.com' }
  });

  if (!user) {
    console.log('User not found.');
    return;
  }

  console.log(`User ID: ${user.id}`);

  const versions = await prisma.resumeVersion.findMany({
    where: { resume: { userId: user.id } }
  });

  console.log(`Found ${versions.length} versions for user.`);

  for (const v of versions) {
    console.log(`Version ${v.id} - isMain: ${v.isMain} - projects count: ${Array.isArray(v.projects) ? v.projects.length : 0}`);
  }

  const main = versions.find(v => v.isMain);
  if (main) {
    console.log('Current Main projects titles:', (main.projects || []).map(p => p.title));
  } else {
    console.log('NO VERSION IS MARKED AS MAIN!');
  }
}

debug().then(() => prisma.$disconnect());
