'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bot, Plus, MessageSquare, FileText, Zap, RefreshCw } from 'lucide-react'
import OpenAIStatus from '@/components/OpenAIStatus'

interface Agent {
  id: string
  name: string
  role: string
  createdAt: string
  status: string
}

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      }
      const response = await fetch('/api/agents')
      const data = await response.json()
      if (data.success) {
        setAgents(data.agents)
      }
    } catch (error) {
      console.error('Error fetching agents:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* OpenAI Status */}
      <OpenAIStatus />

      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Agent'larınızı Oluşturun ve Eğitin
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Rise Network testnet üzerinde çalışan bu platform ile kendi AI agent'larınızı oluşturun, 
          eğitin ve özel görevler için kullanın.
        </p>
        <Link href="/create" className="btn-primary text-lg px-8 py-3 inline-flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Yeni Agent Oluştur
        </Link>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Bot className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Kolay Oluşturma</h3>
          <p className="text-gray-600">
            Basit bir form ile agent'ınızı oluşturun ve özel rolünü tanımlayın.
          </p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Dosya Yükleme</h3>
          <p className="text-gray-600">
            PDF, TXT ve diğer dosyaları yükleyerek agent'ınızı eğitin.
          </p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Güçlü Araçlar</h3>
          <p className="text-gray-600">
            Web arama, fonksiyon çağırma ve daha fazla araç ile güçlendirin.
          </p>
        </div>
      </div>

      {/* Agents List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Agent'larınız</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => fetchAgents(true)}
              disabled={refreshing}
              className="text-gray-600 hover:text-primary-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <Link href="/agents" className="text-primary-600 hover:text-primary-700 font-medium">
              Tümünü Gör
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Agent'lar yükleniyor...</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz agent'ınız yok</h3>
            <p className="text-gray-600 mb-6">İlk AI agent'ınızı oluşturmaya başlayın!</p>
            <Link href="/create" className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              İlk Agent'ınızı Oluşturun
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.slice(0, 6).map((agent) => (
              <div key={agent.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    agent.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {agent.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{agent.role}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(agent.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                  <Link 
                    href={`/agents/${agent.id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Sohbet Et
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Rise Network Testnet'te Deneyin
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Bu platform Rise Network testnet üzerinde çalışmaktadır. 
            AI agent'larınızı oluşturun ve blockchain teknolojisinin gücünü deneyimleyin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create" className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Agent Oluştur
            </Link>
            <a 
              href="https://testnet.rise.network" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Rise Network Hakkında
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
