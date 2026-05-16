require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

// Copy logic from lib/github.ts to see exactly how it scores
function daysSince(dateString) {
  return (Date.now() - new Date(dateString).getTime()) / (1000 * 3600 * 24);
}

function scoreRepo(repo) {
  const recencyScore = Math.max(0, 450 - daysSince(repo.updated_at)) / 10;
  const desc = (repo.description || "").toLowerCase();
  const keywords = ["ml", "ai", "api", "cloud", "system", "automation", "dashboard", "fullstack", "backend"];
  const kwBonus = Math.min(5, keywords.filter(kw => desc.includes(kw)).length);

  return (
    (repo.stargazers_count || 0) * 2 + 
    (repo.forks_count || 0) * 2 +
    (repo.description?.length || 0) * 0.1 +
    recencyScore +
    kwBonus
  );
}

async function check() {
  const user = await prisma.user.findFirst({
    where: { email: 'adelmuhammed786@gmail.com' },
    include: { githubData: true }
  });

  const repos = JSON.parse(user.githubData.repositories);
  for (const r of repos) {
    const score = scoreRepo(r);
    console.log(`Repo: ${r.name} - Score: ${score.toFixed(2)} - Updated: ${r.updated_at}`);
  }
}

check().then(() => prisma.$disconnect());
