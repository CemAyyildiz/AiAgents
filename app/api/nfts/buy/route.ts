import { NextRequest, NextResponse } from 'next/server'
import { getAgentById, updateAgent } from '@/lib/agents'

export async function POST(request: NextRequest) {
  try {
    const { agentId, buyerAddress } = await request.json()

    if (!agentId || !buyerAddress) {
      return NextResponse.json(
        { success: false, error: 'Agent ID ve buyer address gereklidir' },
        { status: 400 }
      )
    }

    // Agent'ı bul
    const agent = getAgentById(agentId)
    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agent bulunamadı' },
        { status: 404 }
      )
    }

    // Agent'ın NFT'si var mı kontrol et
    if (!agent.nft) {
      return NextResponse.json(
        { success: false, error: 'Bu agent\'ın NFT\'si yok' },
        { status: 400 }
      )
    }

    // Supply kontrolü
    if (agent.nft.supply <= 0) {
      return NextResponse.json(
        { success: false, error: 'NFT stokta yok' },
        { status: 400 }
      )
    }

    // Gerçek uygulamada burada blockchain işlemi yapılacak
    // Şimdilik simüle ediyoruz
    console.log(`NFT satın alma simülasyonu: Agent ${agentId}, Buyer: ${buyerAddress}`)
    console.log(`Fiyat: ${agent.nft.price} ETH`)

    // Supply'ı azalt
    const updatedNft = {
      ...agent.nft,
      supply: agent.nft.supply - 1,
      lastSale: {
        buyer: buyerAddress,
        price: agent.nft.price,
        timestamp: new Date().toISOString()
      }
    }

    // Agent'ı güncelle
    const updatedAgent = updateAgent(agentId, { nft: updatedNft })
    if (!updatedAgent) {
      return NextResponse.json(
        { success: false, error: 'Agent güncellenemedi' },
        { status: 500 }
      )
    }

    console.log('NFT satın alındı:', updatedNft.id, 'Kalan supply:', updatedNft.supply)

    return NextResponse.json({
      success: true,
      message: 'NFT başarıyla satın alındı',
      nft: updatedNft,
      agent: updatedAgent
    })

  } catch (error) {
    console.error('NFT satın alma hatası:', error)
    return NextResponse.json(
      { success: false, error: 'NFT satın alınırken hata oluştu' },
      { status: 500 }
    )
  }
}
