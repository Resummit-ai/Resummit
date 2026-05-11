import axios from "axios";

export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  updated_at: string;
  fork: boolean;
  language: string | null;
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

  const lowSignal =
    desc.length < 40 ||
    !repo.language ||
    daysSince(repo.updated_at) > 365;

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
      params: { sort: "updated", per_page: 50, direction: "desc" },
    });

    const validRepos = response.data.filter(repo => !isJunkRepo(repo));

    // Cluster by normalized name
    const clusters: Record<string, GithubRepo[]> = {};
    for (const repo of validRepos) {
      const n = normalize(repo.name);
      let matchedCluster = n;
      for (const existingKey of Object.keys(clusters)) {
        if (existingKey.includes(n) || n.includes(existingKey)) {
          matchedCluster = existingKey;
          break;
        }
      }
      if (!clusters[matchedCluster]) clusters[matchedCluster] = [];
      clusters[matchedCluster].push(repo);
    }

    // Pick top repo from each cluster based on score
    const deduped: GithubRepo[] = [];
    for (const group of Object.values(clusters)) {
      group.sort((a, b) => scoreRepo(b) - scoreRepo(a));
      deduped.push(group[0]);
    }

    deduped.sort((a, b) => scoreRepo(b) - scoreRepo(a));
    
    // We return top 10 so DB layer can pick remaining slots
    return deduped.slice(0, 10);
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    throw new Error("Failed to fetch repositories from GitHub.");
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
