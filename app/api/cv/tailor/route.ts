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

    // Fetch GitHub repositories for context
    const githubData = await prisma.gitHubData.findUnique({
      where: { userId }
    });
    
    let repos: any[] = [];
    if (githubData && githubData.repositories) {
      repos = Array.isArray(githubData.repositories) 
        ? githubData.repositories 
        : typeof githubData.repositories === "string"
        ? JSON.parse(githubData.repositories)
        : [];
    }

    const reposSummary = repos.slice(0, 30).map(r => ({
      name: r.name,
      description: r.description || '',
      language: r.language || 'Unknown',
      topics: r.topics || [],
      stars: r.stargazers_count || 0,
      readme: r.readme ? r.readme.slice(0, 500) : '',
    }));

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

      USER'S GITHUB REPOSITORIES (use these to verify skills and extract projects if the resume projects are empty):
      ${JSON.stringify(reposSummary, null, 2)}
      
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
         - If the input 'projects' array already contains project items:
           - You MUST return the exact same number of project items in the exact same order as the input.
           - Do NOT invent, add, or delete any projects. Keep original values for "id", "title", "description", "techStack", and "included".
           - Only refine the "highlights" text array.
           - Each highlight bullet MUST start with a strong past-tense action verb and be STRICTLY under 18 words.
         - If the input 'projects' array is EMPTY (0 items) AND the USER'S GITHUB REPOSITORIES list is NOT empty:
           - You MUST select the most relevant projects (up to 3 total) from the USER'S GITHUB REPOSITORIES list that best align with the Job Description.
           - For each selected project, generate a new project item object:
             - "id": a unique string (e.g. "git-" followed by the repo name).
             - "title": the repository name.
             - "description": a concise, tailored technical summary of the project.
             - "techStack": a list of relevant technologies used in that repository (e.g. ["React", "TypeScript"]).
             - "highlights": 2 tailored bullet points (each starting with a past-tense action verb, and under 18 words) describing key achievements/features of the project.
             - "included": true.
         - If both input 'projects' and USER'S GITHUB REPOSITORIES are empty, return an empty array for 'projects'.
      6. Identify matching keywords and missing skills.
         CRITICAL RULES FOR KEYWORDS & MISSING SKILLS:
         - For each matched keyword/skill in the "keywords" array, explain which repository or resume section demonstrated it. Use this format: "React (Demonstrated in [repo-name] repository)" or "Docker (Listed on Resume)".
         - A technology/skill required in the JOB DESCRIPTION is considered "missing" ONLY IF it is not present in the USER'S CURRENT RESUME DATA (specifically 'skills') AND NOT present/demonstrated in any of the USER'S GITHUB REPOSITORIES (as a primary language, topic, description keyword, or readme text).
         - For each missing skill in the "missingSkills" array, provide details of why it is missing and what it was required for. Use this format: "[Skill Name] (Required for [feature/role in JD], no evidence found in your resume or GitHub repositories)".
         - If a required skill IS present in either the resume skills OR any of their GitHub repositories, do NOT list it in 'missingSkills'. Instead, if it is demonstrated in their GitHub repositories but not currently listed in the resume skills, you should actively suggest/add it to the tailored 'skills' object.
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
            "id": "project id (keep original or generate new for added github projects)",
            "title": "project title (keep original or set to repository name)",
            "description": "project description (keep original or create tailored description based on README)",
            "techStack": ["tech stack"],
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
    const msg = error.message || "";
    if (msg.includes("AI_DAILY_LIMIT_EXCEEDED") || msg.includes("ai_daily_limit_exceeded")) {
      return NextResponse.json({ 
        error: "Daily Limit Reached: You have exceeded your daily AI optimization limit. Please try again tomorrow." 
      }, { status: 429 });
    }
    if (
      msg.includes("AI_QUOTA_EXCEEDED") || 
      msg.includes("quota") || 
      msg.includes("429") || 
      msg.includes("RESOURCE_EXHAUSTED") ||
      msg.includes("limit")
    ) {
      return NextResponse.json({ 
        error: "AI service limit reached: The server is experiencing high demand. Please wait a minute and try again." 
      }, { status: 429 });
    }
    return NextResponse.json({ error: "Failed to optimize resume. Please check your network and try again." }, { status: 500 });
  }
}
