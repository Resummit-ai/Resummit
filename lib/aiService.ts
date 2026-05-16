// lib/aiService.ts
import 'server-only'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2'
const GEMINI_MODEL = 'gemini-2.0-flash' // gemini-1.5-flash deprecated from v1beta API

type AIMode = 'gemini' | 'ollama'

function getAIMode(): AIMode {
  if (GEMINI_API_KEY && GEMINI_API_KEY.length > 10) return 'gemini'
  return 'ollama'
}

async function callGemini(prompt: string): Promise<string> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: { responseMimeType: 'application/json' }
  })
  const result = await model.generateContent(prompt)
  return result.response.text()
}

async function callOllama(prompt: string): Promise<string> {
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      format: 'json',
      options: { temperature: 0.3, num_predict: 2048 }
    }),
    signal: AbortSignal.timeout(60000)
  })
  if (!response.ok) throw new Error(`Ollama error: ${response.status}`)
  const data = await response.json()
  return data.response
}

export async function callAI(prompt: string): Promise<string> {
  const mode = getAIMode()
  
  if (mode === 'gemini') {
    try {
      return await callGemini(prompt)
    } catch (error: any) {
      // If quota hit (429), try Ollama as emergency fallback
      if (error.message?.includes('429') || 
          error.message?.includes('quota') ||
          error.message?.includes('RESOURCE_EXHAUSTED')) {
        console.warn('[AI] Gemini quota hit — falling back to Ollama')
        try {
          return await callOllama(prompt)
        } catch (ollamaError) {
          // Ollama not running in prod — throw clear error
          throw new Error('AI_QUOTA_EXCEEDED')
        }
      }
      throw error
    }
  }
  
  // Dev mode: Ollama only
  return await callOllama(prompt)
}

export function safeParseJSON(raw: string): any {
  const cleaned = raw
    .replace(/```json\n?/gi, '')
    .replace(/```\n?/gi, '')
    .trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON in response')
  return JSON.parse(cleaned.slice(start, end + 1))
}

export interface GeneratedCV {
  summary: string
  skills: {
    languages: string[]
    frameworks: string[]
    tools: string[]
  }
  projects: Array<{
    title: string
    techStack: string[]
    highlights: string[]
    description: string
    aiGenerated: boolean
  }>
}

/**
 * Generate comprehensive CV data from repository context.
 * Exported as an alias 'generateBatchBullets' for backward compatibility.
 */
export async function generateCVFromRepos(
  repos: any[],
  targetRole: string = 'Software Engineer'
): Promise<GeneratedCV> {

  const repoSummary = repos.slice(0, 6).map(r => ({
    name: r.name,
    description: r.description || '',
    language: r.language || 'Unknown',
    topics: r.topics || [],
    stars: r.stargazers_count || 0,
    readme: r.readme ? r.readme.slice(0, 800) : '', // include README snippet
  }))

  const prompt = `You are a recruiter-grade resume generator. Your goal is to produce high-signal, authentic resume data for a ${targetRole}.

Analyze these GitHub repositories (including README excerpts where available) and return JSON.
Return ONLY valid JSON. No markdown. No intro. No adjectives.

{
  "summary": "Exactly 2 sentences. 
   Sentence 1: What they built and the domain (e.g., 'Software engineer building ML-based recognition systems.'). 
   Sentence 2: Primary technologies used (e.g., 'Works with Python, TensorFlow, and AWS.').
   DO NOT START WITH: 'I am', 'Experienced', 'Passionate'.",
  "skills": {
    "languages": ["deterministic languages from repo data only"],
    "frameworks": ["libraries/frameworks inferred from descriptions and READMEs"],
    "tools": ["Git, Docker, APIs, etc."]
  },
  "projects": [
    {
      "title": "repo name",
      "techStack": ["LANGUAGE", "FRAMEWORK"],
      "description": "One sentence technical summary based on README content",
      "highlights": [
        "What was built + specific tech used + observable effect (e.g., 'Built a WhatsApp bot using Node.js to automate customer query responses.').",
        "Technical implementation detail + tech used + specific result (e.g., 'Implemented CNN + BiLSTM in Python to decode distorted text with sequence prediction.')."
      ]
    }
  ]
}

STRICT CONSTRAINTS:
- Use README content to write accurate, specific descriptions — not generic statements.
- No buzzwords: leveraged, robust, scalable, utilized, streamlined, spearheaded, cutting-edge.
- No adjectives: passionate, dedicated, dynamic, innovative.
- Impact Forcing: Every bullet MUST include a result or observable effect. If no metric exists, describe the logical benefit (e.g. 'automated tasks').
- Maximum 3 projects. Exactly 2 bullets per project.
- Summary MUST be exactly 2 sentences.
- SKILLS EXTRACTION: ONLY extract globally recognized technologies (e.g. React, Python, PostgreSQL, AWS). Do NOT extract random API names (e.g. Slack API, Meta API), repository names (e.g. ytmp3), random English words, or generic terms (e.g. APIs, unknown, requests).
- description field MUST be a meaningful technical sentence, not "No description provided".

Repositories:
${JSON.stringify(repoSummary, null, 2)}`

  const raw = await callAI(prompt)
  const parsed = safeParseJSON(raw)

  // Validate and fill defaults if model misses fields
  return {
    summary: parsed.summary || 'Software engineer building web applications and tools. Experienced in JavaScript and Python.',
    skills: {
      languages: parsed.skills?.languages || [],
      frameworks: parsed.skills?.frameworks || [],
      tools: parsed.skills?.tools?.length ? parsed.skills.tools : ['Git'],
    },
    projects: (parsed.projects || []).slice(0, 3).map((p: any) => ({
      title: p.title || p.name || 'Project',
      techStack: Array.isArray(p.techStack) ? p.techStack : [p.tech || 'JavaScript'],
      description: p.description || 'Project built with modern technologies.',
      highlights: (p.highlights || p.bullets || ['Built this project using modern web technologies.']).slice(0, 2),
      aiGenerated: true,
    })),
  }
}

// Backward Compatibility Alias
export const generateBatchBullets = generateCVFromRepos;


export async function regenerateSummary(
  projects: any[],
  targetRole: string
): Promise<string> {
  const prompt = `Write a 2-sentence professional resume summary for a ${targetRole}.

Based on these projects: ${projects.map(p => p.title || p.name).join(', ')}

Rules:
- Sentence 1: what they build (specific, no adjectives)
- Sentence 2: technologies they use
- No buzzwords
- RETURN ONLY THE RAW SUMMARY TEXT! DO NOT WRAP IN JSON! NO BRACKETS! NO KEYS! ONLY TEXT!
`

  const raw = await callAI(prompt)
  
  // SANITIZE: Try to extract summary if AI returned JSON despite instructions
  let cleaned = raw.replace(/^"|"$/g, '').trim();
  if (cleaned.startsWith('{')) {
    try {
      const parsed = JSON.parse(cleaned);
      cleaned = parsed.summary || parsed.Summary || Object.values(parsed)[0];
    } catch {
       // fallback if JSON parse fails
    }
  }
  
  return cleaned;
}

export async function regenerateBullet(
  bullet: string,
  projectName: string,
  tech: string,
  targetRole: string
): Promise<string> {
  const prompt = `Rewrite this resume bullet to be stronger for a ${targetRole} role.

Project: ${projectName} (${Array.isArray(tech) ? tech.join(', ') : tech})
Original bullet: ${bullet}

Rules:
- Start with a strong past tense action verb
- Under 18 words
- Include the specific technology
- No buzzwords
- Return only the bullet text, nothing else`

  const raw = await callAI(prompt)
  return raw.replace(/^"|"$/g, '').trim()
}

export interface StrengthScore {
  score: number
  breakdown: {
    skills: number
    projects: number
    impact: number
    overall: number
  }
  weakSignals: string[]
  topIssues: string[]
  quickFixes: string[]
}

export async function calculateATSScore(
  cvText: string,
  targetRole: string
): Promise<StrengthScore> {
  const prompt = `Score this resume for a ${targetRole} role.
  
Return ONLY valid JSON:
{
  "score": <integer 0-100>,
  "breakdown": {
    "skills": <integer 0-100 based on density of ${targetRole} terms>,
    "projects": <integer 0-100 based on technical depth>,
    "impact": <integer 0-100 based on presence of outcomes/results>
  },
  "weakSignals": ["list flags from: SHORT_SUMMARY, REPETITIVE_VERBS, LOW_SKILL_DENSITY, NO_IMPACT_BULLETS"],
  "topIssues": ["issue 1", "issue 2"],
  "quickFixes": ["fix 1", "fix 2"]
}

Rules for Weak Signals:
- SHORT_SUMMARY: if summary text is under 80 characters.
- REPETITIVE_VERBS: if the same action verb starts more than 2 bullets.
- LOW_SKILL_DENSITY: if fewer than 6 technical skills are listed.
- NO_IMPACT_BULLETS: if zero bullets state an outcome or effect.

Resume:
${cvText.slice(0, 3000)}`

  const raw = await callAI(prompt)
  
  try {
    const parsed = safeParseJSON(raw)
    return {
      score: Math.min(100, Math.max(0, parseInt(parsed.score as any) || 50)),
      breakdown: {
        skills: parsed.breakdown?.skills || 50,
        projects: parsed.breakdown?.projects || 50,
        impact: parsed.breakdown?.impact || 50,
        overall: Math.min(100, Math.max(0, parseInt(parsed.score as any) || 50))
      },
      weakSignals: parsed.weakSignals || [],
      topIssues: parsed.topIssues || [],
      quickFixes: parsed.quickFixes || [],
    }
  } catch {
    return { 
      score: 50, 
      breakdown: { skills: 50, projects: 50, impact: 50, overall: 50 },
      weakSignals: ['SCAN_FAILED'],
      topIssues: ['Could not analyze'], 
      quickFixes: [] 
    }
  }
}

export async function suggestSkills(projects: any[], existing: any[]): Promise<any> {
  const prompt = `Based on these projects: ${JSON.stringify(projects)}, suggest additional technical skills to add to a resume. 
Do NOT repeat these existing skills: ${JSON.stringify(existing)}.
Return JSON only:
{
  "languages": ["lang1"],
  "frameworks": ["framework1"],
  "tools": ["tool1"]
}
If no new skills can be inferred, return empty arrays.`;

  const raw = await callAI(prompt);
  try {
    return safeParseJSON(raw);
  } catch {
    return { languages: [], frameworks: [], tools: [] };
  }
}
