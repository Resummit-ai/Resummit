import { auth } from "@/auth";
import { prisma, resolveUserId } from "@/lib/server/prisma";
import { NextResponse } from "next/server";
import { callAI, safeParseJSON } from "@/lib/aiService";

const ensureObject = (val: any): any => {
  if (typeof val === "object" && val !== null && !Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) return parsed;
    } catch {}
  }
  return {};
};

const ensureArray = (val: any): any[] => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export async function POST(req: Request) {
  const session = await auth();
  const userId = await resolveUserId(session);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { resumeId, jobDescription, jobTitle, versionId } = await req.json();

    if (!resumeId || !jobDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Fetch the version of the resume to tailor
    let targetVersion = null;
    if (versionId) {
      targetVersion = await prisma.resumeVersion.findFirst({
        where: {
          id: versionId,
          resume: { id: resumeId, userId: userId }
        }
      });
    }

    const mainVersion = await prisma.resumeVersion.findFirst({
      where: { 
        resume: { id: resumeId, userId: userId },
        isMain: true 
      }
    });

    const activeVersionToTailor = targetVersion || mainVersion;

    if (!activeVersionToTailor) {
      return NextResponse.json({ error: "Resume version not found" }, { status: 404 });
    }

    // Safely unwrap JSON fields
    const personalInfo = ensureObject(activeVersionToTailor.personalInfo);
    const skills = ensureObject(activeVersionToTailor.skills);
    const experience = ensureArray(activeVersionToTailor.experience);
    const projects = ensureArray(activeVersionToTailor.projects);
    const education = ensureArray(activeVersionToTailor.education);
    const achievements = ensureArray(activeVersionToTailor.achievements);

    // 2. Use AI to tailor the content
    const prompt = `
      You are an elite career coach and ATS optimization expert.
      Your goal is to tailor a user's resume for a specific job description.
      
      JOB TITLE: ${jobTitle || "Software Engineer"}
      JOB DESCRIPTION:
      ${jobDescription}
      
      USER'S CURRENT RESUME DATA:
      - Summary: ${activeVersionToTailor.summary}
      - Skills: ${JSON.stringify(skills)}
      - Experience: ${JSON.stringify(experience)}
      - Projects: ${JSON.stringify(projects)}
      
      TASK:
      1. Analyze the Job Description for keywords, required skills, and core responsibilities.
      2. Tailor the Executive Summary to highlight alignment with this specific role. It must be exactly 2 sentences.
      3. Reorder or refine skills to match the job requirements. Keep them categorized under: languages, frameworks, tools.
      4. Suggest minor tweaks to experience bullets to match the JD's technical language and keywords.
         CRITICAL RULES FOR EXPERIENCE:
         - You MUST return the exact same number of experience items in the exact same order as the input.
         - Do NOT invent, add, or delete any companies, job titles, or periods. Keep original values for "company", "title", and "period".
         - Only refine the "bullets" text array.
         - Each bullet point MUST start with a strong past-tense action verb.
         - EVERY bullet point MUST be STRICTLY under 18 words (do NOT exceed 18 words per bullet point).
         - Prioritize integrating keywords and matching skills naturally.
      5. Suggest minor tweaks to project highlights/bullets using the same constraints.
         CRITICAL RULES FOR PROJECTS:
         - You MUST return the exact same number of project items in the exact same order as the input.
         - Do NOT invent, add, or delete any projects. Keep original values for "id", "title", "description", "techStack", and "included".
         - Only refine the "highlights" text array.
         - Each highlight bullet MUST start with a strong past-tense action verb.
         - EVERY highlight bullet MUST be STRICTLY under 18 words (do NOT exceed 18 words per bullet point).
      6. Identify matching keywords and missing skills.
      7. Calculate an overall ATS match score (out of 100).
      
      OUTPUT:
      Return ONLY a valid JSON object matching this schema (do NOT return markdown or explanation):
      {
        "summary": "Tailored 2-sentence summary...",
        "skills": { "languages": [...], "frameworks": [...], "tools": [...] },
        "experience": [
          {
            "company": "company name (keep original)",
            "title": "job title (keep original or slightly adjust for alignment)",
            "period": "period (keep original)",
            "bullets": ["bullet 1 (under 18 words)", "bullet 2 (under 18 words)"]
          }
        ],
        "projects": [
          {
            "id": "project id (keep original)",
            "title": "project title (keep original)",
            "description": "project description (keep original or slightly adjust)",
            "techStack": ["tech stack (keep original or adjust order)"],
            "highlights": ["highlight 1 (under 18 words)", "highlight 2 (under 18 words)"],
            "included": true
          }
        ],
        "keywords": ["matched keyword 1", "matched keyword 2"],
        "missingSkills": ["missing skill 1", "missing skill 2"],
        "atsScore": 85
      }
    `;

    const raw = await callAI(prompt, { userId, feature: "tailor" });
    const tailoredData = safeParseJSON(raw);

    if (!tailoredData) {
      throw new Error("AI failed to generate tailored data");
    }

    let jobTarget;
    let finalVersion;

    if (!activeVersionToTailor.isMain) {
      // 3. Update or Create JobTarget for this non-main version
      if (activeVersionToTailor.jobTargetId) {
        jobTarget = await prisma.jobTarget.update({
          where: { id: activeVersionToTailor.jobTargetId },
          data: {
            title: jobTitle || "Untitled Role",
            description: jobDescription,
            keywords: tailoredData.keywords || [],
            missingSkills: tailoredData.missingSkills || [],
            matchScore: tailoredData.atsScore || 0,
          }
        });
      } else {
        jobTarget = await prisma.jobTarget.create({
          data: {
            title: jobTitle || "Untitled Role",
            description: jobDescription,
            keywords: tailoredData.keywords || [],
            missingSkills: tailoredData.missingSkills || [],
            matchScore: tailoredData.atsScore || 0,
          }
        });
      }

      // 4. Update the existing ResumeVersion record
      finalVersion = await prisma.resumeVersion.update({
        where: { id: activeVersionToTailor.id },
        data: {
          versionName: `Tailored: ${jobTitle || "Job Application"}`,
          personalInfo: personalInfo,
          summary: tailoredData.summary || activeVersionToTailor.summary,
          skills: tailoredData.skills || skills,
          experience: tailoredData.experience || experience,
          projects: tailoredData.projects || projects,
          education: education,
          achievements: achievements,
          atsScore: tailoredData.atsScore || 0,
          jobTargetId: jobTarget.id,
        }
      });
    } else {
      // Traditional behavior: create new version from main
      jobTarget = await prisma.jobTarget.create({
        data: {
          title: jobTitle || "Untitled Role",
          description: jobDescription,
          keywords: tailoredData.keywords || [],
          missingSkills: tailoredData.missingSkills || [],
          matchScore: tailoredData.atsScore || 0,
        }
      });

      finalVersion = await prisma.resumeVersion.create({
        data: {
          resumeId: resumeId,
          versionName: `Tailored: ${jobTitle || "Job Application"}`,
          isMain: false,
          personalInfo: personalInfo,
          summary: tailoredData.summary || mainVersion.summary,
          skills: tailoredData.skills || skills,
          experience: tailoredData.experience || experience,
          projects: tailoredData.projects || projects,
          education: education,
          achievements: achievements,
          atsScore: tailoredData.atsScore || 0,
          jobTargetId: jobTarget.id,
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      versionId: finalVersion.id,
      data: finalVersion,
      jobTarget
    });

  } catch (error: any) {
    console.error("Tailor Error:", error);
    return NextResponse.json({ error: "Failed to tailor resume" }, { status: 500 });
  }
}
