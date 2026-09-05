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

function getGeminiKey(): string | undefined {
  return process.env.GEMINI_API_KEY
}

export async function generateCoverLetter(input: CoverLetterInput): Promise<CoverLetterOutput> {
  const startTime = Date.now()
  logger.info('[CoverLetter] Starting AI cover letter generation for target role:', input.jobTitle)

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
    const key = getGeminiKey()
    if (key && key.length > 10) {
      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const genAI = new GoogleGenerativeAI(key)
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: { responseMimeType: 'application/json' }
      })

      const res = await model.generateContent(prompt)
      const text = res.response.text()
      const parsed = JSON.parse(text) as CoverLetterOutput
      logger.info(`[CoverLetter] Successfully generated cover letter in ${Date.now() - startTime}ms`)
      return parsed
    }

    // Fallback template when API key is unconfigured
    const fallback: CoverLetterOutput = {
      salutation: `Dear Hiring Team at ${input.companyName || 'Company'},`,
      openingParagraph: `I am writing to express my strong interest in the ${input.jobTitle} position. With my background in ${input.skills?.frameworks?.slice(0, 3).join(', ') || 'software development'}, I am confident in my ability to make an immediate contribution to your team.`,
      bodyParagraphs: [
        `Throughout my career, I have focused on building scalable, reliable applications. My experience aligned directly with the requirements outlined in your job posting.`,
        `I bring hands-on experience with ${input.skills?.languages?.slice(0, 4).join(', ') || 'modern programming stacks'}, allowing me to quickly integrate with existing technical workflows.`
      ],
      closingParagraph: `Thank you for your time and consideration. I welcome the opportunity to discuss how my technical skills and experience align with your goals.`,
      signOff: `Best regards,\n${input.personalInfo?.fullName || 'Candidate'}`,
      fullText: `Dear Hiring Team,\n\nI am writing to express my strong interest in the ${input.jobTitle} position...`,
      keywordsMatched: input.skills?.languages || ['TypeScript', 'React']
    }

    logger.warn('[CoverLetter] GEMINI_API_KEY missing, returned structured fallback cover letter')
    return fallback
  } catch (error) {
    logger.error('[CoverLetter] Error during AI cover letter generation:', error)
    throw new Error('Failed to generate AI cover letter')
  }
}
