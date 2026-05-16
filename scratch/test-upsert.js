require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

async function test() {
  try {
    const res = await prisma.gitHubData.upsert({
      where: { userId: 'cmp1c8ru80000veokvpc75odm' },
      update: { accessToken: 'test-token' },
      create: {
        userId: 'cmp1c8ru80000veokvpc75odm',
        accessToken: 'test-token',
        repositories: [],
        signals: {},
      }
    });
    console.log('Success:', res.userId);
  } catch (e) {
    console.error('Error detail:', e);
  }
}

test().then(() => prisma.$disconnect());
