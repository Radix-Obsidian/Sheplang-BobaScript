import { NextRequest, NextResponse } from 'next/server'
import { debugCode, type AIRequest } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const body: AIRequest = await request.json()

    if (!body.code) {
      return NextResponse.json(
        { error: 'Code is required for debugging' },
        { status: 400 }
      )
    }

    const result = await debugCode(body)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('AI Debug Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to debug code' },
      { status: 500 }
    )
  }
}
