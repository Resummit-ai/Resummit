import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { regenerateSummary } from "@/lib/aiService";
import { withCache } from "@/lib/server/cache";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  projects: z.array(z.any()),
  targetRole: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { projects, targetRole } = schema.parse(body);

    const summary = await withCache(
      "summary",
      { projects, targetRole },
      () => regenerateSummary(projects, targetRole || "Software Engineer")
    );

    return NextResponse.json({ summary });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("AI Summary Regen Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate summary" }, { status: 500 });
  }
}
