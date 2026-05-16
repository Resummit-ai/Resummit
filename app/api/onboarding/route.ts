import { auth } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import { NextResponse } from "next/server";
import { generateCVFromRepos } from "@/lib/aiService";
import { generateEngineeringSignals } from "@/lib/server/githubIntelligence";
import axios from "axios";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { github, linkedin, role, exp } = await req.json();

    // 1. Update user profile
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        githubUsername: github,
        linkedinUrl: linkedin,
        targetRole: role,
        experienceLevel: exp,
      }
    });

    // 2. Fetch GitHub repos (Initial sync)
    const githubRes = await axios.get(`https://api.github.com/users/${github}/repos?sort=updated&per_page=10`, {
      headers: {
        Authorization: `token ${(session.user as any).accessToken}`,
      }
    });

    const repos = githubRes.data;

    // 3. Generate Signals & Intelligence
    const signals = await generateEngineeringSignals(repos, role);

    // 4. Save repositories to GitHubData
    await prisma.githubData.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        repositories: repos,
        signals: signals as any,
        accessToken: (session.user as any).accessToken,
        lastSyncedAt: new Date(),
      },
      update: {
        repositories: repos,
        signals: signals as any,
        accessToken: (session.user as any).accessToken,
        lastSyncedAt: new Date(),
      }
    });

    // 4. Generate Initial Resume
    const generated = await generateCVFromRepos(repos, role);

    // 5. Create Resume and Version
    await prisma.resume.create({
      data: {
        userId: user.id,
        name: `${role} Resume`,
        versions: {
          create: {
            versionName: "v1 (Auto-generated)",
            personalInfo: {
              name: user.name || "",
              email: user.email || "",
              targetRole: role,
              github: `github.com/${github}`,
              linkedin: linkedin || "",
            },
            summary: generated.summary,
            skills: generated.skills,
            projects: generated.projects,
            isMain: true,
            atsScore: 0, // Will be scored in background or on first view
          }
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Onboarding Error:", error);
    return NextResponse.json({ error: "Failed to complete onboarding" }, { status: 500 });
  }
}
