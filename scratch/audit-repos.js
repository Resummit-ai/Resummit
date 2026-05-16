require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

async function check() {
  const user = await prisma.user.findFirst({
    where: { email: 'adelmuhammed786@gmail.com' },
    include: { githubData: true }
  });

  if (!user.githubData) {
    console.log('No GitHub data found.');
    return;
  }

  const repos = JSON.parse(user.githubData.repositories);
  console.log(`Total Repos Cached: ${repos.length}`);

  const scores = repos.map(repo => {
    const updatedDate = new Date(repo.updated_at);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const score = 
      (repo.stargazers_count * 2) + 
      (updatedDate > thirtyDaysAgo ? 10 : 0) + 
      ((repo.description?.length || 0) > 50 ? 5 : 0);
    return { name: repo.name, score };
  });

  console.log('Top 20 Scored Repos:');
  console.table(scores.sort((a, b) => b.score - a.score).slice(0, 20));
}

check().then(() => prisma.$disconnect());
