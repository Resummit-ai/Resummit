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

    let userId = session.user.id;
    const email = session.user.email;

    // SELF-HEALING: If session.user.id is numeric (provider ID) instead of CUID, resolve correct DB ID
    if (!userId.startsWith("c") && email) {
      const dbUser = await prisma.user.findUnique({ where: { email } });
      if (dbUser) userId = dbUser.id;
    }

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

    console.log("[GITHUB] Token synced from client for user:", userId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[GITHUB] Token sync error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
