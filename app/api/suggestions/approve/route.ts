import { auth } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    const suggestion = await prisma.suggestion.findUnique({
      where: { id, userId: session.user.id }
    });

    if (!suggestion) return NextResponse.json({ error: "Suggestion not found" }, { status: 404 });

    const data = JSON.parse(suggestion.proposedData);

    if (suggestion.type === "NEW_PROJECT") {
      await prisma.project.create({
        data: {
          userId: session.user.id,
          name: data.name,
          techStack: data.tech,
          bullets: JSON.stringify(data.bullets),
          repoUrl: data.repoUrl || "",
        }
      });
    } else if (suggestion.type === "IMPROVE_PROJECT" && suggestion.entityId) {
      await prisma.project.update({
        where: { id: suggestion.entityId },
        data: {
          name: data.name,
          techStack: data.tech,
          bullets: JSON.stringify(data.bullets),
        }
      });
    }

    // Mark as applied
    await prisma.suggestion.update({
      where: { id },
      data: { status: "APPLIED" }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
