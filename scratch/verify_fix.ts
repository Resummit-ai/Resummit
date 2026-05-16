const { prisma } = require("../lib/server/db.js");
const { runSmartSync } = require("../lib/suggestionEngine.ts");

async function main() {
  const userId = 'cmp1c8ru80000veokvpc75odm';
  const githubData = await prisma.gitHubData.findUnique({ where: { userId } });
  
  if (!githubData?.accessToken) {
    console.log("No access token found for user.");
    return;
  }

  console.log("Running smart sync...");
  // Set NODE_ENV to development to bypass cooldown
  process.env.NODE_ENV = 'development';
  
  const result = await runSmartSync(userId, githubData.accessToken);
  console.log("Sync result:", result);

  const suggestions = await prisma.suggestion.findMany({
    where: { userId, status: "PENDING" }
  });

  console.log(`\nNew Pending Suggestions (${suggestions.length}):`);
  suggestions.forEach(s => console.log(`- ${s.title} (Conf: ${s.confidence})`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
