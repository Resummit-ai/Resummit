import { auth } from "@/auth";
import { prisma, resolveUserId } from "@/lib/server/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  const userId = await resolveUserId(session);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { resumeId, sourceVersionId, startFromScratch } = await req.json();

    if (!resumeId) {
      return NextResponse.json({ error: "Missing resumeId" }, { status: 400 });
    }

    // 1. Fetch the source version
    let sourceVersion = null;
    if (sourceVersionId) {
      sourceVersion = await prisma.resumeVersion.findFirst({
        where: {
          id: sourceVersionId,
          resume: { id: resumeId, userId: userId }
        }
      });
    }

    // Fallback to main version if no sourceVersionId or version not found
    if (!sourceVersion) {
      sourceVersion = await prisma.resumeVersion.findFirst({
        where: {
          resume: { id: resumeId, userId: userId },
          isMain: true
        }
      });
    }

    if (!sourceVersion) {
      sourceVersion = await prisma.resumeVersion.findFirst({
        where: {
          resume: { userId: userId },
          isMain: true
        }
      });
    }

    if (!sourceVersion) {
      return NextResponse.json({ error: "Source resume version not found" }, { status: 404 });
    }

    // 2. Count existing tailored versions for name generation
    const tailoredCount = await prisma.resumeVersion.count({
      where: {
        resumeId: resumeId,
        isMain: false
      }
    });

    const newVersionName = `Tailored Position ${tailoredCount + 1}`;

    // 3. Create a new ResumeVersion copying the source content (or blanking fields if scratch)
    const newVersion = await prisma.resumeVersion.create({
      data: {
        resumeId: resumeId,
        versionName: newVersionName,
        isMain: false,
        personalInfo: sourceVersion.personalInfo || {},
        summary: startFromScratch ? "" : (sourceVersion.summary || ""),
        skills: startFromScratch ? { languages: [], frameworks: [], tools: [] } : (sourceVersion.skills || { languages: [], frameworks: [], tools: [] }),
        experience: startFromScratch ? [] : (sourceVersion.experience || []),
        projects: startFromScratch ? [] : (sourceVersion.projects || []),
        education: startFromScratch ? [] : (sourceVersion.education || []),
        achievements: startFromScratch ? [] : (sourceVersion.achievements || []),
        atsScore: 0,
        jobTargetId: null
      }
    });

    return NextResponse.json({
      success: true,
      versionId: newVersion.id,
      versionName: newVersion.versionName
    });

  } catch (error: any) {
    console.error("Create Version Error:", error);
    return NextResponse.json({ error: "Failed to create new resume version" }, { status: 500 });
  }
}
