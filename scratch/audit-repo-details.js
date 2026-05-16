require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

async function check() {
  const user = await prisma.user.findFirst({
    where: { email: 'adelmuhammed786@gmail.com' },
    include: { githubData: true }
  });

  const repos = JSON.parse(user.githubData.repositories);
  for (const r of repos) {
    console.log(`Repo: ${r.name}`);
    console.log(`  - Description: ${r.description}`);
    console.log(`  - Language: ${r.language}`);
    console.log(`  - Fork: ${r.fork}`);
  }
}

check().then(() => prisma.$disconnect());
