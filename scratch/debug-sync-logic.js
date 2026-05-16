require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

async function debugSync() {
  const user = await prisma.user.findFirst({
    where: { email: 'adelmuhammed786@gmail.com' },
    include: { suggestions: true }
  });

  const rv = await prisma.resumeVersion.findFirst({
    where: { isMain: true }
  });

  const currentProjects = Array.isArray(rv.projects) ? rv.projects : [];
  console.log(`DB Current Projects: ${currentProjects.length}`);

  const githubData = await prisma.gitHubData.findUnique({
    where: { userId: user.id }
  });

  const repos = JSON.parse(githubData.repositories);
  console.log(`Repos in cache: ${repos.length}`);

  const suggestionsToCreate = [];
  for (const repo of repos) {
    const existingSuggestion = user.suggestions.find(s => s.title.includes(repo.name));
    const existingProject = currentProjects.find(p => p.repoUrl?.includes(repo.name) || p.title === repo.name);

    console.log(`Repo: ${repo.name}`);
    console.log(`  - Existing Sug: ${!!existingSuggestion} (${existingSuggestion?.status})`);
    console.log(`  - Existing Proj: ${!!existingProject}`);

    if (!existingSuggestion && !existingProject) {
      suggestionsToCreate.push(repo.name);
    }
  }

  console.log('Would suggest these as NEW_PROJECT:', suggestionsToCreate);
}

debugSync().then(() => prisma.$disconnect());
