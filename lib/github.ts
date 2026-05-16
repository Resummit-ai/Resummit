import axios from "axios";

export interface GithubRepo {
  id: number;
  name: string;
  full_name?: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count?: number;
  updated_at: string;
  fork: boolean;
  language: string | null;
  topics?: string[];
  // Enriched after fetch
  readme?: string;
  owner?: { login: string };
}

/**
 * Fetch the README for a specific repo, returning plain text truncated to ~1500 chars.
 * Returns empty string if no README exists or fetch fails.
 */
export async function fetchRepoReadme(
  accessToken: string,
  owner: string,
  repoName: string
): Promise<string> {
  try {
    // The Contents API returns base64-encoded content
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}/readme`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.raw", // get raw text directly
        },
        responseType: "text",
        timeout: 5000,
      }
    );
    const raw: string = typeof response.data === "string" ? response.data : "";
    // Strip markdown images/links, keep text content, truncate
    const cleaned = raw
      .replace(/!\[.*?\]\(.*?\)/g, "") // remove images
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // inline links → label only
      .replace(/#{1,6}\s/g, "") // remove heading hashes
      .replace(/```[\s\S]*?```/g, "") // remove code blocks
      .replace(/`[^`]+`/g, "") // remove inline code
      .replace(/\s+/g, " ")
      .trim();
    return cleaned.slice(0, 1500);
  } catch {
    return "";
  }
}

function normalize(name: string) {
  return name.toLowerCase().replace(/[-_0-9]/g, "").trim();
}

function daysSince(dateString: string) {
  return (Date.now() - new Date(dateString).getTime()) / (1000 * 3600 * 24);
}

function isJunkRepo(repo: GithubRepo) {
  if (repo.fork) return true;

  const n = normalize(repo.name);
  const desc = (repo.description || "").toLowerCase();

  const junkPatterns = [
    /^test/,
    /^demo/,
    /^practice/,
    /^temp/,
    /^repo$/,
    /^project$/,
    /^javascript$/,
    /^practice/,
    /tutorial/
  ];

  const lowSignal = !repo.language && desc.length === 0;

  const isJunkName = junkPatterns.some((p) => p.test(n));

  return isJunkName || lowSignal;
}

function scoreRepo(repo: GithubRepo) {
  const recencyScore = Math.max(0, 450 - daysSince(repo.updated_at)) / 10;
  
  // Keyword Bonus: +1 per high-signal term, max 5.
  const desc = (repo.description || "").toLowerCase();
  const keywords = ["ml", "ai", "api", "cloud", "system", "automation", "dashboard", "fullstack", "backend"];
  const kwBonus = Math.min(5, keywords.filter(kw => desc.includes(kw)).length);

  return (
    (repo.stargazers_count || 0) * 2 + // user feedback: stars weight * 2
    ((repo as any).forks_count || 0) * 2 +
    (repo.description?.length || 0) * 0.1 +
    recencyScore +
    kwBonus
  );
}

export async function fetchUserRepos(accessToken: string): Promise<GithubRepo[]> {
  try {
    const response = await axios.get<GithubRepo[]>("https://api.github.com/user/repos", {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { sort: "updated", per_page: 100, direction: "desc" },
    });

    const validRepos = response.data.filter(repo => !isJunkRepo(repo));

    // We return top 50 so user has more choices
    return validRepos.sort((a, b) => scoreRepo(b) - scoreRepo(a)).slice(0, 50);
  } catch (error: any) {
    console.error("Error fetching GitHub repos:", error.response?.data || error.message);
    if (error.response?.status === 401) {
      throw new Error("GitHub token expired. Please sign out and sign back in to refresh your connection.");
    }
    throw new Error(`Failed to fetch repositories from GitHub: ${error.response?.data?.message || error.message}`);
  }
}

const SKILL_MAP: Record<string, string> = {
  // Languages
  "typescript": "TypeScript",
  "javascript": "JavaScript",
  "python": "Python",
  "java": "Java",
  "c++": "C++",
  "go": "Go",
  "rust": "Rust",
  
  // Frameworks/Libraries
  "react": "React",
  "next": "Next.js",
  "node": "Node.js",
  "express": "Express.js",
  "flask": "Flask",
  "tensorflow": "TensorFlow",
  "pytorch": "PyTorch",
  "fastapi": "FastAPI",
  "tailwind": "Tailwind CSS",
  "prisma": "Prisma",
  
  // Tools/Architecture
  "postgres": "PostgreSQL",
  "mongodb": "MongoDB",
  "aws": "AWS",
  "gcp": "GCP",
  "docker": "Docker",
  "kubernetes": "Kubernetes",
  "rest api": "REST APIs",
  "microservices": "Microservices",
  "ci/cd": "CI/CD",
  "auth": "Authentication",
  "graphql": "GraphQL",
  "redis": "Redis",
  "mysql": "MySQL",
  "git": "Git",
};

export function extractDeterministicSkills(repos: GithubRepo[]) {
  const foundSkills = new Set<string>();

  for (const repo of repos) {
    if (repo.language && SKILL_MAP[repo.language.toLowerCase()]) {
      foundSkills.add(SKILL_MAP[repo.language.toLowerCase()]);
    }
    
    const desc = (repo.description || "").toLowerCase();
    for (const [key, formalName] of Object.entries(SKILL_MAP)) {
      // Escape special regex characters (like + in C++)
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const wordBoundaryRegex = new RegExp(`\\b${escapedKey}\\b`, 'i');
      if (wordBoundaryRegex.test(desc)) {
        foundSkills.add(formalName);
      }
    }
  }

  const categorizations: { languages: string[], frameworks: string[], tools: string[] } = { languages: [], frameworks: [], tools: [] };
  const categories: Record<string, "languages" | "frameworks" | "tools"> = {
    "JavaScript": "languages", "TypeScript": "languages", "Python": "languages", "Java": "languages", "C++": "languages", "Go": "languages", "Rust": "languages",
    "React": "frameworks", "Next.js": "frameworks", "Node.js": "frameworks", "Express.js": "frameworks", "Flask": "frameworks", "TensorFlow": "frameworks", "PyTorch": "frameworks", "FastAPI": "frameworks",
    "PostgreSQL": "tools", "MongoDB": "tools", "AWS": "tools", "GCP": "tools", "Docker": "tools", "Kubernetes": "tools", "REST APIs": "tools", "Microservices": "tools", "CI/CD": "tools", "Authentication": "tools", "GraphQL": "tools", "Redis": "tools", "MySQL": "tools", "Tailwind CSS": "tools", "Prisma": "tools", "Git": "tools",
  };

  for (const skill of foundSkills) {
    const cat = categories[skill] || "tools";
    categorizations[cat].push(skill);
  }

  return categorizations;
}
