// app/api/ai/cover-letter/route.ts
import { NextResponse } from 'next/server'
import { generateCoverLetter, CoverLetterInput } from '@/lib/coverLetterService'

export async function POST(req: Request) {
  try {
    const body = await req.json() as CoverLetterInput

    if (!body.jobTitle || !body.jobDescription) {
      return NextResponse.json(
        { error: 'jobTitle and jobDescription are required fields' },
        { status: 400 }
      )
    }

    const result = await generateCoverLetter(body)

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error: any) {
    console.error('[API CoverLetter Error]:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
