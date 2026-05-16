import { auth } from "@/auth";
const { prisma } = require("@/lib/server/db.js");
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    await prisma.gitHubData.upsert({
      where: { userId: session.user.id },
      update: { accessToken },
      create: {
        userId: session.user.id,
        accessToken,
        repositories: [],
        signals: {},
      }
    });

    console.log("[GITHUB] Token synced from client for user:", session.user.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[GITHUB] Token sync error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
