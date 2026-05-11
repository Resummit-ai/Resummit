import { prisma } from "./server/prisma";
import { fetchUserRepos, GithubRepo } from "./github";
import { generateBatchBullets } from "./aiService";

export interface SuggestionScoring {
  stars: number;
  recentActivity: boolean; // updated in last 30 days
  descriptionQuality: boolean; // length > 50
  commitVolume?: number; // we might need more API calls for this, or use repo size as proxy
}

export async function runSmartSync(userId: string, accessToken: string) {
  // 1. Check Cooldown (6 hours)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { projects: true, suggestions: true }
  });

  if (!user) throw new Error("User not found");

  const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
  if (user.lastSyncAt && user.lastSyncAt > sixHoursAgo) {
    console.log("Sync cooldown active. Skipping...");
    return { skipped: true, reason: "COOLDOWN_ACTIVE" };
  }

  // 2. Fetch and Score Repos
  const repos = await fetchUserRepos(accessToken);
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const scoredRepos = repos.map(repo => {
    const updatedDate = new Date(repo.updated_at);
    const score = 
      (repo.stargazers_count * 2) + 
      (updatedDate > thirtyDaysAgo ? 10 : 0) + 
      ((repo.description?.length || 0) > 50 ? 5 : 0);
    
    return { ...repo, score };
  });

  // Filter for meaningful threshold (e.g. score > 5)
  const meaningfulRepos = scoredRepos.filter(r => r.score > 5);

  // 3. Compare with DB (Look for NEW or SIGNIFICANTLY MODIFIED)
  const suggestionsToCreate: any[] = [];
  
  for (const repo of meaningfulRepos) {
    // Skip if we already have a PENDING suggestion for this repo
    const existingSuggestion = user.suggestions.find(s => s.title.includes(repo.name) && s.status === "PENDING");
    if (existingSuggestion) continue;

    const existingProject = user.projects.find(p => p.repoUrl?.includes(repo.name) || p.name === repo.name);

    if (!existingProject) {
      // NEW PROJECT Suggestion
      suggestionsToCreate.push({
        type: "NEW_PROJECT",
        title: `New Project: ${repo.name}`,
        description: `Detected a high-quality project with ${repo.stargazers_count} stars and recent activity.`,
        proposedData: repo, // We will process this with AI before saving
        priority: 3,
        confidence: 0.9,
      });
    } else {
      // Check if description changed significantly
      const descChanged = repo.description && existingProject.description !== repo.description;
      const updatedRecently = new Date(repo.updated_at) > new Date(existingProject.createdAt); // Simplified

      if (descChanged || updatedRecently) {
        suggestionsToCreate.push({
          type: "IMPROVE_PROJECT",
          entityId: existingProject.id,
          title: `Update ${repo.name}`,
          description: `Activity detected on ${repo.name}. Suggested bullet improvements.`,
          proposedData: repo,
          currentData: { name: existingProject.name, bullets: JSON.parse(existingProject.bullets) },
          priority: 2,
          confidence: 0.85,
        });
      }
    }
  }

  // 4. Batch Process Top 3 with AI
  const topSuggestions = suggestionsToCreate
    .sort((a, b) => b.priority - a.priority || b.confidence - a.confidence)
    .slice(0, 3);

  for (const suggestion of topSuggestions) {
    const repo = suggestion.proposedData as GithubRepo;
    
    // Call AI to generate professional bullets for this repo specifically
    const aiResult = await generateBatchBullets([{
      name: repo.name,
      description: repo.description || "",
      techStack: repo.language || "Software Engineering"
    }]);

    const projectData = aiResult.projects[0];

    // SKILL FILTER: Filter out generic or already existing skills
    const filteredSkills = {
      languages: aiResult.skills.languages.filter(l => !user.cv?.skills.includes(l) && l.length > 1),
      frameworks: aiResult.skills.frameworks.filter(f => !user.cv?.skills.includes(f) && f.length > 2),
      tools: aiResult.skills.tools.filter(t => !["Git", "GitHub", "Programming", "Software"].includes(t))
    };

    // Add skill suggestion if meaningful new skills found
    if (Object.values(filteredSkills).flat().length > 0) {
      await prisma.suggestion.create({
        data: {
          userId: user.id,
          type: "ADD_SKILL",
          title: "New Skills Detected",
          description: `AI identified new technical capabilities from your recent activity: ${Object.values(filteredSkills).flat().slice(0, 3).join(", ")}`,
          proposedData: JSON.stringify(filteredSkills),
          priority: 1,
          confidence: 0.75,
          status: "PENDING"
        }
      });
    }

    // Finalize project suggestion record
    await prisma.suggestion.create({
      data: {
        userId: user.id,
        type: suggestion.type,
        entityId: suggestion.entityId,
        title: suggestion.title,
        description: suggestion.description,
        proposedData: JSON.stringify(projectData),
        currentData: suggestion.currentData ? JSON.stringify(suggestion.currentData) : null,
        priority: suggestion.priority,
        confidence: Math.min(0.95, (repo.score / 30) + 0.5), // Score-derived confidence
        status: "PENDING"
      }
    });
  }

  // 5. Update Last Sync Time
  await prisma.user.update({
    where: { id: user.id },
    data: { lastSyncAt: new Date() }
  });

  return { success: true, count: topSuggestions.length };
}
