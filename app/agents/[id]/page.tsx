'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Send, Bot, User, ArrowLeft, Settings, FileText } from 'lucide-react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  message: string
  timestamp: string
}

interface Agent {
  id: string
  name: string
  role: string
  tools: string[]
  fileName?: string
  createdAt: string
  status: string
}

export default function AgentChatPage() {
  const params = useParams()
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [agent, setAgent] = useState<Agent | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchAgent()
      fetchChatHistory()
    }
  }, [params.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchAgent = async () => {
    try {
      const response = await fetch(`/api/agents/${params.id}`)
      const data = await response.json()
      if (data.success) {
        setAgent(data.agent)
      } else {
        router.push('/agents')
      }
    } catch (error) {
      console.error('Error fetching agent:', error)
      router.push('/agents')
    }
  }

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`/api/agents/${params.id}/chat`)
      const data = await response.json()
      if (data.success) {
        setMessages(data.history)
      }
    } catch (error) {
      console.error('Error fetching chat history:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || sending) return

    const userMessage: Message = {
      role: 'user',
      message: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setSending(true)

    try {
      const response = await fetch(`/api/agents/${params.id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: inputMessage })
      })

      const data = await response.json()
      if (data.success) {
        setMessages(data.history)
      } else {
        // Add error message
        setMessages(prev => [...prev, {
          role: 'assistant',
          message: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
          timestamp: new Date().toISOString()
        }])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        message: 'Bağlantı hatası oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date().toISOString()
      }])
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Agent yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Agent Bulunamadı</h1>
          <p className="text-gray-600 mb-6">Aradığınız agent mevcut değil veya silinmiş olabilir.</p>
          <Link href="/agents" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Agent'lara Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/agents" className="text-gray-600 hover:text-gray-900 mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                <Bot className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{agent.name}</h1>
                <p className="text-sm text-gray-600">{agent.role}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {agent.fileName && (
              <div className="flex items-center text-sm text-gray-500">
                <FileText className="w-4 h-4 mr-1" />
                {agent.fileName}
              </div>
            )}
            <Link
              href={`/agents/${agent.id}/settings`}
              className="text-gray-600 hover:text-gray-900"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {agent.name} ile Sohbet Başlayın
            </h3>
            <p className="text-gray-600 mb-6">
              Aşağıdaki kutuya mesajınızı yazarak sohbete başlayabilirsiniz.
            </p>
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <button
                onClick={() => setInputMessage('Merhaba! Sen kimsin ve ne yapabilirsin?')}
                className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">Tanışma</div>
                <div className="text-sm text-gray-600">Agent'ın kim olduğunu öğren</div>
              </button>
              <button
                onClick={() => setInputMessage('Hangi konularda bana yardımcı olabilirsin?')}
                className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">Yardım</div>
                <div className="text-sm text-gray-600">Yapabileceklerini öğren</div>
              </button>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl flex ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white ml-3'
                      : 'bg-gray-200 text-gray-600 mr-3'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-primary-100' : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        {sending && (
          <div className="flex justify-start">
            <div className="max-w-3xl flex">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 mr-3 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-1">
                  <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full" style={{ animationDelay: '0.1s' }}></div>
                  <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={sendMessage} className="flex space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`${agent.name} ile sohbet edin...`}
            className="flex-1 input-field"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || sending}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
