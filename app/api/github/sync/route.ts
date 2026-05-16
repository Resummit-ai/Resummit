import { auth } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import { runSmartSync } from "@/lib/suggestionEngine";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch user's GitHub data to get token
    const githubData = await prisma.gitHubData.findUnique({
      where: { userId: session.user.id }
    });

    const token = (session.user as any).accessToken || githubData?.accessToken;

    if (!token) {
      return NextResponse.json({ error: "GitHub access token unavailable. Please re-login." }, { status: 400 });
    }

    console.log("[SYNC] Starting manual sync for user:", session.user.id);
    const result = await runSmartSync(session.user.id, token, session.user.email || undefined);

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
