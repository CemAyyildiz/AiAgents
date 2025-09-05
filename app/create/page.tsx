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
          router.push(`/agents/${data.agent.id}`)
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
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Agent Başarıyla Oluşturuldu!
          </h1>
          <p className="text-gray-600 mb-6">
            <strong>{createdAgent.name}</strong> adlı agent'ınız hazır. 
            Şimdi onunla sohbet etmeye başlayabilirsiniz.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Agent Detayları:</h3>
            <p className="text-sm text-gray-600 mb-1"><strong>Ad:</strong> {createdAgent.name}</p>
            <p className="text-sm text-gray-600 mb-1"><strong>Rol:</strong> {createdAgent.role}</p>
            <p className="text-sm text-gray-600"><strong>Araçlar:</strong> {createdAgent.tools.join(', ')}</p>
          </div>
          <p className="text-sm text-gray-500">
            Sohbet sayfasına yönlendiriliyorsunuz...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Ana Sayfaya Dön
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Yeni AI Agent Oluştur</h1>
        <p className="text-gray-600">
          AI agent'ınızı oluşturun ve özel görevler için eğitin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
              <Bot className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Temel Bilgiler</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="agentName" className="block text-sm font-medium text-gray-700 mb-2">
                Agent Adı *
              </label>
              <input
                type="text"
                id="agentName"
                name="agentName"
                value={formData.agentName}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Örn: Müşteri Hizmetleri Asistanı"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Agent Rolü ve Görevleri *
              </label>
              <textarea
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="input-field h-32 resize-none"
                placeholder="Bu agent'ın ne yapmasını istiyorsunuz? Hangi konularda uzman olmalı? Nasıl davranmalı?"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Agent'ınızın kişiliğini, uzmanlık alanını ve davranış şeklini detaylı olarak açıklayın.
              </p>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="card">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
              <Upload className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Dosya Yükleme (Opsiyonel)</h2>
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
              Eğitim Dosyası
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.txt,.doc,.docx,.md"
              />
              <label htmlFor="file" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-1">
                  {formData.file ? formData.file.name : 'Dosya seçmek için tıklayın'}
                </p>
                <p className="text-sm text-gray-500">
                  PDF, TXT, DOC, DOCX, MD dosyaları desteklenir
                </p>
              </label>
            </div>
            {formData.file && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✓ {formData.file.name} seçildi ({(formData.file.size / 1024).toFixed(1)} KB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tools */}
        <div className="card">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
              <Settings className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Araçlar</h2>
          </div>

          <div className="space-y-4">
            {tools.map((tool) => (
              <div key={tool.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{tool.name}</h3>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tool.enabled}
                    onChange={() => handleToolToggle(tool.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link href="/" className="btn-secondary">
            İptal
          </Link>
          <button
            type="submit"
            disabled={loading || !formData.agentName || !formData.role}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Oluşturuluyor...
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 mr-2" />
                Agent Oluştur
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
