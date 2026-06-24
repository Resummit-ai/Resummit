import { auth } from "@/auth";
import { prisma, resolveUserId } from "@/lib/server/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const session = await auth();
  const userId = await resolveUserId(session);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const versionId = searchParams.get("versionId");

  if (!versionId) {
    return NextResponse.json({ error: "Missing versionId" }, { status: 400 });
  }

  try {
    // 1. Fetch version to make sure it belongs to the user and is NOT the main version
    const version = await prisma.resumeVersion.findFirst({
      where: {
        id: versionId,
        resume: { userId: userId }
      }
    });

    if (!version) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    if (version.isMain) {
      return NextResponse.json({ error: "Cannot delete the main version" }, { status: 400 });
    }

    // 2. Delete the version
    await prisma.resumeVersion.delete({
      where: { id: versionId }
    });

    // 3. Delete the associated JobTarget if no other versions reference it
    if (version.jobTargetId) {
      const otherVersionsCount = await prisma.resumeVersion.count({
        where: { jobTargetId: version.jobTargetId }
      });
      if (otherVersionsCount === 0) {
        await prisma.jobTarget.delete({
          where: { id: version.jobTargetId }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete version error:", error);
    return NextResponse.json({ error: "Failed to delete version" }, { status: 500 });
  }
}
