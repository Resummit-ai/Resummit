const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProjects() {
  const user = await prisma.user.findUnique({
    where: { email: 'adelmuhammed786@gmail.com' },
    include: {
      resumes: {
        include: {
          versions: {
            where: { isMain: true }
          }
        }
      },
      githubData: true,
      suggestions: true,
    }
  });

  console.log("User:", user?.email);
  if (user?.resumes?.length > 0) {
    const mainVersion = user.resumes[0].versions[0];
    console.log("Main Version Projects:", JSON.stringify(mainVersion?.projects, null, 2));
    console.log("Main Version ID:", mainVersion?.id);
  } else {
    console.log("No resumes found");
  }

  console.log("GitHubData present:", !!user?.githubData);
  if (user?.githubData) {
    console.log("GitHub Repos count:", user.githubData.repositories?.length);
  }

  console.log("Suggestions:", user?.suggestions?.length);

  await prisma.$disconnect();
}

checkProjects().catch(console.error);
