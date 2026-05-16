const { prisma } = require("../lib/server/db.js");

async function main() {
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'adelmuhammed786@gmail.com' },
      include: {
        resumes: {
          include: {
            versions: { where: { isMain: true }, take: 1 }
          }
        },
        suggestions: {
          where: { status: "PENDING" }
        }
      }
    });
    
    if (!user) return console.log("No user found.");
    
    const mainVersion = user.resumes[0]?.versions[0];
    if (!mainVersion) {
      console.log("No main resume version found for this user.");
    } else {
      let projects = [];
      if (Array.isArray(mainVersion.projects)) {
        projects = mainVersion.projects;
      } else if (typeof mainVersion.projects === 'string') {
        projects = JSON.parse(mainVersion.projects);
      }
      console.log(`Current projects in Resume (${projects.length}):`);
      projects.forEach(p => console.log(`- ${p.title || p.name}`));
    }
    
    const githubData = await prisma.gitHubData.findUnique({
       where: { userId: user.id }
    });
    if (githubData) {
      const repos = JSON.parse(githubData.repositories);
      console.log(`\nGitHub Repos in DB (${repos.length}):`);
      repos.forEach(r => console.log(`- ${r.name}`));
    }

    console.log(`\nPending Suggestions (${user.suggestions.length}):`);
    user.suggestions.forEach(s => console.log(`- ${s.title}`));

  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
