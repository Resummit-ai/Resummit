require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

async function check() {
  const suggestions = await prisma.suggestion.findMany({
    where: { 
      userId: 'cmp1c8ru80000veokvpc75odm',
      status: 'PENDING'
    }
  });

  console.log(`Total Pending Suggestions: ${suggestions.length}`);
  for (const s of suggestions) {
    console.log(`[${s.type}] ${s.title}`);
  }
}

check().then(() => prisma.$disconnect());
