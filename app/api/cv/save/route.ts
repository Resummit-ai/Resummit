import { auth } from "@/auth";
import { prisma, resolveUserId } from "@/lib/server/prisma";
import { validateCVText } from "@/lib/github";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/cv/save
 * Flexible save endpoint that supports:
 * 1. Full data sync (via cvSchema)
 * 2. Partial updates (via updates field)
 */
export async function POST(req: Request) {
  const session = await auth();
  const userId = await resolveUserId(session);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { versionId, data, updates } = body;

    if (!versionId) {
      return NextResponse.json({ error: "versionId is required" }, { status: 400 });
    }

    let prismaData: any = {};

    // Handle full 'data' object (standard editor save)
    if (data) {
      prismaData = {
        personalInfo: data.personalInfo,
        summary: data.summary,
        skills: typeof data.skills === 'string' ? JSON.parse(data.skills) : data.skills,
        experience: data.experience,
        projects: data.projects,
        education: data.education,
        atsScore: data.atsScore || 0,
      };
    } 
    // Handle partial 'updates' object (auto-integrity save)
    else if (updates) {
      if (updates.skills) prismaData.skills = typeof updates.skills === 'string' ? JSON.parse(updates.skills) : updates.skills;
      if (updates.summary) prismaData.summary = updates.summary;
      if (updates.personalInfo) prismaData.personalInfo = updates.personalInfo;
      if (updates.experience) prismaData.experience = updates.experience;
      if (updates.projects) prismaData.projects = updates.projects;
      if (updates.education) prismaData.education = updates.education;
    } else {
      return NextResponse.json({ error: "No data or updates provided" }, { status: 400 });
    }

    // Update ResumeVersion
    await prisma.resumeVersion.update({
      where: { id: versionId },
      data: prismaData
    });

    // Run quality validation on the current state if it's a full save
    let warnings: string[] = [];
    if (data) {
      const allText = [
        data.summary || "",
        ...(data.experience || []).flatMap((e: any) => [e.title, e.company, ...(e.bullets || [])]),
        ...(data.projects || []).flatMap((p: any) => [p.title, ...(p.highlights || [])]),
      ].join(" ");
      warnings = validateCVText(allText);
    }

    return NextResponse.json({ success: true, warnings });
  } catch (error: any) {
    console.error("[SAVE] Server Error:", error);
    return NextResponse.json({ error: error.message || "Failed to save" }, { status: 500 });
  }
}
