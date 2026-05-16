require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

async function fix() {
  const rvs = await prisma.resumeVersion.findMany({
    where: { isMain: true }
  });

  if (rvs.length <= 1) {
    console.log('No duplicate Main versions found.');
    return;
  }

  console.log(`Found ${rvs.length} duplicate Main versions. Cleaning up...`);

  // Sort by skill count descending
  const sorted = rvs.sort((a, b) => {
    const aSkills = typeof a.skills === 'string' ? JSON.parse(a.skills) : a.skills;
    const bSkills = typeof b.skills === 'string' ? JSON.parse(b.skills) : b.skills;
    const aCount = Object.values(aSkills).flat().length;
    const bCount = Object.values(bSkills).flat().length;
    return bCount - aCount;
  });

  const keep = sorted[0];
  const discard = sorted.slice(1);

  for (const rv of discard) {
    console.log(`Unmarking version ${rv.id} as Main (it only had ${Object.values(typeof rv.skills === 'string' ? JSON.parse(rv.skills) : rv.skills).flat().length} skills)`);
    await prisma.resumeVersion.update({
      where: { id: rv.id },
      data: { isMain: false }
    });
  }

  console.log(`Kept version ${keep.id} as the single Main version.`);
}

fix().then(() => prisma.$disconnect());
