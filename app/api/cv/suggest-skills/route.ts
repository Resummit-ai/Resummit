import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { suggestSkills } from "@/lib/aiService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projects, existing } = await req.json();

    const data = await suggestSkills(projects, existing);

    return NextResponse.json({ skills: data });
  } catch (error: any) {
    console.error("AI Skill Suggestion Error:", error);
    return NextResponse.json({ error: error.message || "Failed to suggest skills" }, { status: 500 });
  }
}
