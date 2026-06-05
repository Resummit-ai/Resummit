import { auth } from "@/auth";
import { prisma, resolveUserId } from "@/lib/server/prisma";
import { validateCVText } from "@/lib/github";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/server/ratelimit";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Validation schemas ────────────────────────────────────────────────────────
const MAX_STR   = (n: number) => z.string().max(n);
const skillsSchema = z.object({
  languages:  z.array(MAX_STR(60)).max(25),
  frameworks: z.array(MAX_STR(60)).max(25),
  tools:      z.array(MAX_STR(60)).max(25),
});

const projectSchema = z.object({
  title:      MAX_STR(200).optional(),
  name:       MAX_STR(200).optional(),
  techStack:  z.array(MAX_STR(60)).max(15).optional(),
  description: MAX_STR(1000).optional(),
  highlights: z.array(MAX_STR(600)).max(8).optional(),
  bullets:    z.array(MAX_STR(600)).max(8).optional(),
  repoUrl:    z.string().url().optional().or(z.literal("")),
  aiGenerated: z.boolean().optional(),
}).passthrough(); // allow extra fields for forward compat

const experienceSchema = z.object({
  title:   MAX_STR(200).optional(),
  company: MAX_STR(200).optional(),
  period:  MAX_STR(100).optional(),
  bullets: z.array(MAX_STR(600)).max(8).optional(),
}).passthrough();

const educationSchema = z.object({
  school: MAX_STR(200).optional(),
  degree: MAX_STR(200).optional(),
  year:   MAX_STR(50).optional(),
  gpa:    MAX_STR(20).optional(),
}).passthrough();

const personalInfoSchema = z.record(z.string(), MAX_STR(500));

const fullDataSchema = z.object({
  personalInfo: personalInfoSchema.optional(),
  summary:     MAX_STR(2000).optional(),
  skills:      skillsSchema.optional(),
  experience:  z.array(experienceSchema).max(12).optional(),
  projects:    z.array(projectSchema).max(15).optional(),
  education:   z.array(educationSchema).max(8).optional(),
  achievements: z.array(MAX_STR(400)).max(15).optional(),
  atsScore:    z.number().int().min(0).max(100).optional(),
});

const saveBodySchema = z.object({
  versionId: z.string().min(1).max(50),
  data:    fullDataSchema.optional(),
  updates: z.object({
    skills:      skillsSchema.optional(),
    summary:     MAX_STR(2000).optional(),
    personalInfo: personalInfoSchema.optional(),
    experience:  z.array(experienceSchema).max(12).optional(),
    projects:    z.array(projectSchema).max(15).optional(),
    education:   z.array(educationSchema).max(8).optional(),
    achievements: z.array(MAX_STR(400)).max(15).optional(),
  }).optional(),
}).refine((d) => d.data !== undefined || d.updates !== undefined, {
  message: "Either data or updates must be provided",
});

// ── Route handler ─────────────────────────────────────────────────────────────
/**
 * POST /api/cv/save
 * Validated save endpoint. Supports:
 *  1. Full data sync (via `data` field)
 *  2. Partial updates (via `updates` field)
 */
export async function POST(req: Request) {
  const session = await auth();
  const userId = await resolveUserId(session);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 30 saves per hour (non-AI endpoint, generous)
  const limited = await checkRateLimit(userId, "cvSave");
  if (limited) return limited;

  // Reject oversized payloads before parsing (guard against payload bombs)
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > 512_000) {
    return NextResponse.json(
      { error: "Request body too large. Maximum is 500 KB." },
      { status: 413 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Validate with Zod
  const parsed = saveBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { versionId, data, updates } = parsed.data;

  try {
    let prismaData: Record<string, unknown> = {};

    // Handle full 'data' object (standard editor save)
    if (data) {
      prismaData = {
        personalInfo: data.personalInfo,
        summary:      data.summary,
        skills:       typeof data.skills === "string"
          ? JSON.parse(data.skills as any)
          : data.skills,
        experience:   data.experience,
        projects:     data.projects,
        education:    data.education,
        achievements: data.achievements ?? [],
        atsScore:     data.atsScore ?? 0,
      };
    }
    // Handle partial 'updates' object (auto-integrity save)
    else if (updates) {
      if (updates.skills)       prismaData.skills       = updates.skills;
      if (updates.summary)      prismaData.summary      = updates.summary;
      if (updates.personalInfo) prismaData.personalInfo = updates.personalInfo;
      if (updates.experience)   prismaData.experience   = updates.experience;
      if (updates.projects)     prismaData.projects     = updates.projects;
      if (updates.education)    prismaData.education    = updates.education;
      if (updates.achievements) prismaData.achievements = updates.achievements;
    }

    // Verify ownership before writing
    const version = await prisma.resumeVersion.findUnique({
      where: { id: versionId },
      select: { id: true, resume: { select: { userId: true } } },
    });
    if (!version || (version as any).resume?.userId !== userId) {
      return NextResponse.json({ error: "Resume version not found" }, { status: 404 });
    }

    await prisma.resumeVersion.update({
      where: { id: versionId },
      data: prismaData,
    });

    // Run quality validation on full saves
    let warnings: string[] = [];
    if (data) {
      const allText = [
        data.summary ?? "",
        ...(data.experience ?? []).flatMap((e) => [e.title, e.company, ...(e.bullets ?? [])]),
        ...(data.projects ?? []).flatMap((p) => [p.title, ...(p.highlights ?? [])]),
      ].filter(Boolean).join(" ");
      warnings = validateCVText(allText);
    }

    return NextResponse.json({ success: true, warnings });
  } catch (error: any) {
    console.error("[SAVE] Server Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save" },
      { status: 500 }
    );
  }
}
