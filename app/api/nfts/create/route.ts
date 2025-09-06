import { NextRequest, NextResponse } from 'next/server'
import { getAgentById, createNFT } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const agentId = formData.get('agentId') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const supply = formData.get('supply') as string
    const image = formData.get('image') as File
    const creatorAddress = formData.get('creatorAddress') as string
    const walletConnected = formData.get('walletConnected') as string

    if (!agentId || !name || !description || !price || !supply || !image) {
      return NextResponse.json(
        { success: false, error: 'Tüm alanlar gereklidir' },
        { status: 400 }
      )
    }

    if (walletConnected !== 'true' || !creatorAddress) {
      return NextResponse.json(
        { success: false, error: 'Cüzdan bağlantısı gereklidir' },
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

    // Eğer agent'ın zaten NFT'si varsa
    if (agent.nft) {
      return NextResponse.json(
        { success: false, error: 'Bu agent\'ın zaten NFT\'si var' },
        { status: 400 }
      )
    }

    // Resmi base64'e çevir (gerçek uygulamada IPFS veya başka bir storage kullanılmalı)
    const imageBuffer = await image.arrayBuffer()
    const imageBase64 = Buffer.from(imageBuffer).toString('base64')
    const imageDataUrl = `data:${image.type};base64,${imageBase64}`

    // NFT oluştur
    const nftData = {
      name,
      description,
      image: imageDataUrl,
      supply: parseInt(supply),
      price: parseFloat(price),
      creatorAddress
    }

    // Agent'ı güncelle
    const updatedAgent = await createNFT(agentId, nftData)
    if (!updatedAgent) {
      return NextResponse.json(
        { success: false, error: 'NFT oluşturulamadı' },
        { status: 500 }
      )
    }

    console.log('NFT oluşturuldu:', updatedAgent.nft?.id, 'Agent:', agentId)

    return NextResponse.json({
      success: true,
      nft: updatedAgent.nft,
      agent: updatedAgent
    })

  } catch (error) {
    console.error('NFT oluşturma hatası:', error)
    return NextResponse.json(
      { success: false, error: 'NFT oluşturulurken hata oluştu' },
      { status: 500 }
    )
  }
}
