// Shared storage for agents
// In production, this should be replaced with a proper database
export interface Agent {
  id: string
  name: string
  role: string
  tools: string[]
  fileContent?: string | null
  fileName?: string | null
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

// Load agents from file storage
import { loadAgents, saveAgents } from './storage'

let agents: Agent[] = []

// Initialize agents from file
if (typeof window === 'undefined') { // Server-side only
  agents = loadAgents()
}

export const getAgents = (): Agent[] => {
  return agents
}

export const getAgentById = (id: string): Agent | undefined => {
  return agents.find(agent => agent.id === id)
}

export const createAgent = (agent: Omit<Agent, 'id' | 'createdAt' | 'status'>): Agent => {
  const newAgent: Agent = {
    ...agent,
    id: generateId(),
    createdAt: new Date().toISOString(),
    status: 'active'
  }
  
  agents.push(newAgent)
  saveAgents(agents) // Save to file
  return newAgent
}

export const updateAgent = (id: string, updates: Partial<Agent>): Agent | null => {
  const agentIndex = agents.findIndex(agent => agent.id === id)
  if (agentIndex === -1) return null
  
  agents[agentIndex] = { ...agents[agentIndex], ...updates }
  saveAgents(agents) // Save to file
  return agents[agentIndex]
}

export const deleteAgent = (id: string): boolean => {
  const agentIndex = agents.findIndex(agent => agent.id === id)
  if (agentIndex === -1) return false
  
  agents.splice(agentIndex, 1)
  saveAgents(agents) // Save to file
  return true
}

// Simple ID generator (in production, use proper UUID)
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
