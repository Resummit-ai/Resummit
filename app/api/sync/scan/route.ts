import { auth } from "@/auth";
import { runSmartSync } from "@/lib/suggestionEngine";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { accessToken } = await req.json();
    if (!accessToken) {
       return NextResponse.json({ error: "GitHub access token required" }, { status: 400 });
    }

    const result = await runSmartSync(session.user.id, accessToken, session.user.email || undefined);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Scan API Error:", error);
    return NextResponse.json({ error: error.message || "Scan failed" }, { status: 500 });
  }
}
