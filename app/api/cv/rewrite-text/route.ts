import { auth } from "@/auth";
import { resolveUserId } from "@/lib/server/prisma";
import { NextResponse } from "next/server";
import { rewriteSelection, AIUnavailableError } from "@/lib/aiService";
import { checkRateLimit } from "@/lib/server/ratelimit";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  text: z.string().min(3).max(1500),
  action: z.enum(["improve", "shorten", "verbs", "tone"]),
  targetRole: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  const userId = await resolveUserId(session);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit check
  const limited = await checkRateLimit(userId, "regenerate");
  if (limited) return limited;

  try {
    const body = await req.json();
    const { text, action, targetRole } = schema.parse(body);

    const rewritten = await rewriteSelection(text, action, targetRole || "Software Engineer");

    return NextResponse.json({ rewritten });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    if (error instanceof AIUnavailableError) {
      if (error.reason === "LIMIT") {
        return NextResponse.json({ error: "AI_LIMIT", message: "Daily AI limit reached" }, { status: 429 });
      }
      return NextResponse.json({ error: "AI_UNAVAILABLE", message: "AI is busy, please try again in a moment" }, { status: 503 });
    }
    if (error?.message === "AI_DAILY_LIMIT_EXCEEDED" || error?.message === "AI_QUOTA_EXCEEDED") {
      return NextResponse.json({ error: "AI_LIMIT", message: "Daily AI limit reached" }, { status: 429 });
    }
    console.error("AI Text Rewrite Error:", error);
    return NextResponse.json({ error: error.message || "Failed to rewrite text" }, { status: 500 });
  }
}
