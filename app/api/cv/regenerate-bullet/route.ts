import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { regenerateBullet } from "@/lib/aiService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { bullet, projectName, tech, targetRole } = await req.json();

    const improvedBullet = await regenerateBullet(bullet, projectName, tech, targetRole || "Software Engineer");

    return NextResponse.json({ bullet: improvedBullet });
  } catch (error: any) {
    console.error("AI Bullet Regen Error:", error);
    return NextResponse.json({ error: error.message || "Failed to regenerate bullet" }, { status: 500 });
  }
}
