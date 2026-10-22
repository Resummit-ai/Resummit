import { auth } from "@/auth";
import { prisma, resolveUserId } from "@/lib/server/prisma";
import { NextResponse } from "next/server";
import { regenerateSummary, AIUnavailableError } from "@/lib/aiService";
import { fetchRepoReadme } from "@/lib/github";
import { withCache } from "@/lib/server/cache";
import { checkRateLimit } from "@/lib/server/ratelimit";
import { decryptToken } from "@/lib/server/crypto";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  projects: z.array(z.any()),
  skills: z.any().optional(),
  experience: z.array(z.any()).optional(),
  targetRole: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  const userId = await resolveUserId(session);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 10 regenerations per hour per user
  const limited = await checkRateLimit(userId, "regenerate");
  if (limited) return limited;

  try {
    const body = await req.json();
    const { projects, skills, experience, targetRole } = schema.parse(body);

    let profileReadme = "";
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { githubUsername: true }
      });
      const githubUsername = user?.githubUsername;

      const githubData = await prisma.gitHubData.findUnique({
        where: { userId },
        select: { accessToken: true }
      });
      const rawToken = githubData?.accessToken;
      const accessToken = rawToken ? decryptToken(rawToken) : undefined;

      if (accessToken && githubUsername) {
        // A user's profile README is located in a repository named exactly after their username
        profileReadme = await fetchRepoReadme(accessToken, githubUsername, githubUsername);
      }
    } catch (e) {
      console.warn("Failed to fetch profile README:", e);
    }

    const summary = await withCache(
      "summary",
      { projects, skills, experience, targetRole, profileReadme },
      () => regenerateSummary(projects, skills, experience || [], targetRole || "Software Engineer", profileReadme)
    );

    return NextResponse.json({ summary });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    if (error instanceof AIUnavailableError) {
      if (error.reason === "LIMIT") {
        return NextResponse.json({ error: "AI_LIMIT", message: "Daily AI limit reached" }, { status: 429 });
      }
      return NextResponse.json({ error: "AI_UNAVAILABLE", message: "AI is busy, try again in a minute" }, { status: 503 });
    }
    if (error?.message === "AI_DAILY_LIMIT_EXCEEDED" || error?.message === "AI_QUOTA_EXCEEDED") {
      return NextResponse.json({ error: "AI_LIMIT", message: "Daily AI limit reached" }, { status: 429 });
    }
    console.error("AI Summary Regen Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate summary" }, { status: 500 });
  }
}
