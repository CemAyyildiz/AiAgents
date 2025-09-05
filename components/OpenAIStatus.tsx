'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, Key } from 'lucide-react'

interface Config {
  hasOpenAIKey: boolean
  openaiConfigured: boolean
  features: {
    realAI: boolean
    fallbackMode: boolean
  }
}

export default function OpenAIStatus() {
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/config')
      const data = await response.json()
      if (data.success) {
        setConfig(data.config)
      }
    } catch (error) {
      console.error('Error fetching config:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="card border-dark-700/50">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 mr-3"></div>
          <span className="text-gray-300">Yapılandırma kontrol ediliyor...</span>
        </div>
      </div>
    )
  }

  if (!config) {
    return null
  }

  return (
    <div className={`card border-2 ${
      config.hasOpenAIKey 
        ? 'border-purple-500/30 bg-purple-900/10' 
        : 'border-yellow-500/30 bg-yellow-900/10'
    }`}>
      <div className="flex items-start">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
          config.hasOpenAIKey 
            ? 'bg-purple-gradient text-white' 
            : 'bg-yellow-gradient text-white'
        }`}>
          {config.hasOpenAIKey ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${
            config.hasOpenAIKey ? 'text-purple-300' : 'text-yellow-300'
          }`}>
            {config.hasOpenAIKey ? 'OpenAI API Aktif' : 'OpenAI API Yapılandırılmamış'}
          </h3>
          <p className={`text-sm mt-1 ${
            config.hasOpenAIKey ? 'text-gray-300' : 'text-gray-300'
          }`}>
            {config.hasOpenAIKey ? (
              <>
                Agent'larınız gerçek AI yanıtları verebilir. 
                <span className="font-medium text-purple-300"> Tam işlevsellik aktif!</span>
              </>
            ) : (
              <>
                OpenAI API key'i yapılandırılmamış. 
                <span className="font-medium text-yellow-300"> Simüle edilmiş yanıtlar kullanılıyor.</span>
              </>
            )}
          </p>
          {!config.hasOpenAIKey && (
            <div className="mt-3 p-3 bg-dark-800/50 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center mb-2">
                <Key className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-sm font-medium text-yellow-300">
                  OpenAI API Key Nasıl Eklenir:
                </span>
              </div>
              <ol className="text-xs text-gray-300 space-y-1 ml-6">
                <li>1. OpenAI hesabınızdan API key alın</li>
                <li>2. Proje kök dizininde .env.local dosyası oluşturun</li>
                <li>3. OPENAI_API_KEY=your_api_key_here ekleyin</li>
                <li>4. Server'ı yeniden başlatın</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
