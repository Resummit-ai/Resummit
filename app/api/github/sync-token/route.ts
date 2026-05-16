import { auth } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized - No email found" }, { status: 401 });
  }

  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const { resolveUserId } = await import("@/lib/server/prisma");
    const userId = await resolveUserId(session);

    if (!userId) {
      return NextResponse.json({ error: "User record not found in database" }, { status: 404 });
    }

    await prisma.gitHubData.upsert({
      where: { userId: userId },
      update: { accessToken },
      create: {
        userId: userId,
        accessToken,
        repositories: [],
        signals: {},
      }
    });

    console.log("[GITHUB] Token synced successfully for user:", userId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[GITHUB] Token sync error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
