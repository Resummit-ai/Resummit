require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

async function fix() {
  const suggestions = await prisma.suggestion.findMany({
    where: { 
      type: 'ADD_SKILL',
      status: 'PENDING'
    }
  });

  console.log(`Found ${suggestions.length} suggestions to fix`);

  for (const s of suggestions) {
    try {
      const skills = JSON.parse(s.proposedData);
      const flat = Object.values(skills).flat();
      
      if (flat.length === 0) continue;

      const summary = flat.slice(0, 3).join(', ');
      const newTitle = `New Skills: ${summary}${flat.length > 3 ? '...' : ''}`;

      await prisma.suggestion.update({
        where: { id: s.id },
        data: { title: newTitle }
      });

      console.log(`Updated ${s.id} -> ${newTitle}`);
    } catch (e) {
      console.error(`Error updating ${s.id}:`, e.message);
    }
  }
}

fix()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
