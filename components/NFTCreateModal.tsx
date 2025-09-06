'use client'

import { useState } from 'react'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'

interface NFTCreateModalProps {
  agentId: string | null
  onClose: () => void
  onSuccess?: () => void
  redirectToHome?: boolean
}

export default function NFTCreateModal({ agentId, onClose, onSuccess, redirectToHome = false }: NFTCreateModalProps) {
  const { account, isConnected } = useWallet()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    supply: 1,
    image: null as File | null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      image: file
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!isConnected) {
      setError('NFT oluşturmak için önce cüzdanınızı bağlayın!')
      setLoading(false)
      return
    }

    if (!formData.name || !formData.description || !formData.price || !formData.image) {
      setError('Lütfen tüm alanları doldurun.')
      setLoading(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('agentId', agentId || '')
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('supply', formData.supply.toString())
      formDataToSend.append('image', formData.image)
      formDataToSend.append('creatorAddress', account || '')
      formDataToSend.append('walletConnected', isConnected.toString())

      const response = await fetch('/api/nfts/create', {
        method: 'POST',
        body: formDataToSend
      })

      const data = await response.json()

      if (data.success) {
        onSuccess?.()
        
        if (redirectToHome) {
          alert('NFT başarıyla oluşturuldu! Ana sayfaya yönlendiriliyorsunuz...')
          onClose()
          // Ana sayfaya yönlendir
          setTimeout(() => {
            window.location.href = '/'
          }, 1000)
        } else {
          onClose()
        }
      } else {
        setError(data.error || 'NFT oluşturulurken bir hata oluştu.')
      }
    } catch (error) {
      console.error('NFT oluşturma hatası:', error)
      setError('NFT oluşturulurken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  if (!agentId) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">NFT Oluştur</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                NFT Adı *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Örn: AI Asistan NFT"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input-field h-24 resize-none"
                placeholder="NFT'nizi açıklayın..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Fiyat (ETH) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="0.1"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <label htmlFor="supply" className="block text-sm font-medium text-gray-700 mb-2">
                  Supply *
                </label>
                <input
                  type="number"
                  id="supply"
                  name="supply"
                  value={formData.supply}
                  onChange={handleInputChange}
                  className="input-field"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                NFT Resmi *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                <input
                  type="file"
                  id="image"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                  required
                />
                <label htmlFor="image" className="cursor-pointer">
                  {formData.image ? (
                    <div className="space-y-2">
                      <ImageIcon className="w-8 h-8 text-green-500 mx-auto" />
                      <p className="text-sm text-green-600 font-medium">{formData.image.name}</p>
                      <p className="text-xs text-gray-500">
                        {(formData.image.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                      <p className="text-gray-600">Resim seçmek için tıklayın</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF desteklenir</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
                disabled={loading}
              >
                İptal
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary"
                disabled={loading || !isConnected}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Oluşturuluyor...
                  </>
                ) : !isConnected ? (
                  'Cüzdan Bağla'
                ) : (
                  'NFT Oluştur'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
