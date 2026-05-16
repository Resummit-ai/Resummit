require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

async function check() {
  const user = await prisma.user.findFirst({
    where: { email: 'adelmuhammed786@gmail.com' },
    include: { githubData: true }
  });

  if (!user.githubData) {
    console.log('NO GITHUB DATA RECORD IN DB!');
    return;
  }

  console.log('Token exists:', !!user.githubData.accessToken);
  console.log('Token length:', user.githubData.accessToken?.length);
  console.log('Last Synced At:', user.githubData.lastSyncedAt);
}

check().then(() => prisma.$disconnect());
