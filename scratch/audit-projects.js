require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

async function check() {
  const rvs = await prisma.resumeVersion.findMany();
  for (const rv of rvs) {
    console.log(`Version ${rv.id} (Main: ${rv.isMain}) projects count: ${Array.isArray(rv.projects) ? rv.projects.length : 'Not an array'}`);
    if (Array.isArray(rv.projects) && rv.projects.length > 0) {
      console.log('Sample titles:', rv.projects.slice(0, 3).map(p => p.title));
    }
  }
}

check().then(() => prisma.$disconnect());
