import { auth } from "@/auth";
import { prisma, resolveUserId } from "@/lib/server/prisma";
import { NextResponse } from "next/server";
import { regenerateBullet } from "@/lib/aiService";
import { withCache } from "@/lib/server/cache";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  bullet: z.string(),
  projectName: z.string(),
  tech: z.string().optional(),
  targetRole: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  const userId = await resolveUserId(session);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { bullet, projectName, tech, targetRole } = schema.parse(body);

    const improvedBullet = await withCache(
      "bullet",
      { bullet, projectName, tech, targetRole },
      () => regenerateBullet(bullet, projectName, tech || "", targetRole || "Software Engineer")
    );

    return NextResponse.json({ bullet: improvedBullet });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("AI Bullet Regen Error:", error);
    return NextResponse.json({ error: error.message || "Failed to regenerate bullet" }, { status: 500 });
  }
}
