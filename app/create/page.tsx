'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bot, Upload, Settings, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface Tool {
  id: string
  name: string
  description: string
  enabled: boolean
}

export default function CreateAgent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [createdAgent, setCreatedAgent] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    agentName: '',
    role: '',
    file: null as File | null
  })

  const [tools, setTools] = useState<Tool[]>([
    { id: 'web_search', name: 'Web Arama', description: 'İnternet üzerinde arama yapabilir', enabled: true },
    { id: 'function_calling', name: 'Fonksiyon Çağırma', description: 'Özel fonksiyonları çağırabilir', enabled: false },
    { id: 'code_execution', name: 'Kod Çalıştırma', description: 'Python kodlarını çalıştırabilir', enabled: false },
    { id: 'file_analysis', name: 'Dosya Analizi', description: 'Yüklenen dosyaları analiz edebilir', enabled: true }
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      file
    }))
  }

  const handleToolToggle = (toolId: string) => {
    setTools(prev => prev.map(tool => 
      tool.id === toolId ? { ...tool, enabled: !tool.enabled } : tool
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('agentName', formData.agentName)
      formDataToSend.append('role', formData.role)
      formDataToSend.append('tools', JSON.stringify(tools.filter(t => t.enabled).map(t => t.id)))
      
      if (formData.file) {
        formDataToSend.append('file', formData.file)
      }

      const response = await fetch('/api/agents', {
        method: 'POST',
        body: formDataToSend
      })

      const data = await response.json()

      if (data.success) {
        setCreatedAgent(data.agent)
        setSuccess(true)
        setTimeout(() => {
          router.push('/agents')
        }, 2000)
      } else {
        alert('Agent oluşturulurken hata oluştu: ' + data.error)
      }
    } catch (error) {
      console.error('Error creating agent:', error)
      alert('Agent oluşturulurken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (success && createdAgent) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="card text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
            Agent Başarıyla Oluşturuldu!
          </h1>
          <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
            <strong>{createdAgent.name}</strong> adlı agent'ınız hazır. 
            Şimdi onunla sohbet etmeye başlayabilirsiniz.
          </p>
          <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-left">
            <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">Agent Detayları:</h3>
            <p className="text-xs sm:text-sm text-gray-300 mb-1"><strong>Ad:</strong> {createdAgent.name}</p>
            <p className="text-xs sm:text-sm text-gray-300 mb-1"><strong>Rol:</strong> {createdAgent.role}</p>
            <p className="text-xs sm:text-sm text-gray-300"><strong>Araçlar:</strong> {createdAgent.tools.join(', ')}</p>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            Sohbet sayfasına yönlendiriliyorsunuz...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="mb-6 sm:mb-8">
        <Link href="/" className="inline-flex items-center text-gray-300 hover:text-purple-400 mb-3 sm:mb-4 transition-colors text-sm sm:text-base">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Ana Sayfaya Dön
        </Link>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Yeni AI Agent Oluştur</h1>
        <p className="text-sm sm:text-base text-gray-300">
          AI agent'ınızı oluşturun ve özel görevler için eğitin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Basic Information */}
        <div className="card">
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-gradient rounded-lg flex items-center justify-center mr-3">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-white">Temel Bilgiler</h2>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="agentName" className="block text-sm font-medium text-gray-300 mb-2">
                Agent Adı *
              </label>
              <input
                type="text"
                id="agentName"
                name="agentName"
                value={formData.agentName}
                onChange={handleInputChange}
                className="w-full bg-gray-900/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 text-sm sm:text-base"
                placeholder="Örn: Müşteri Hizmetleri Asistanı"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                Agent Rolü ve Görevleri *
              </label>
              <textarea
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full bg-gray-900/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 h-24 sm:h-32 resize-none text-sm sm:text-base"
                placeholder="Bu agent'ın ne yapmasını istiyorsunuz? Hangi konularda uzman olmalı? Nasıl davranmalı?"
                required
              />
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Agent'ınızın kişiliğini, uzmanlık alanını ve davranış şeklini detaylı olarak açıklayın.
              </p>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="card">
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-gradient rounded-lg flex items-center justify-center mr-3">
              <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-white">Dosya Yükleme (Opsiyonel)</h2>
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-300 mb-2">
              Eğitim Dosyası
            </label>
            <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-4 sm:p-6 text-center hover:border-purple-400 transition-colors bg-gray-900/20">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.txt,.doc,.docx,.md"
              />
              <label htmlFor="file" className="cursor-pointer">
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm sm:text-base text-gray-300 mb-1">
                  {formData.file ? formData.file.name : 'Dosya seçmek için tıklayın'}
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  PDF, TXT, DOC, DOCX, MD dosyaları desteklenir
                </p>
              </label>
            </div>
            {formData.file && (
              <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-green-400">
                  ✓ {formData.file.name} seçildi ({(formData.file.size / 1024).toFixed(1)} KB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tools */}
        <div className="card">
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gold-gradient rounded-lg flex items-center justify-center mr-3">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-white">Araçlar</h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {tools.map((tool) => (
              <div key={tool.id} className="flex items-center justify-between p-3 sm:p-4 border border-purple-500/30 rounded-lg bg-gray-900/20">
                <div className="flex-1 mr-3">
                  <h3 className="font-medium text-white text-sm sm:text-base">{tool.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-300">{tool.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={tool.enabled}
                    onChange={() => handleToolToggle(tool.id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <Link href="/" className="btn-secondary order-2 sm:order-1 text-center">
            İptal
          </Link>
          <button
            type="submit"
            disabled={loading || !formData.agentName || !formData.role}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 text-sm sm:text-base"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span className="hidden sm:inline">Oluşturuluyor...</span>
                <span className="sm:hidden">Oluşturuluyor...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Agent Oluştur</span>
                <span className="sm:hidden">Oluştur</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
