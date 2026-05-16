require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

async function audit() {
  const users = await prisma.user.findMany({
    include: { githubData: true }
  });

  console.log(`Total users in DB: ${users.length}`);

  for (const u of users) {
    console.log(`User: ${u.email} (ID: ${u.id})`);
    console.log(`  - GitHubData: ${u.githubData ? 'YES' : 'NO'}`);
    if (u.githubData) {
      console.log(`  - Token Exists: ${!!u.githubData.accessToken}`);
      console.log(`  - Last Synced: ${u.githubData.lastSyncedAt}`);
    }
  }
}

audit().then(() => prisma.$disconnect());
