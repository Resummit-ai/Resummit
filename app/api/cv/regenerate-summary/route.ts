import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { regenerateSummary } from "@/lib/aiService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projects, targetRole } = await req.json();

    const summary = await regenerateSummary(projects, targetRole || "Software Engineer");

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("AI Summary Regen Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate summary" }, { status: 500 });
  }
}
