import { auth } from "@/auth";
import { prisma, resolveUserId } from "@/lib/server/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();
  const userId = await resolveUserId(session);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const mainVersion = await prisma.resumeVersion.findFirst({
      where: { 
        resume: { userId: userId },
        isMain: true 
      },
      select: { projects: true }
    });

    return NextResponse.json({ 
      projects: Array.isArray(mainVersion?.projects) ? mainVersion.projects : [] 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
