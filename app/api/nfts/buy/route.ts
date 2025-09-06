import { NextRequest, NextResponse } from 'next/server'
import { buyNFT } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { agentId, buyerAddress, walletConnected } = await request.json()

    if (!agentId || !buyerAddress) {
      return NextResponse.json(
        { success: false, error: 'Agent ID ve buyer address gereklidir' },
        { status: 400 }
      )
    }

    if (walletConnected !== true) {
      return NextResponse.json(
        { success: false, error: 'Cüzdan bağlantısı gereklidir' },
        { status: 400 }
      )
    }

    // NFT satın alma işlemini gerçekleştir
    const result = await buyNFT(agentId, buyerAddress)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'NFT satın alınamadı' },
        { status: 400 }
      )
    }

    console.log('NFT satın alındı:', result.transaction?.id, 'Kalan supply:', result.agent?.nft?.supply)

    return NextResponse.json({
      success: true,
      message: 'NFT başarıyla satın alındı',
      nft: result.agent?.nft,
      agent: result.agent,
      transaction: result.transaction
    })

  } catch (error) {
    console.error('NFT satın alma hatası:', error)
    return NextResponse.json(
      { success: false, error: 'NFT satın alınırken hata oluştu' },
      { status: 500 }
    )
  }
}
