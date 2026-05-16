import { auth } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projectUpdate = await req.json();
    const projectId = params.id;

    const mainVersion = await prisma.resumeVersion.findFirst({
      where: { 
        resume: { userId: session.user.id },
        isMain: true 
      }
    });

    if (!mainVersion) {
      return NextResponse.json({ error: "Main version not found" }, { status: 404 });
    }

    const currentProjects = Array.isArray(mainVersion.projects) ? mainVersion.projects : [];
    const updatedProjects = currentProjects.map((p: any) => 
      p.id === projectId ? { ...p, ...projectUpdate } : p
    );

    await prisma.resumeVersion.update({
      where: { id: mainVersion.id },
      data: { projects: updatedProjects as any }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
