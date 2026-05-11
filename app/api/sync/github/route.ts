import { auth } from "@/auth";
import { fetchUserRepos } from "@/lib/github";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const accessToken = (session?.user as any)?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const repos = await fetchUserRepos(accessToken);
    return NextResponse.json(repos);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch repos" }, { status: 500 });
  }
}
