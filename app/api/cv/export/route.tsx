import { auth } from "@/auth";
import { prisma, resolveUserId } from "@/lib/server/prisma";
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import React from "react";
import { CVDocument } from "./CVDocument"; // We will create this component

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await auth();
  const userId = await resolveUserId(session);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { cv, projects } = await req.json();

    if (!cv) {
      return NextResponse.json({ error: "No CV data provided" }, { status: 400 });
    }

    const stream = await renderToStream(<CVDocument cv={cv} projects={projects} />);

    // Convert stream to standard response
    return new Response(stream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${cv.name.replace(/\s+/g, '_')}_resume.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("PDF Export Error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
