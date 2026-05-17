import { auth } from "@/auth";
import { prisma, resolveUserId } from "@/lib/server/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  const userId = await resolveUserId(session);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Suggestion ID is required" }, { status: 400 });
    }

    await prisma.suggestion.update({
      where: { id, userId: userId },
      data: { status: "DISCARDED" }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[SUGGESTIONS] Discard error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
