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

    // RESOLVE CORRECT USER ID VIA EMAIL (The single source of truth)
    const dbUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User record not found in database" }, { status: 404 });
    }

    await prisma.gitHubData.upsert({
      where: { userId: dbUser.id },
      update: { accessToken },
      create: {
        userId: dbUser.id,
        accessToken,
        repositories: [],
        signals: {},
      }
    });

    console.log("[GITHUB] Token synced successfully for user:", dbUser.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[GITHUB] Token sync error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
