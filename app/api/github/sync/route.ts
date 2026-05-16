import { auth } from "@/auth";
import { prisma, resolveUserId } from "@/lib/server/prisma";
import { runSmartSync } from "@/lib/suggestionEngine";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = await resolveUserId(session);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Could not resolve user identity" }, { status: 401 });
    }

    // 1. Fetch user's GitHub data to get token
    const githubData = await prisma.gitHubData.findUnique({
      where: { userId }
    });

    const token = (session.user as any).accessToken || githubData?.accessToken;

    if (!token) {
      return NextResponse.json({ error: "GitHub access token unavailable. Please re-login." }, { status: 400 });
    }

    console.log("[SYNC] Starting manual sync for user:", userId);
    const result = await runSmartSync(userId, token, session.user.email || undefined);

    return NextResponse.json({ 
      success: true, 
      count: (result as any).count || 0,
      skipped: (result as any).skipped || false
    });
  } catch (error: any) {
    console.error("[SYNC] Error during sync:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
