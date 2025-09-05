import { NextRequest, NextResponse } from 'next/server'
import { getAgentById, deleteAgent } from '@/lib/agents'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id
    console.log('GET /api/agents/[id] - Looking for agent:', agentId)
    const agent = getAgentById(agentId)

    if (!agent) {
      console.log('GET /api/agents/[id] - Agent not found:', agentId)
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 }
      )
    }

    console.log('GET /api/agents/[id] - Found agent:', agent.name)

    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        name: agent.name,
        role: agent.role,
        tools: agent.tools,
        fileName: agent.fileName,
        createdAt: agent.createdAt,
        status: agent.status
      }
    })

  } catch (error) {
    console.error('Error fetching agent:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agent' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id
    const deleted = deleteAgent(agentId)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Agent deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting agent:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete agent' },
      { status: 500 }
    )
  }
}
