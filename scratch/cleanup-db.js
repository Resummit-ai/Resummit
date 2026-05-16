require('dotenv').config();
const { prisma } = require('../lib/server/db.js');

async function cleanup() {
  const resumeVersions = await prisma.resumeVersion.findMany();

  for (const rv of resumeVersions) {
    let projects = rv.projects;
    
    // 1. If it's a string, try to parse it
    if (typeof projects === 'string') {
      try {
        projects = JSON.parse(projects);
      } catch (e) {
        console.log(`Could not parse projects for ${rv.id}`);
        continue;
      }
    }

    if (!Array.isArray(projects)) continue;

    // 2. Normalize and Deduplicate
    const uniqueTitles = new Set();
    const cleanProjects = [];

    for (const p of projects) {
      if (typeof p !== 'object' || p === null) continue;
      
      const title = (p.title || "Untitled Project").replace("New Project: ", "").trim();
      const lowerTitle = title.toLowerCase();
      
      if (uniqueTitles.has(lowerTitle)) continue;
      if (title === "New Skills Detected") continue;

      uniqueTitles.add(lowerTitle);
      cleanProjects.push({
        ...p,
        title,
        techStack: Array.isArray(p.techStack) ? p.techStack : (p.techStack ? [p.techStack] : []),
        highlights: Array.isArray(p.highlights) ? p.highlights : (p.bullets ? p.bullets : (p.description ? [p.description] : []))
      });
    }

    // 3. Save back
    await prisma.resumeVersion.update({
      where: { id: rv.id },
      data: { projects: cleanProjects }
    });
    
    console.log(`Cleaned projects for version ${rv.id}. Count: ${cleanProjects.length}`);
  }
}

cleanup().catch(console.error).finally(() => prisma.$disconnect());
