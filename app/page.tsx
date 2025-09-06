'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bot, Plus, MessageSquare, FileText, Zap, RefreshCw, ShoppingCart } from 'lucide-react'

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

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [buying, setBuying] = useState<string | null>(null)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      }
      console.log('Fetching agents...')
      const response = await fetch('/api/agents')
      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)
      if (data.success) {
        setAgents(data.agents)
        console.log('Agents set:', data.agents)
      }
    } catch (error) {
      console.error('Error fetching agents:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
      console.log('Loading set to false')
    }
  }

  const handleBuyNFT = async (agentId: string) => {
    if (!confirm('Bu NFT\'yi satın almak istediğinizden emin misiniz?')) {
      return
    }

    setBuying(agentId)
    try {
      const response = await fetch('/api/nfts/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          agentId,
          buyerAddress: '0x' + Math.random().toString(16).substring(2, 42) // Simulated wallet address
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('NFT başarıyla satın alındı! Artık bu AI Agent ile sohbet edebilirsiniz.')
        fetchAgents(true) // Refresh the list
      } else {
        alert('NFT satın alınırken hata oluştu: ' + data.error)
      }
    } catch (error) {
      console.error('NFT satın alma hatası:', error)
      alert('NFT satın alınırken hata oluştu')
    } finally {
      setBuying(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-6">
          <span className="glow-text">AI Agent'larınızı</span>
          <br />
          <span className="text-white">Oluşturun ve Eğitin</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Rise Network testnet üzerinde çalışan bu platform ile kendi AI agent'larınızı oluşturun, 
          eğitin ve özel görevler için kullanın.
        </p>
        <Link href="/create" className="btn-primary text-lg px-8 py-4 inline-flex items-center animate-float">
          <Plus className="w-5 h-5 mr-2" />
          Yeni Agent Oluştur
        </Link>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card text-center floating-card">
          <div className="w-16 h-16 bg-purple-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-white">Kolay Oluşturma</h3>
          <p className="text-gray-300">
            Basit bir form ile agent'ınızı oluşturun ve özel rolünü tanımlayın.
          </p>
        </div>
        
        <div className="card text-center floating-card">
          <div className="w-16 h-16 bg-pink-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-white">Dosya Yükleme</h3>
          <p className="text-gray-300">
            PDF, TXT ve diğer dosyaları yükleyerek agent'ınızı eğitin.
          </p>
        </div>
        
        <div className="card text-center floating-card">
          <div className="w-16 h-16 bg-gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-white">Güçlü Araçlar</h3>
          <p className="text-gray-300">
            Web arama, fonksiyon çağırma ve daha fazla araç ile güçlendirin.
          </p>
        </div>
      </div>

      {/* Agents List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">NFT Marketplace</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => fetchAgents(true)}
              disabled={refreshing}
              className="text-gray-400 hover:text-purple-400 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <Link href="/agents" className="text-purple-400 hover:text-pink-400 font-medium transition-colors">
              Agent'larım
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-2 text-gray-300">Agent'lar yükleniyor...</p>
          </div>
        ) : agents.filter(agent => agent.nft).length === 0 ? (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Henüz NFT yok</h3>
            <p className="text-gray-300 mb-6">İlk AI agent'ınızı oluşturun ve NFT'ye dönüştürün!</p>
            <Link href="/create" className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              İlk Agent'ınızı Oluşturun
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.filter(agent => agent.nft).slice(0, 6).map((agent) => (
              <div key={agent.id} className="card floating-card overflow-hidden">
                {/* NFT Image */}
                <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-t-2xl mb-4 flex items-center justify-center">
                  {agent.nft?.image ? (
                    <img 
                      src={agent.nft.image} 
                      alt={agent.nft.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Bot className="w-16 h-16 text-white opacity-80" />
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-white">{agent.nft?.name || agent.name}</h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                      NFT
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{agent.role}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm">
                      <span className="text-gray-400">Fiyat: </span>
                      <span className="text-white font-semibold">{agent.nft?.price} ETH</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Supply: </span>
                      <span className="text-white">{agent.nft?.supply}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleBuyNFT(agent.id)}
                    disabled={buying === agent.id || agent.nft?.supply === 0}
                    className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {buying === agent.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Satın Alınıyor...
                      </>
                    ) : agent.nft?.supply === 0 ? (
                      'Stokta Yok'
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Satın Al
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="card bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Rise Network Testnet'te Deneyin
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
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
