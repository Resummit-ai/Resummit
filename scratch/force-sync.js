require('dotenv').config();
const { prisma } = require('../lib/server/db.js');
const { runSmartSync } = require('../lib/suggestionEngine.js');

async function force() {
  const user = await prisma.user.findFirst({
    where: { email: 'adelmuhammed786@gmail.com' },
    include: { githubData: true }
  });

  if (!user) return;

  // Clear cooldown
  await prisma.gitHubData.update({
    where: { userId: user.id },
    data: { lastSyncedAt: new Date(0) }
  });

  console.log('Syncing for user...');
  const result = await runSmartSync(user.id, user.githubData.accessToken, user.email);
  console.log('Sync result:', result);
}

force().then(() => prisma.$disconnect());
