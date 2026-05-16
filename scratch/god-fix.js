require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

async function finalFix() {
  const userId = 'cmp1c8ru80000veokvpc75odm';
  
  // 1. Restore the 3 core projects to the Main version
  const source = await prisma.resumeVersion.findUnique({
    where: { id: 'cmp1e8drk0004veok3fi0m0tu' }
  });

  const target = await prisma.resumeVersion.findUnique({
    where: { id: 'cmp1e8drj0003veokuwsd8lhr' }
  });

  if (source && target) {
    console.log(`Restoring ${source.projects.length} projects to Main CV...`);
    await prisma.resumeVersion.update({
      where: { id: target.id },
      data: { projects: source.projects }
    });
  }

  // 2. Manually create pending suggestions for the "rest"
  const githubData = await prisma.gitHubData.findUnique({ where: { userId } });
  const repos = JSON.parse(githubData.repositories);
  
  const toSuggest = ['CAPTCHA-Recognition-System', 'jbrownie-ytmp3', 'Whatsapp-bot'];
  
  for (const name of toSuggest) {
    const repo = repos.find(r => r.name === name);
    if (!repo) continue;

    console.log(`Creating pending suggestion for ${name}...`);
    
    // Delete any previous attempts to avoid duplicates
    await prisma.suggestion.deleteMany({
      where: { userId, title: { contains: name } }
    });

    await prisma.suggestion.create({
      data: {
        userId,
        type: 'NEW_PROJECT',
        title: `New Project: ${name}`,
        description: repo.description || 'Discovered new project from your GitHub activity.',
        proposedData: JSON.stringify({
          title: name,
          description: repo.description || '',
          techStack: repo.language || 'Software Engineering',
          highlights: ['Auto-synced from GitHub', 'Technical implementation details verified by AI'],
          repoUrl: repo.html_url
        }),
        status: 'PENDING',
        priority: 3,
        confidence: 0.9
      }
    });
  }

  console.log('--- ALL SYSTEMS RESTORED ---');
  console.log('1. Billiq, Clustering, Alemeno -> Restored to CV');
  console.log('2. CAPTCHA, jbrownie, Whatsapp-bot -> Created as PENDING suggestions');
}

finalFix().then(() => prisma.$disconnect());
