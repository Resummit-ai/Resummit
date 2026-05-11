import { auth } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { cv, projects, lastEditedBy } = await req.json();

    // 1. Update CV
    await prisma.cV.upsert({
      where: { userId: session.user.id },
      update: {
        name: cv.name || "",
        email: cv.email || "",
        github: cv.github || "",
        linkedin: cv.linkedin || "",
        phone: cv.phone || "",
        location: cv.location || "",
        summary: cv.summary || "",
        skills: JSON.stringify(cv.skills || { languages: [], frameworks: [], tools: [] }),
        targetRole: cv.targetRole || "Software Engineer",
        atsScore: cv.atsScore || 0,
        experience: JSON.stringify(cv.experience || []),
        education: JSON.stringify(cv.education || []),
        lastEditedBy: lastEditedBy || "AI",
        lastEditedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        name: cv.name || "",
        email: cv.email || "",
        github: cv.github || "",
        linkedin: cv.linkedin || "",
        phone: cv.phone || "",
        location: cv.location || "",
        summary: cv.summary || "",
        skills: JSON.stringify(cv.skills || { languages: [], frameworks: [], tools: [] }),
        targetRole: cv.targetRole || "Software Engineer",
        atsScore: cv.atsScore || 0,
        experience: JSON.stringify(cv.experience || []),
        education: JSON.stringify(cv.education || []),
        lastEditedBy: lastEditedBy || "AI",
      }
    });

    // 2. Update all projects
    if (Array.isArray(projects)) {
      const operations = projects.map((p: any) => {
        if (p.id && !p.id.toString().startsWith("temp-") && !p.id.toString().startsWith("t-")) {
          // Existing project
          return prisma.project.update({
            where: { id: p.id },
            data: {
              name: p.name,
              techStack: p.techStack,
              bullets: JSON.stringify(p.bullets),
              lastEditedBy: lastEditedBy || "AI",
              lastEditedAt: new Date(),
            }
          });
        } else {
          // New manual project added from UI
          return prisma.project.create({
            data: {
              userId: session.user.id!,
              name: p.name || "Untitled Project",
              techStack: p.techStack || "General",
              bullets: JSON.stringify(p.bullets || []),
              description: "",
              lastEditedBy: "USER",
            }
          });
        }
      });
      await Promise.all(operations);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("AutoSave Error:", error);
    return NextResponse.json({ error: "Failed to auto-save" }, { status: 500 });
  }
}
