'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bot, MessageSquare, Trash2, Plus, ArrowLeft, Calendar, Settings, RefreshCw, Upload } from 'lucide-react'
import NFTCreateModal from '@/components/NFTCreateModal'

interface Agent {
  id: string
  name: string
  role: string
  createdAt: string
  status: string
  nft?: {
    id: string
    name: string
    image: string
    supply: number
    price: number
  }
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const deleteAgent = async (agentId: string) => {
    if (!confirm('Bu agent\'ı silmek istediğinizden emin misiniz?')) {
      return
    }

    setDeleting(agentId)
    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        setAgents(prev => prev.filter(agent => agent.id !== agentId))
      } else {
        alert('Agent silinirken hata oluştu: ' + data.error)
      }
    } catch (error) {
      console.error('Error deleting agent:', error)
      alert('Agent silinirken hata oluştu')
    } finally {
      setDeleting(null)
    }
  }

  const handlePublish = (agentId: string) => {
    setSelectedAgentId(agentId)
    setIsModalOpen(true)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-gray-300 hover:text-purple-400 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Ana Sayfaya Dön
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">AI Agent'larım</h1>
            <p className="text-gray-300">
              Oluşturduğunuz tüm AI agent'larını yönetin ve onlarla sohbet edin.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => fetchAgents(true)}
              disabled={refreshing}
              className="btn-secondary"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Yenile
            </button>
            <Link href="/create" className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Agent
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Agent'lar yükleniyor...</p>
        </div>
      ) : agents.length === 0 ? (
        <div className="card text-center py-12">
          <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz agent'ınız yok</h3>
          <p className="text-gray-600 mb-6">
            İlk AI agent'ınızı oluşturmaya başlayın ve onunla sohbet etmeye başlayın.
          </p>
          <Link href="/create" className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            İlk Agent'ınızı Oluşturun
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                    <Bot className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{agent.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      agent.status === 'active' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!agent.nft && (
                    <button
                      onClick={() => handlePublish(agent.id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Publish NFT
                    </button>
                  )}
                  <button
                    onClick={() => deleteAgent(agent.id)}
                    disabled={deleting === agent.id}
                    className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 p-1"
                    title="Sil"
                  >
                    {deleting === agent.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                {agent.role}
              </p>

              <div className="flex items-center text-xs text-gray-400 mb-4">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(agent.createdAt).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>

              <div className="flex space-x-2">
                {agent.nft ? (
                  <>
                    <div className="flex-1 bg-green-500/20 text-green-400 text-center text-sm py-2 rounded-lg border border-green-500/30">
                      <span className="font-medium">NFT Aktif</span>
                      <div className="text-xs">Supply: {agent.nft.supply}</div>
                    </div>
                    <Link
                      href={`/agents/${agent.id}`}
                      className="btn-primary text-sm py-2 px-3"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={`/agents/${agent.id}`}
                      className="flex-1 btn-primary text-center text-sm py-2"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Sohbet Et
                    </Link>
                    <Link
                      href={`/agents/${agent.id}/settings`}
                      className="btn-secondary text-sm py-2 px-3"
                    >
                      <Settings className="w-4 h-4" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NFT Create Modal */}
      {isModalOpen && (
        <NFTCreateModal
          agentId={selectedAgentId}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedAgentId(null)
          }}
          onSuccess={() => {
            fetchAgents(true) // Refresh agents list
          }}
          redirectToHome={true} // NFT oluşturduktan sonra ana sayfaya yönlendir
        />
      )}

      {/* Stats */}
      {agents.length > 0 && (
        <div className="mt-12 card">
          <h2 className="text-xl font-semibold text-white mb-4">İstatistikler</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {agents.length}
              </div>
              <div className="text-sm text-gray-300">Toplam Agent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {agents.filter(a => a.status === 'active').length}
              </div>
              <div className="text-sm text-gray-300">Aktif Agent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {agents.filter(a => a.nft).length}
              </div>
              <div className="text-sm text-gray-300">NFT'ye Dönüştürülen</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
