import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { suggestSkills } from "@/lib/aiService";
import { withCache } from "@/lib/server/cache";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  projects: z.array(z.any()),
  existing: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { projects, existing } = schema.parse(body);

    const data = await withCache(
      "suggest-skills",
      { projects, existing },
      () => suggestSkills(projects, existing)
    );

    return NextResponse.json({ skills: data });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("AI Skill Suggestion Error:", error);
    return NextResponse.json({ error: error.message || "Failed to suggest skills" }, { status: 500 });
  }
}
