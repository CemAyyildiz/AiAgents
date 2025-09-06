import { NextRequest, NextResponse } from 'next/server'
import { getAgents, createAgent, type Agent } from '@/lib/database'

export async function GET() {
  try {
    const agents = await getAgents()
    console.log('GET /api/agents - Found agents:', agents.length)
    return NextResponse.json({ 
      success: true, 
      agents: agents.map(agent => ({
        id: agent.id,
        name: agent.name,
        role: agent.role,
        createdAt: agent.createdAt,
        status: agent.status,
        nft: agent.nft
      }))
    })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const agentName = formData.get('agentName') as string
    const role = formData.get('role') as string
    const tools = formData.get('tools') as string
    const file = formData.get('file') as File | null

    if (!agentName || !role) {
      return NextResponse.json(
        { success: false, error: 'Agent name and role are required' },
        { status: 400 }
      )
    }

    const agent = await createAgent({
      name: agentName,
      role: role,
      tools: tools ? JSON.parse(tools) : ['web_search'],
      fileContent: file ? await file.text() : null,
      fileName: file ? file.name : null
    })

    console.log('POST /api/agents - Created agent:', agent.id, agent.name)

    // Simulate agent creation with OpenAI
    const response = await createAgentWithOpenAI(agent)

    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        name: agent.name,
        role: agent.role,
        tools: agent.tools,
        createdAt: agent.createdAt
      },
      initialResponse: response
    })

  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create agent' },
      { status: 500 }
    )
  }
}

async function createAgentWithOpenAI(agent: any) {
  try {
    // Simulate OpenAI Agent creation
    // In a real implementation, you would use the actual OpenAI Agents SDK
    const instructions = `
Sen ${agent.name} adında bir AI agent'sın.

Rolün: ${agent.role}

Kullanabileceğin araçlar: ${agent.tools.join(', ')}

${agent.fileContent ? `
Aşağıdaki dokümanı analiz edebilir ve bu konuda sorulara cevap verebilirsin:

${agent.fileContent.substring(0, 1000)}${agent.fileContent.length > 1000 ? '...' : ''}
` : ''}

Kullanıcılara yardımcı olmaya hazırsın. Nasıl yardımcı olabilirim?
    `

    // Simulate a response
    return `Merhaba! Ben ${agent.name} adında bir AI agent'ım. ${agent.role} konusunda size yardımcı olabilirim. 

${agent.fileContent ? `Ayrıca yüklediğiniz "${agent.fileName}" dosyasını analiz edebilir ve bu konuda sorularınızı yanıtlayabilirim.` : ''}

Size nasıl yardımcı olabilirim?`
  } catch (error) {
    console.error('Error with OpenAI Agent:', error)
    return 'Agent oluşturuldu ancak başlangıç yanıtı alınamadı. Lütfen tekrar deneyin.'
  }
}
