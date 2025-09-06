// Database service using Prisma ORM
import { prisma } from './prisma'

export interface Agent {
  id: string
  name: string
  role: string
  tools: string[]
  fileContent?: string | null
  fileName?: string | null
  createdAt: string
  status: string
  creatorAddress?: string
  nft?: {
    id: string
    name: string
    description: string
    image: string
    supply: number
    price: number
    createdAt: string
    creatorAddress: string
    lastSale?: {
      buyer: string
      price: number
      timestamp: string
    }
  }
}

export interface NFTTransaction {
  id: string
  agentId: string
  nftId: string
  buyerAddress: string
  sellerAddress: string
  price: number
  timestamp: string
  transactionHash?: string
}

// Agent operations
export const getAgents = async (): Promise<Agent[]> => {
  try {
    const agents = await prisma.agent.findMany({
      include: {
        nft: {
          include: {
            transactions: {
              orderBy: { timestamp: 'desc' },
              take: 1
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      role: agent.role,
      tools: JSON.parse(agent.tools),
      fileContent: agent.fileContent,
      fileName: agent.fileName,
      createdAt: agent.createdAt.toISOString(),
      status: agent.status,
      creatorAddress: agent.creatorAddress,
      nft: agent.nft ? {
        id: agent.nft.id,
        name: agent.nft.name,
        description: agent.nft.description,
        image: agent.nft.image,
        supply: agent.nft.supply,
        price: agent.nft.price,
        createdAt: agent.nft.createdAt.toISOString(),
        creatorAddress: agent.nft.creatorAddress,
        lastSale: agent.nft.transactions[0] ? {
          buyer: agent.nft.transactions[0].buyerAddress,
          price: agent.nft.transactions[0].price,
          timestamp: agent.nft.transactions[0].timestamp.toISOString()
        } : undefined
      } : undefined
    }))
  } catch (error) {
    console.error('Error fetching agents:', error)
    return []
  }
}

export const getAgentById = async (id: string): Promise<Agent | null> => {
  try {
    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        nft: {
          include: {
            transactions: {
              orderBy: { timestamp: 'desc' },
              take: 1
            }
          }
        }
      }
    })

    if (!agent) return null

    return {
      id: agent.id,
      name: agent.name,
      role: agent.role,
      tools: JSON.parse(agent.tools),
      fileContent: agent.fileContent,
      fileName: agent.fileName,
      createdAt: agent.createdAt.toISOString(),
      status: agent.status,
      creatorAddress: agent.creatorAddress,
      nft: agent.nft ? {
        id: agent.nft.id,
        name: agent.nft.name,
        description: agent.nft.description,
        image: agent.nft.image,
        supply: agent.nft.supply,
        price: agent.nft.price,
        createdAt: agent.nft.createdAt.toISOString(),
        creatorAddress: agent.nft.creatorAddress,
        lastSale: agent.nft.transactions[0] ? {
          buyer: agent.nft.transactions[0].buyerAddress,
          price: agent.nft.transactions[0].price,
          timestamp: agent.nft.transactions[0].timestamp.toISOString()
        } : undefined
      } : undefined
    }
  } catch (error) {
    console.error('Error fetching agent:', error)
    return null
  }
}

export const createAgent = async (agent: Omit<Agent, 'id' | 'createdAt' | 'status'>): Promise<Agent> => {
  try {
    const newAgent = await prisma.agent.create({
      data: {
        name: agent.name,
        role: agent.role,
        tools: JSON.stringify(agent.tools),
        fileContent: agent.fileContent,
        fileName: agent.fileName,
        creatorAddress: agent.creatorAddress
      }
    })

    return {
      id: newAgent.id,
      name: newAgent.name,
      role: newAgent.role,
      tools: JSON.parse(newAgent.tools),
      fileContent: newAgent.fileContent,
      fileName: newAgent.fileName,
      createdAt: newAgent.createdAt.toISOString(),
      status: newAgent.status,
      creatorAddress: newAgent.creatorAddress
    }
  } catch (error) {
    console.error('Error creating agent:', error)
    throw error
  }
}

export const updateAgent = async (id: string, updates: Partial<Agent>): Promise<Agent | null> => {
  try {
    const updatedAgent = await prisma.agent.update({
      where: { id },
      data: {
        ...(updates.name && { name: updates.name }),
        ...(updates.role && { role: updates.role }),
        ...(updates.tools && { tools: JSON.stringify(updates.tools) }),
        ...(updates.fileContent !== undefined && { fileContent: updates.fileContent }),
        ...(updates.fileName !== undefined && { fileName: updates.fileName }),
        ...(updates.status && { status: updates.status }),
        ...(updates.creatorAddress !== undefined && { creatorAddress: updates.creatorAddress })
      }
    })

    return {
      id: updatedAgent.id,
      name: updatedAgent.name,
      role: updatedAgent.role,
      tools: JSON.parse(updatedAgent.tools),
      fileContent: updatedAgent.fileContent,
      fileName: updatedAgent.fileName,
      createdAt: updatedAgent.createdAt.toISOString(),
      status: updatedAgent.status,
      creatorAddress: updatedAgent.creatorAddress
    }
  } catch (error) {
    console.error('Error updating agent:', error)
    return null
  }
}

export const deleteAgent = async (id: string): Promise<boolean> => {
  try {
    await prisma.agent.delete({
      where: { id }
    })
    return true
  } catch (error) {
    console.error('Error deleting agent:', error)
    return false
  }
}

// NFT operations
export const createNFT = async (agentId: string, nftData: Omit<Agent['nft'], 'id' | 'createdAt'>): Promise<Agent | null> => {
  try {
    // Check if agent exists and doesn't have NFT
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      include: { nft: true }
    })

    if (!agent) return null
    if (agent.nft) return null // Agent already has NFT

    // Create NFT
    const nft = await prisma.nFT.create({
      data: {
        name: nftData.name,
        description: nftData.description,
        image: nftData.image,
        supply: nftData.supply,
        price: nftData.price,
        creatorAddress: nftData.creatorAddress,
        agentId: agentId
      }
    })

    // Return updated agent
    return await getAgentById(agentId)
  } catch (error) {
    console.error('Error creating NFT:', error)
    return null
  }
}

export const buyNFT = async (agentId: string, buyerAddress: string): Promise<{ success: boolean; agent?: Agent; transaction?: NFTTransaction }> => {
  try {
    // Get agent with NFT
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      include: { nft: true }
    })

    if (!agent || !agent.nft) {
      return { success: false }
    }

    if (agent.nft.supply <= 0) {
      return { success: false }
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        nftId: agent.nft.id,
        buyerAddress,
        sellerAddress: agent.creatorAddress || '0x0000000000000000000000000000000000000000',
        price: agent.nft.price
      }
    })

    // Update NFT supply
    await prisma.nFT.update({
      where: { id: agent.nft.id },
      data: {
        supply: agent.nft.supply - 1
      }
    })

    // Get updated agent
    const updatedAgent = await getAgentById(agentId)
    
    return {
      success: true,
      agent: updatedAgent || undefined,
      transaction: {
        id: transaction.id,
        agentId,
        nftId: transaction.nftId,
        buyerAddress: transaction.buyerAddress,
        sellerAddress: transaction.sellerAddress,
        price: transaction.price,
        timestamp: transaction.timestamp.toISOString(),
        transactionHash: transaction.transactionHash
      }
    }
  } catch (error) {
    console.error('Error buying NFT:', error)
    return { success: false }
  }
}

// Transaction operations
export const getTransactions = async (): Promise<NFTTransaction[]> => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { timestamp: 'desc' }
    })

    return transactions.map(tx => ({
      id: tx.id,
      agentId: '', // Will be filled by the caller
      nftId: tx.nftId,
      buyerAddress: tx.buyerAddress,
      sellerAddress: tx.sellerAddress,
      price: tx.price,
      timestamp: tx.timestamp.toISOString(),
      transactionHash: tx.transactionHash
    }))
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return []
  }
}

export const getTransactionsByAgent = async (agentId: string): Promise<NFTTransaction[]> => {
  try {
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      include: { nft: { include: { transactions: true } } }
    })

    if (!agent || !agent.nft) return []

    return agent.nft.transactions.map(tx => ({
      id: tx.id,
      agentId,
      nftId: tx.nftId,
      buyerAddress: tx.buyerAddress,
      sellerAddress: tx.sellerAddress,
      price: tx.price,
      timestamp: tx.timestamp.toISOString(),
      transactionHash: tx.transactionHash
    }))
  } catch (error) {
    console.error('Error fetching agent transactions:', error)
    return []
  }
}

export const getTransactionsByBuyer = async (buyerAddress: string): Promise<NFTTransaction[]> => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        buyerAddress: {
          equals: buyerAddress,
          mode: 'insensitive'
        }
      },
      orderBy: { timestamp: 'desc' }
    })

    return transactions.map(tx => ({
      id: tx.id,
      agentId: '', // Will be filled by the caller
      nftId: tx.nftId,
      buyerAddress: tx.buyerAddress,
      sellerAddress: tx.sellerAddress,
      price: tx.price,
      timestamp: tx.timestamp.toISOString(),
      transactionHash: tx.transactionHash
    }))
  } catch (error) {
    console.error('Error fetching buyer transactions:', error)
    return []
  }
}

// Network sync functions
export const syncWithNetwork = async (): Promise<void> => {
  // In production, this would sync with the blockchain network
  console.log('Syncing with network...')
}

export const getNetworkStatus = (): { connected: boolean; lastSync: string } => {
  return {
    connected: true,
    lastSync: new Date().toISOString()
  }
}
