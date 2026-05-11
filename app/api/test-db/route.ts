import { prisma } from "@/lib/server/prisma";
import { NextResponse } from "next/server";

import { generateBatchBullets } from "@/lib/aiService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dummy = [{ name: "test-bot", description: "WhatsApp bot using Nodejs", techStack: "JavaScript" }];
    const res = await generateBatchBullets(dummy);
    return NextResponse.json({ status: "ok", res });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message, stack: error.stack }, { status: 500 });
  }
}
