import { auth } from "@/auth";
import { generateCVFromRepos } from "@/lib/aiService";
import { extractDeterministicSkills } from "@/lib/github";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projects } = await req.json();
    
    if (!projects || projects.length === 0) {
      return NextResponse.json({ error: "No high-quality GitHub projects passed the strict filtering." }, { status: 400 });
    }
    
    // Use the new centralized hybrid AI service
    const result = await generateCVFromRepos(projects);
    const deterministicSkills = extractDeterministicSkills(projects);
    
    // Enrich with original metadata (repoUrl, etc)
    const enrichedProjects = result.projects.map((res: any) => {
      const original = projects.find((p: any) => p.name === res.name);
      return {
        ...res,
        projectName: res.name,
        repoUrl: original?.html_url || null,
        techStack: original?.language || res.tech || "General",
        description: original?.description || "",
      };
    });

    return NextResponse.json({
      summary: result.summary,
      skills: deterministicSkills,
      experience: [], // Experience is manually managed by user
      projects: enrichedProjects
    });
  } catch (error: any) {
    console.error("Sync AI Error:", error);
    // Return specific quota error if detected
    const errorMessage = error.message === 'AI_QUOTA_EXCEEDED' ? 'AI_QUOTA_EXCEEDED' : (error.message || "AI Sync failed");
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
