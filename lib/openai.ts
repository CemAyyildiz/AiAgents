import OpenAI from 'openai'

// Initialize OpenAI client only if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export const generateAIResponse = async (
  agentName: string,
  agentRole: string,
  agentTools: string[],
  agentFileContent: string | null,
  message: string,
  chatHistory: ChatMessage[] = []
): Promise<string> => {
  try {
    // Check if OpenAI API key is configured
    if (!openai || !process.env.OPENAI_API_KEY) {
      return generateFallbackResponse(agentName, agentRole, message)
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt(agentName, agentRole, agentTools, agentFileContent)
    
    // Prepare messages
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...chatHistory,
      { role: 'user', content: message }
    ]

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || 'Üzgünüm, yanıt oluşturamadım.'
    return response

  } catch (error) {
    console.error('OpenAI API Error:', error)
    return generateFallbackResponse(agentName, agentRole, message)
  }
}

const buildSystemPrompt = (
  agentName: string,
  agentRole: string,
  agentTools: string[],
  agentFileContent: string | null
): string => {
  let prompt = `Sen ${agentName} adında bir AI agent'sın.

Rolün ve Uzmanlık Alanın: ${agentRole}

Kullanabileceğin araçlar: ${agentTools.join(', ')}

Önemli Kurallar:
- Kendi kişiliğin ve uzmanlık alanın doğrultusunda yanıt ver
- Kullanıcıya yardımcı olmaya odaklan
- Türkçe yanıt ver
- Samimi ve profesyonel bir ton kullan
- Eğer bir konuda emin değilsen, bunu belirt`

  if (agentFileContent) {
    prompt += `

Aşağıdaki dokümanı analiz edebilir ve bu konuda sorulara cevap verebilirsin:

${agentFileContent.substring(0, 2000)}${agentFileContent.length > 2000 ? '...' : ''}`
  }

  prompt += `

Şimdi kullanıcının sorusuna kendi kişiliğin ve uzmanlık alanın doğrultusunda yanıt ver.`

  return prompt
}

const generateFallbackResponse = (agentName: string, agentRole: string, message: string): string => {
  const responses = [
    `Merhaba! Ben ${agentName} adında bir AI agent'ım. ${agentRole} konusunda size yardımcı olabilirim. "${message}" hakkında size rehberlik edebilirim.`,
    `Anladım. Ben ${agentName} olarak ${agentRole} alanında uzmanım. "${message}" konusunda size yardımcı olmaktan mutluluk duyarım.`,
    `Bu konuda size yardımcı olabilirim. Ben ${agentName} adında bir AI agent'ım ve ${agentRole} konusunda deneyimliyim. "${message}" hakkında ne öğrenmek istiyorsunuz?`,
    `Harika bir soru! Ben ${agentName} olarak ${agentRole} alanında çalışıyorum. "${message}" konusunda size detaylı bilgi verebilirim.`,
    `Bu konuda size rehberlik edebilirim. Ben ${agentName} adında bir AI agent'ım ve ${agentRole} konusunda uzmanım. "${message}" ile ilgili hangi detayları bilmek istiyorsunuz?`
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}
