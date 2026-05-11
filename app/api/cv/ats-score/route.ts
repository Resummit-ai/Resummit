import { auth } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import { NextResponse } from "next/server";
import { calculateATSScore } from "@/lib/aiService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cv = await prisma.cV.findUnique({ where: { userId: session.user.id } });
    if (!cv || !cv.userId) {
      return NextResponse.json({ error: "No CV found" }, { status: 404 });
    }

    const projects = await prisma.project.findMany({ where: { userId: session.user.id } });

    const safeParse = (val: any, fallback: any = []) => {
      if (val === null || val === undefined) return fallback;
      if (Array.isArray(val) || (typeof val === 'object' && val !== null)) return val;
      if (typeof val === 'string' && val.trim().length > 0) {
        try {
          return JSON.parse(val);
        } catch (e) {
          return fallback;
        }
      }
      return fallback;
    };

    const parsedSkills = safeParse(cv.skills, { languages: [], frameworks: [], tools: [] });
    const parsedExp = safeParse(cv.experience, []);
    const parsedEdu = safeParse(cv.education, []);

    const cvText = `
Name: ${cv.name || "Anonymous"}
Target Role: ${cv.targetRole || "Software Engineer"}
Summary: ${cv.summary || "No summary provided."}

Skills:
Languages: ${(parsedSkills.languages || []).join(", ")}
Frameworks: ${(parsedSkills.frameworks || []).join(", ")}
Tools: ${(parsedSkills.tools || []).join(", ")}

Experience:
${parsedExp.map((e: any) => `${e.company || 'Company'} (${e.title || 'Role'}): ${e.period || 'Period'}\n- ${(e.bullets || []).join("\n- ")}`).join("\n\n")}

Education:
${parsedEdu.map((e: any) => `${e.school || 'School'} (${e.degree || 'Degree'}): ${e.year || 'Year'}`).join("\n\n")}

Projects:
${projects.map((p: any) => `${p.name || 'Untitled'} (${p.techStack || 'Unspecified'})\n- ${safeParse(p.bullets).join("\n- ")}`).join("\n\n")}
    `;

    const parsed = await calculateATSScore(cvText, cv.targetRole || "Software Engineer");

    await prisma.cV.update({
      where: { userId: session.user.id },
      data: { atsScore: parsed.score }
    });

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("[ATS] ERROR:", error);
    return NextResponse.json({ 
      score: 0,
      breakdown: { skills: 0, projects: 0, impact: 0, overall: 0 },
      weakSignals: ["SERVICE_BUSY"],
      topIssues: ["System is under heavy load"],
      quickFixes: ["Wait 30 seconds and refresh"],
      error: error.message || "Analysis failed"
    });
  }
}
