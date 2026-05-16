require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

async function audit() {
  const rvs = await prisma.resumeVersion.findMany();
  console.log(`Found ${rvs.length} resume versions.`);

  for (const rv of rvs) {
    const skills = typeof rv.skills === 'string' ? JSON.parse(rv.skills) : rv.skills;
    const flat = [
      ...(skills.languages || []),
      ...(skills.frameworks || []),
      ...(skills.tools || [])
    ];
    console.log(`Version ${rv.id} (Main: ${rv.isMain}): ${flat.length} skills. [${flat.slice(0, 5).join(', ')}...]`);
  }
}

audit().then(() => prisma.$disconnect());
