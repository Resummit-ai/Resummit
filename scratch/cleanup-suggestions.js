require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

async function cleanup() {
  const mainVersion = await prisma.resumeVersion.findFirst({
    where: { isMain: true }
  });

  if (!mainVersion) return;

  const currentSkillsData = typeof mainVersion.skills === 'string' ? JSON.parse(mainVersion.skills) : mainVersion.skills;
  const allCurrent = [
    ...(currentSkillsData.languages || []),
    ...(currentSkillsData.frameworks || []),
    ...(currentSkillsData.tools || [])
  ].map(s => s.toLowerCase().trim());

  console.log('Current Skills in CV:', allCurrent);

  const suggestions = await prisma.suggestion.findMany({
    where: { type: 'ADD_SKILL', status: 'PENDING' }
  });

  const seenInSuggestions = new Set();

  for (const s of suggestions) {
    const proposed = JSON.parse(s.proposedData);
    
    // Filter out skills that are already in the CV OR already seen in another suggestion in this cleanup run
    const filtered = {
      languages: (proposed.languages || []).filter(l => {
        const low = l.toLowerCase().trim();
        if (allCurrent.includes(low) || seenInSuggestions.has(low)) return false;
        seenInSuggestions.add(low);
        return true;
      }),
      frameworks: (proposed.frameworks || []).filter(f => {
        const low = f.toLowerCase().trim();
        if (allCurrent.includes(low) || seenInSuggestions.has(low)) return false;
        seenInSuggestions.add(low);
        return true;
      }),
      tools: (proposed.tools || []).filter(t => {
        const low = t.toLowerCase().trim();
        if (allCurrent.includes(low) || seenInSuggestions.has(low)) return false;
        seenInSuggestions.add(low);
        return true;
      })
    };

    const flatRemaining = Object.values(filtered).flat();

    if (flatRemaining.length === 0) {
      console.log(`Deleting redundant suggestion ${s.id}`);
      await prisma.suggestion.delete({ where: { id: s.id } });
    } else {
      const summary = flatRemaining.slice(0, 3).join(', ');
      const newTitle = `New Skills: ${summary}${flatRemaining.length > 3 ? '...' : ''}`;
      
      console.log(`Updating suggestion ${s.id}. New title: ${newTitle}`);
      await prisma.suggestion.update({
        where: { id: s.id },
        data: { 
          title: newTitle,
          proposedData: JSON.stringify(filtered)
        }
      });
    }
  }
}

cleanup().then(() => prisma.$disconnect());
