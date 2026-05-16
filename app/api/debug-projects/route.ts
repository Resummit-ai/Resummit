import { prisma } from "@/lib/server/prisma";
import { NextResponse } from "next/server";
import { fetchUserRepos } from "@/lib/github";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'adelmuhammed786@gmail.com' },
      include: {
        githubData: true,
      }
    });

    if (!user?.githubData?.accessToken) {
      return NextResponse.json({ error: "No access token" });
    }

    const repos = await fetchUserRepos(user.githubData.accessToken);
    return NextResponse.json({
      reposFetched: repos.length,
      repos: repos.map(r => ({ name: r.name, language: r.language }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
