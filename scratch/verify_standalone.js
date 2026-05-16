const { prisma } = require("../lib/server/db.js");

async function verify() {
  const userId = 'cmp1c8ru80000veokvpc75odm';
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { suggestions: true, resumes: { include: { versions: { where: { isMain: true } } } }, githubData: true }
  });

  if (!user.githubData?.repositories) {
    console.log("No repository cache found.");
    return;
  }

  const mainVersion = user.resumes[0].versions[0];
  const currentProjects = mainVersion.projects || [];
  const repos = JSON.parse(user.githubData.repositories);

  const now = new Date();
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  const scoredRepos = repos.map(repo => {
    const updatedDate = new Date(repo.updated_at);
    const score = 
      (repo.stargazers_count * 2) + 
      (updatedDate > oneYearAgo ? 10 : 0) + 
      ((repo.description?.length || 0) > 20 ? 5 : 0);
    
    return { ...repo, score };
  });

  const meaningfulRepos = scoredRepos.filter(r => r.score > 0);
  console.log(`Meaningful repos found in cache: ${meaningfulRepos.length}`);

  const suggestionsToCreate = [];
  for (const repo of meaningfulRepos) {
    const existingPending = user.suggestions.find(s => 
      s.status === "PENDING" && s.title.toLowerCase().includes(repo.name.toLowerCase())
    );
    if (existingPending) continue;

    const existingProject = currentProjects.find(p => 
      p.repoUrl?.toLowerCase().includes(repo.name.toLowerCase()) || 
      p.name?.toLowerCase() === repo.name.toLowerCase() ||
      p.title?.toLowerCase() === repo.name.toLowerCase()
    );

    if (!existingProject) {
      suggestionsToCreate.push({ name: repo.name, score: repo.score, updatedAt: repo.updated_at });
    }
  }

  console.log(`\nWould suggest these NEW projects (${suggestionsToCreate.length}):`);
  suggestionsToCreate.sort((a,b) => b.score - a.score).forEach(s => 
    console.log(`- ${s.name} (Score: ${s.score}, Updated: ${s.updatedAt})`)
  );
}

verify().catch(console.error).finally(() => prisma.$disconnect());
