import { auth } from "@/auth";
import { callAI, safeParseJSON } from "@/lib/aiService";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { company, title, period, context } = await req.json();

    if (!company || !title) {
      return NextResponse.json({ error: "Company and title are required" }, { status: 400 });
    }

    const prompt = `Generate 3 professional resume bullets for a ${title} at ${company} (${period || "recent"}).

${context ? `Additional context provided by the user: "${context}"` : ""}

RULES:
- Start each bullet with a strong past/present action verb (Developed, Built, Implemented, Designed, Led, Automated, etc.)
- Each bullet must be under 20 words
- Include the specific technology or method used where possible
- At least one bullet must reference a measurable or logical outcome
- No buzzwords: leveraged, robust, scalable, streamlined, spearheaded, cutting-edge
- Do NOT start any bullet with "I"
- Return ONLY valid JSON, nothing else

{
  "bullets": [
    "Bullet one here.",
    "Bullet two here.",
    "Bullet three here."
  ]
}`;

    const raw = await callAI(prompt);
    const parsed = safeParseJSON(raw);

    const bullets: string[] = (parsed.bullets || [])
      .filter((b: string) => typeof b === "string" && b.trim().length > 0)
      .slice(0, 3);

    if (bullets.length === 0) {
      return NextResponse.json({ error: "AI returned no bullets" }, { status: 500 });
    }

    return NextResponse.json({ bullets });
  } catch (error: any) {
    console.error("[EXPERIENCE BULLETS] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
