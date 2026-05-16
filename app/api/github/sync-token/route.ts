import { auth } from "@/auth";
import { prisma, resolveUserId } from "@/lib/server/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { accessToken } = await req.json();
    const userId = await resolveUserId(session);

    if (!userId) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await prisma.gitHubData.upsert({
      where: { userId },
      update: { accessToken },
      create: {
        userId,
        accessToken,
        repositories: [],
        signals: {},
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
