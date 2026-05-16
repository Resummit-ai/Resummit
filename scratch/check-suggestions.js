require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

async function check() {
  const suggestions = await prisma.suggestion.findMany({
    where: { userId: 'cmp1c8ru80000veokvpc75odm' }
  });

  console.log('Suggestions:', JSON.stringify(suggestions.map(s => ({
    id: s.id,
    type: s.type,
    title: s.title,
    status: s.status,
    proposedData: JSON.parse(s.proposedData)
  })), null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
