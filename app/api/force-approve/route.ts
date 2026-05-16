import { prisma } from "@/lib/server/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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
        suggestions: {
          where: { type: 'NEW_PROJECT' },
          orderBy: { priority: 'desc' }
        }
      }
    });

    if (!user) return NextResponse.json({ error: "User not found" });

    const mainVersion = user.resumes[0]?.versions[0];
    if (!mainVersion) return NextResponse.json({ error: "No main version" });

    let currentProjects: any[] = [];
    if (Array.isArray(mainVersion.projects)) {
      currentProjects = mainVersion.projects;
    } else if (typeof mainVersion.projects === 'string') {
      try { currentProjects = JSON.parse(mainVersion.projects); } catch { currentProjects = []; }
    }

    const uniqueProjects = new Map<string, any>();
    
    // Auto-approve top 3 unique projects
    for (const sug of user.suggestions) {
      if (uniqueProjects.size >= 3) break;
      
      try {
        const parsedData = JSON.parse(sug.proposedData);
        const title = parsedData.title || parsedData.name;
        if (title && !uniqueProjects.has(title)) {
           // Ensure it has an ID
           if (!parsedData.id) parsedData.id = Math.random().toString(36).substring(7);
           uniqueProjects.set(title, parsedData);
        }
      } catch (e) {
        console.error("Failed to parse suggestion", sug.id);
      }
    }

    const projectsToAdd = Array.from(uniqueProjects.values());
    const finalProjects = [...currentProjects, ...projectsToAdd].slice(0, 3); // Max 3 projects

    // Save to DB
    await prisma.resumeVersion.update({
      where: { id: mainVersion.id },
      data: {
        projects: finalProjects as any
      }
    });

    // Clear all pending suggestions so the UI isn't cluttered
    await prisma.suggestion.deleteMany({
      where: { userId: user.id }
    });

    return NextResponse.json({ 
      success: true, 
      added: projectsToAdd.length,
      finalCount: finalProjects.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
