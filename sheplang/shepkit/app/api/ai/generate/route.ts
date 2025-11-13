import { NextRequest, NextResponse } from 'next/server'
import { generateCode, type AIRequest } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const body: AIRequest = await request.json()

    if (!body.query) {
      return NextResponse.json(
        { error: 'Query is required to generate code' },
        { status: 400 }
      )
    }

    const result = await generateCode(body)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('AI Generate Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to generate code' },
      { status: 500 }
    )
  }
}
