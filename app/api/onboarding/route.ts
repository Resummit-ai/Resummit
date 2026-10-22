import { auth } from "@/auth";
import { prisma, resolveUserId } from "@/lib/server/prisma";
import { NextResponse } from "next/server";
import { generateCVFromRepos } from "@/lib/aiService";
import { generateEngineeringSignals } from "@/lib/server/githubIntelligence";
import { encryptToken } from "@/lib/server/crypto";
import { logger } from "@/lib/server/logger";
import axios from "axios";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  const userId = await resolveUserId(session);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const github = body.github || "";
    const linkedin = body.linkedin || "";
    const role = body.role || "Software Engineer";
    const exp = body.exp || "MID";

    // 2. Fetch GitHub repos (Initial sync)
    let repos: any[] = [];
    let username = github;

    const accessToken = (session?.user as any)?.accessToken;
    if (accessToken) {
      try {
        // Fetch user profile to get exact username if not provided
        if (!username || username === "github_username") {
          const userRes = await axios.get("https://api.github.com/user", {
            headers: { Authorization: `token ${accessToken}` }
          });
          username = userRes.data.login;
        }

        // Fetch user's own repos
        const reposRes = await axios.get("https://api.github.com/user/repos?sort=updated&per_page=10", {
          headers: { Authorization: `token ${accessToken}` }
        });
        repos = reposRes.data;
      } catch (err) {
        logger.error("onboarding.github_token_error", err, { userId });
      }
    }

    if ((!repos || repos.length === 0) && username && username !== "github_username") {
      try {
        // Fallback to public repos if no token or token fails
        const githubRes = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
        repos = githubRes.data;
      } catch (err) {
        logger.error("onboarding.github_public_error", err, { username, userId });
      }
    }

    if (!Array.isArray(repos)) {
      repos = [];
    }

    const needsManualProjects = repos.length === 0;

    // 1. Update user profile with exact resolved username
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        githubUsername: username || github,
        linkedinUrl: linkedin,
        targetRole: role,
        experienceLevel: exp,
      }
    });

    // 3. Generate Signals & Intelligence (only if repos exist)
    const signals = repos.length > 0 ? await generateEngineeringSignals(repos, role) : null;

    const rawToken = (session?.user as any)?.accessToken;
    const encryptedToken = rawToken ? encryptToken(rawToken) : null;

    // 4. Save repositories to GitHubData
    await prisma.gitHubData.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        repositories: repos,
        signals: signals as any,
        accessToken: encryptedToken,
        lastSyncedAt: new Date(),
      },
      update: {
        repositories: repos,
        signals: signals as any,
        accessToken: encryptedToken,
        lastSyncedAt: new Date(),
      }
    });

    // 4. Generate Initial Resume
    const generated = repos.length > 0
      ? await generateCVFromRepos(repos, role)
      : { summary: "", skills: { languages: [], frameworks: [], tools: [] }, projects: [], needsReview: true };

    // 5. Create Resume and Version
    const primaryLanguage = generated.skills?.languages?.[0] || "TypeScript";
    
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
              github: github ? `github.com/${github}` : "",
              linkedin: linkedin || "",
            },
            summary: generated.summary,
            skills: generated.skills,
            projects: generated.projects,
            experience: [
              {
                company: "Tech Solutions Inc. (Example)",
                title: `Senior ${role}`,
                period: "2024 - Present",
                bullets: [
                  `Led a high-performing agile engineering team to design and deploy scalable backend applications using ${primaryLanguage}, reducing query latency by 35%.`,
                  `Engineered resilient automated service pipelines and database schemas, maintaining 99.99% system availability under heavy workload profiles.`,
                  `Optimized codebases and refactored core components into clean architectural divisions, reducing overall load bounds and enhancing developer experience.`
                ]
              },
              {
                company: "Innovative Tech Labs (Example)",
                title: `${role}`,
                period: "2022 - 2024",
                bullets: [
                  `Collaborated with product designers to build and deploy high-performance user-facing modules and responsive views.`,
                  `Designed and executed standard end-to-end and unit testing processes, boosting baseline code coverage metrics by 25%.`
                ]
              }
            ],
            education: [
              {
                degree: "Bachelor of Science in Computer Science (Example)",
                school: "State University of Technology",
                period: "2018 - 2022"
              }
            ],
            achievements: [
              "Recipient of the Engineering Excellence Award for outstanding contribution to platform scalability and structural optimization.",
              "Awarded First Place at the national Developer Innovation Hackathon for creating high-performance collaborative workspace solutions."
            ],
            isMain: true,
            atsScore: 0, // Will be scored in background or on first view
          }
        }
      }
    });

    return NextResponse.json({ success: true, needsManualProjects });
  } catch (error: any) {
    logger.error("onboarding.error", error, { userId });
    return NextResponse.json({ error: "Failed to complete onboarding" }, { status: 500 });
  }
}
