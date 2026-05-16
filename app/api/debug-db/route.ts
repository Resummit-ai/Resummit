import { prisma } from "@/lib/server/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'adelmuhammed786@gmail.com' },
      include: {
        resumes: {
          include: {
            versions: {
              where: { isMain: true }
            }
          }
        },
        suggestions: true,
      }
    });

    if (!user) return NextResponse.json({ error: "User not found" });

    const mainVersion = user.resumes[0]?.versions[0];
    
    return NextResponse.json({
      projectsType: typeof mainVersion?.projects,
      projectsIsArray: Array.isArray(mainVersion?.projects),
      projects: mainVersion?.projects,
      suggestionsCount: user.suggestions.length,
      suggestions: user.suggestions.map(s => s.title)
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
