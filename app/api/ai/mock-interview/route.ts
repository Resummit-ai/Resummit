// app/api/ai/mock-interview/route.ts
// Generated automatically by Branchdeck AI Engine for Resummit-ai/Resummit
import { NextResponse } from 'next/server'
import { generateMockInterviewQuestions, InterviewQuestionInput } from '@/lib/mockInterviewService'

export async function POST(req: Request) {
  try {
    const body = await req.json() as InterviewQuestionInput
    if (!body.roleTitle) {
      return NextResponse.json({ error: 'roleTitle is required' }, { status: 400 })
    }
    const result = await generateMockInterviewQuestions(body)
    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 })
  }
}
