import { NextRequest, NextResponse } from 'next/server'
import { getAgentById } from '@/lib/agents'
import { generateAIResponse, type ChatMessage } from '@/lib/openai'

// In-memory storage for chat history
const chatHistory: { [agentId: string]: ChatMessage[] } = {}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { message } = await request.json()
    const agentId = params.id

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    // Initialize chat history for agent if not exists
    if (!chatHistory[agentId]) {
      chatHistory[agentId] = []
    }

    // Get agent information
    const agent = getAgentById(agentId)
    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 }
      )
    }

    // Add user message to history
    const userMessage: ChatMessage = {
      role: 'user',
      content: message
    }
    chatHistory[agentId].push(userMessage)

    // Generate AI response using OpenAI
    const aiResponse = await generateAIResponse(
      agent.name,
      agent.role,
      agent.tools,
      agent.fileContent || null,
      message,
      chatHistory[agentId].slice(-10) // Last 10 messages for context
    )

    // Add AI response to history
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: aiResponse
    }
    chatHistory[agentId].push(assistantMessage)

    return NextResponse.json({
      success: true,
      response: aiResponse,
      history: chatHistory[agentId].map(msg => ({
        role: msg.role,
        message: msg.content,
        timestamp: new Date().toISOString()
      }))
    })

  } catch (error) {
    console.error('Error in chat:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process message' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id
    const history = chatHistory[agentId] || []

    return NextResponse.json({
      success: true,
      history: history.map(msg => ({
        role: msg.role,
        message: msg.content,
        timestamp: new Date().toISOString()
      }))
    })

  } catch (error) {
    console.error('Error fetching chat history:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chat history' },
      { status: 500 }
    )
  }
}

