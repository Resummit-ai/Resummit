// lib/mockInterviewService.ts
// Generated automatically by Branchdeck AI Engine for Resummit-ai/Resummit
// Feature Request: Build automated mock interview questions generator with technical and behavioral categories

export interface InterviewQuestionInput {
  roleTitle: string
  skills?: string[]
  experienceLevel?: 'junior' | 'mid' | 'senior' | 'lead'
}

export interface InterviewQuestionOutput {
  questions: Array<{
    id: string
    question: string
    category: 'technical' | 'behavioral' | 'system_design'
    suggestedAnswerKey: string
  }>
  interviewTips: string[]
}

const BRANCHDECK_PROXY_URL = process.env.BRANCHDECK_PROXY_URL || 'http://127.0.0.1:8000/api/proxy/ai-generate'
const INTEGRATION_ID = 'integ-resummit-e9ae6d'

export async function generateMockInterviewQuestions(input: InterviewQuestionInput): Promise<InterviewQuestionOutput> {
  const prompt = `Generate 3 targeted mock interview questions and answer guides for a ${input.experienceLevel || 'mid'}-level ${input.roleTitle} position focusing on skills: ${input.skills?.join(', ') || 'TypeScript'}. Return JSON matching: { "questions": [{ "id": "1", "question": "...", "category": "technical", "suggestedAnswerKey": "..." }], "interviewTips": ["..."] }`

  try {
    const res = await fetch(BRANCHDECK_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        integration_id: INTEGRATION_ID,
        prompt: prompt,
        model: 'gemini-2.5-flash'
      })
    })

    if (res.ok) {
      const data = await res.json()
      const parsed = JSON.parse(data.content || '{}')
      if (parsed.questions) return parsed as InterviewQuestionOutput
    }
  } catch (e) {
    console.warn('[MockInterviewService Proxy Fallback]:', e)
  }

  return {
    questions: [
      {
        id: '1',
        question: `Explain how you architect scalable systems using ${input.skills?.[0] || 'TypeScript'}.`,
        category: 'technical',
        suggestedAnswerKey: 'Focus on modular architecture, type safety, and clean async patterns.'
      },
      {
        id: '2',
        question: 'Describe a challenging engineering situation and how you resolved it.',
        category: 'behavioral',
        suggestedAnswerKey: 'Use STAR method highlighting problem, action, and quantitative outcome.'
      }
    ],
    interviewTips: [
      'Be specific about architecture tradeoffs.',
      'Highlight testing and deployment practices.'
    ]
  }
}
