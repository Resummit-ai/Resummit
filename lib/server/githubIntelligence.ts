import { callAI, safeParseJSON } from "../aiService";
import { logger } from "./logger";

export interface EngineeringSignals {
  stackConfidence: number;
  topSkills: Array<{ name: string; level: number; category: string }>;
  commitDensity: string; // "High", "Consistent", etc.
  architectureInference: string[];
  projectMaturity: number; // 0-100
  recruiterReadability: number; // 0-100
  strongestDomain: string;
}

export async function generateEngineeringSignals(
  repos: any[],
  targetRole: string
): Promise<EngineeringSignals | null> {
  const safeRepos = Array.isArray(repos) ? repos : [];
  if (safeRepos.length === 0) {
    return null;
  }

  const repoSummary = safeRepos.slice(0, 10).map(r => ({
    name: r.name,
    description: r.description,
    language: r.language,
    topics: r.topics,
    size: r.size,
    stars: r.stargazers_count,
  }));

  const prompt = `Analyze these GitHub repositories for an engineer targeting a ${targetRole} role.
Extract deep engineering signals.

Return ONLY valid JSON:
{
  "stackConfidence": <number 0-100 based on tool consistency>,
  "topSkills": [
    {"name": "SkillName", "level": <0-100>, "category": "Frontend|Backend|AI|Infra"}
  ],
  "commitDensity": "High|Moderate|Consistent|Sporadic",
  "architectureInference": ["list inferred architectural patterns like Microservices, Serverless, SPA, etc."],
  "projectMaturity": <number 0-100>,
  "recruiterReadability": <number 0-100>,
  "strongestDomain": "AI|Frontend|Backend|DevOps|Fullstack|Cybersecurity"
}

Repos:
${JSON.stringify(repoSummary, null, 2)}`;

  let parsed: any;
  try {
    const raw = await callAI(prompt);
    parsed = safeParseJSON(raw);
  } catch (err: any) {
    logger.warn("ai", "fallback_used", { fn: "generateEngineeringSignals", reason: err?.message || String(err) });
    console.warn("[AI] callAI failed inside generateEngineeringSignals. Returning null.", err);
    return null;
  }

  if (typeof parsed?.stackConfidence !== "number") {
    return null;
  }

  return {
    stackConfidence: parsed.stackConfidence,
    topSkills: Array.isArray(parsed.topSkills) ? parsed.topSkills : [],
    commitDensity: parsed.commitDensity || "Moderate",
    architectureInference: Array.isArray(parsed.architectureInference) ? parsed.architectureInference : [],
    projectMaturity: typeof parsed.projectMaturity === "number" ? parsed.projectMaturity : 0,
    recruiterReadability: typeof parsed.recruiterReadability === "number" ? parsed.recruiterReadability : 0,
    strongestDomain: parsed.strongestDomain || "Fullstack",
  };
}
