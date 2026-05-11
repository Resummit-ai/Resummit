import { auth } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LANGUAGE_OVERRIDES: Record<string, string> = {
  'jupyter notebook': 'Python',
  'jupyter': 'Python',
  'markdown': 'Documentation',
  'html': 'HTML/CSS',
  'shell': 'Bash',
  'dockerfile': 'Docker',
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { summary, skills, experience, projects: rawProjects } = await req.json();
    console.log('[DEBUG skills raw]', JSON.stringify(skills))

    // Normalization & Safe Unwrapping
    let skillsData = skills
    if (skillsData?.skills) skillsData = skillsData.skills

    const skillsString = JSON.stringify({
      languages: skillsData?.languages || [],
      frameworks: skillsData?.frameworks || [],
      tools: (skillsData?.tools?.length || 0) > 0 ? skillsData.tools : ['Git'],
    })

    const normalizedProjects = (rawProjects || []).map((p: any) => ({
      ...p,
      tech: LANGUAGE_OVERRIDES[p.tech?.toLowerCase()] || p.tech
    }))

    // Ensure the NextAuth session user exists in the Prisma SQLite database
    const userDb = await prisma.user.upsert({
      where: { id: session.user.id! },
      update: {},
      create: {
        id: session.user.id!,
        name: session.user.name || "GitHub User",
        email: session.user.email || null,
      }
    });

    // Upsert the CV state with newly generated AI context
    await prisma.cV.upsert({
      where: { userId: session.user.id! },
      update: {
        summary: summary || "",
        skills: skillsString,
        experience: experience ? JSON.stringify(experience) : "[]",
      },
      create: {
        userId: session.user.id!,
        name: userDb.name || "",
        email: userDb.email || "",
        summary: summary || "",
        skills: skillsString,
        experience: experience ? JSON.stringify(experience) : "[]",
        targetRole: "Software Engineer",
      }
    });

    // TEMPORARY FIX: Wipe ALL existing projects to clear the bugged 18-project state 
    // from the previous engine. (The previous bugs inserted them as "USER").
    await prisma.project.deleteMany({
      where: { userId: session.user.id! }
    });

    // Capacity check: Max 3 total projects
    const userProjectsCount = await prisma.project.count({
      where: { userId: session.user.id!, lastEditedBy: "USER" }
    });

    const remainingSlots = Math.max(0, 3 - userProjectsCount);
    const projectsToInsert = normalizedProjects.slice(0, remainingSlots);

    // Create projects in bulk for the user
    const createOperations = projectsToInsert.map((p: any) =>
      prisma.project.create({
        data: {
          userId: session.user.id!,
          name: p.projectName || p.name,
          description: p.description || "",
          techStack: p.tech || p.techStack || "",
          bullets: JSON.stringify(p.bullets || []),
          repoUrl: p.repoUrl || null,
          lastEditedBy: "AI"
        },
      })
    );

    await Promise.all(createOperations);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Save Sync Error:", error);
    return NextResponse.json({ error: "Failed to save projects" }, { status: 500 });
  }
}
