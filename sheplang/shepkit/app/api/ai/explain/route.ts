import { NextRequest, NextResponse } from 'next/server'
import { explainCode, type AIRequest } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const body: AIRequest = await request.json()

    if (!body.code && !body.query) {
      return NextResponse.json(
        { error: 'Code or query is required' },
        { status: 400 }
      )
    }

    const result = await explainCode(body)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('AI Explain Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to explain code' },
      { status: 500 }
    )
  }
}
