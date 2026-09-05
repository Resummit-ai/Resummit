// lib/coverLetterService.ts
import 'server-only'

import { logger } from './server/logger'

export interface CoverLetterInput {
  personalInfo: {
    fullName?: string
    email?: string
    phone?: string
    location?: string
  }
  summary?: string
  skills?: {
    languages?: string[]
    frameworks?: string[]
    tools?: string[]
  }
  experience?: Array<{
    title?: string
    company?: string
    duration?: string
    highlights?: string[]
  }>
  jobTitle: string
  companyName?: string
  jobDescription: string
  tone?: 'professional' | 'persuasive' | 'conversational'
}

export interface CoverLetterOutput {
  salutation: string
  openingParagraph: string
  bodyParagraphs: string[]
  closingParagraph: string
  signOff: string
  fullText: string
  keywordsMatched: string[]
}

const BRANCHDECK_PROXY_URL = process.env.BRANCHDECK_PROXY_URL || 'http://127.0.0.1:8000/api/proxy/ai-generate'
const INTEGRATION_ID = 'integ-resummit-004'

export async function generateCoverLetter(input: CoverLetterInput): Promise<CoverLetterOutput> {
  const startTime = Date.now()
  console.log('[CoverLetter] Routing AI cover letter request through Branchdeck Proxy for target role:', input.jobTitle)

  const prompt = `You are an expert executive resume writer and career coach.
Generate a highly targeted, compelling cover letter for a candidate applying to a job.

CANDIDATE DETAILS:
- Name: ${input.personalInfo?.fullName || 'Candidate'}
- Target Role: ${input.jobTitle}
- Target Company: ${input.companyName || 'the Hiring Team'}
- Candidate Summary: ${input.summary || 'N/A'}
- Skills: ${JSON.stringify(input.skills || {})}
- Relevant Experience: ${JSON.stringify(input.experience || [])}

JOB DESCRIPTION:
${input.jobDescription}

TONE: ${input.tone || 'professional'}

REQUIREMENTS:
1. Match candidate's real skills and experiences to key requirements in the job description.
2. Structure the letter with clear salutation, strong hook opening, 2 targeted body paragraphs highlighting quantifiable achievements, closing call to action, and formal sign-off.
3. Return ONLY valid JSON with no markdown formatting around it matching this exact schema:
{
  "salutation": "Dear Hiring Manager,",
  "openingParagraph": "...",
  "bodyParagraphs": ["...", "..."],
  "closingParagraph": "...",
  "signOff": "Sincerely, [Name]",
  "fullText": "Full formatted text of cover letter",
  "keywordsMatched": ["keyword1", "keyword2"]
}`

  try {
    const res = await fetch(BRANCHDECK_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        integration_id: INTEGRATION_ID,
        prompt: prompt,
        model: 'gemini-2.5-flash'
      })
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error(`[CoverLetter Proxy Error ${res.status}]:`, errText)
      throw new Error(`Branchdeck AI Proxy Error (${res.status}): ${errText}`)
    }

    const proxyData = await res.json()
    const contentText = proxyData.content || ''
    
    let parsed: CoverLetterOutput
    try {
      parsed = JSON.parse(contentText) as CoverLetterOutput
    } catch {
      // Fallback if raw text returned
      parsed = {
        salutation: `Dear Hiring Team at ${input.companyName || 'Company'},`,
        openingParagraph: contentText.slice(0, 200),
        bodyParagraphs: [contentText.slice(200, 500)],
        closingParagraph: "Thank you for your consideration.",
        signOff: `Best regards,\n${input.personalInfo?.fullName || 'Candidate'}`,
        fullText: contentText,
        keywordsMatched: input.skills?.languages || ['TypeScript']
      }
    }

    logger.ai({
      userId: 'system',
      feature: 'cover-letter',
      model: 'gemini-2.5-flash',
      durationMs: Date.now() - startTime
    })

    return parsed
  } catch (error) {
    logger.error('cover-letter.generation_failed', error)
    throw error
  }
}
