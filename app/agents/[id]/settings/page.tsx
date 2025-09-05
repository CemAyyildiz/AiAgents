'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Bot, Settings, Save, Trash2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface Agent {
  id: string
  name: string
  role: string
  tools: string[]
  fileName?: string
  createdAt: string
  status: string
}

export default function AgentSettingsPage() {
  const params = useParams()
  const router = useRouter()
  
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    role: ''
  })

  useEffect(() => {
    if (params.id) {
      fetchAgent()
    }
  }, [params.id])

  const fetchAgent = async () => {
    try {
      const response = await fetch(`/api/agents/${params.id}`)
      const data = await response.json()
      if (data.success) {
        setAgent(data.agent)
        setFormData({
          name: data.agent.name,
          role: data.agent.role
        })
      } else {
        router.push('/agents')
      }
    } catch (error) {
      console.error('Error fetching agent:', error)
      router.push('/agents')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // In a real implementation, you would update the agent via API
      // For now, we'll just simulate the update
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (agent) {
        setAgent({
          ...agent,
          name: formData.name,
          role: formData.role
        })
      }
      
      alert('Agent ayarları başarıyla güncellendi!')
    } catch (error) {
      console.error('Error updating agent:', error)
      alert('Agent güncellenirken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bu agent\'ı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/agents/${params.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        router.push('/agents')
      } else {
        alert('Agent silinirken hata oluştu: ' + data.error)
      }
    } catch (error) {
      console.error('Error deleting agent:', error)
      alert('Agent silinirken hata oluştu')
    } finally {
      setDeleting(false)
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href={`/agents/${agent.id}`} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Sohbete Dön
        </Link>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
            <Settings className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Ayarları</h1>
            <p className="text-gray-600">{agent.name} için ayarları düzenleyin</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Settings */}
        <div className="card">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
              <Bot className="w-4 h-4 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Temel Bilgiler</h2>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Agent Adı
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Agent Rolü ve Görevleri
              </label>
              <textarea
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="input-field h-32 resize-none"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Değişiklikleri Kaydet
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Agent Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Agent Bilgileri</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Araçlar</h3>
              <div className="space-y-2">
                {agent.tools.map((tool, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                    <span className="text-gray-700 capitalize">
                      {tool.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Dosya Bilgileri</h3>
              {agent.fileName ? (
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span>{agent.fileName}</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-500">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  <span>Dosya yüklenmemiş</span>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Durum</h3>
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                agent.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {agent.status}
              </span>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Oluşturulma Tarihi</h3>
              <p className="text-gray-700">
                {new Date(agent.createdAt).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card border-red-200 bg-red-50">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-red-900">Tehlikeli Bölge</h2>
          </div>

          <div className="bg-white border border-red-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Agent'ı Sil</h3>
            <p className="text-gray-600 mb-4">
              Bu agent'ı kalıcı olarak silmek istediğinizden emin misiniz? 
              Bu işlem geri alınamaz ve tüm sohbet geçmişi de silinecektir.
            </p>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                  Siliniyor...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2 inline-block" />
                  Agent'ı Sil
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
