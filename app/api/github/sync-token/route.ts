import { auth } from "@/auth";
import { prisma, resolveUserId } from "@/lib/server/prisma";
import { encryptToken } from "@/lib/server/crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { accessToken } = await req.json();
    
    // resolveUserId now auto-creates the User if missing — preventing FK violations
    const userId = await resolveUserId(session);
    
    if (!userId) {
      console.warn("[GITHUB] sync-token: Could not resolve userId for session email:", session.user?.email);
      return NextResponse.json({ error: "User account not found. Please sign out and sign in again." }, { status: 404 });
    }

    console.log("[GITHUB] sync-token: syncing token for resolved userId:", userId);

    const encryptedToken = accessToken ? encryptToken(accessToken) : null;

    await prisma.gitHubData.upsert({
      where: { userId },
      update: { accessToken: encryptedToken },
      create: {
        userId,
        accessToken: encryptedToken,
        repositories: [],
        signals: {},
      }
    });

    console.log("[GITHUB] Token synced successfully for user:", userId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[GITHUB] sync-token error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// CACHE BUSTER
// ............
// ............
// ............
// ............
// ............
// ............
// ............
