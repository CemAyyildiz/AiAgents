import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY
    
    return NextResponse.json({
      success: true,
      config: {
        hasOpenAIKey,
        openaiConfigured: hasOpenAIKey,
        features: {
          realAI: hasOpenAIKey,
          fallbackMode: !hasOpenAIKey
        }
      }
    })
  } catch (error) {
    console.error('Error getting config:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get config' },
      { status: 500 }
    )
  }
}
