import { auth } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const mainVersion = await prisma.resumeVersion.findFirst({
      where: { 
        resume: { userId: session.user.id },
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
