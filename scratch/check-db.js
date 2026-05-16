require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

async function check() {
  const user = await prisma.user.findFirst({
    where: { email: 'adelmuhammed786@gmail.com' },
    include: {
      resumes: {
        include: {
          versions: {
            where: { isMain: true }
          }
        }
      }
    }
  });

  if (!user) {
    console.log('User not found');
    return;
  }

  console.log('User ID:', user.id);
  const mainVersion = user.resumes[0]?.versions[0];
  if (!mainVersion) {
    console.log('No main version found');
    return;
  }

  console.log('Projects in DB:', JSON.stringify(mainVersion.projects, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
