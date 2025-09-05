import fs from 'fs'
import path from 'path'
import type { Agent } from './agents'

const DATA_FILE = path.join(process.cwd(), 'data', 'agents.json')

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Load agents from file
export const loadAgents = (): Agent[] => {
  try {
    ensureDataDir()
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading agents from file:', error)
  }
  
  // Return default test agent if file doesn't exist or error
  return [
    {
      id: 'test-agent-1',
      name: 'Test Agent',
      role: 'Bu bir test agent\'ıdır. AI agent oluşturma ve eğitme konusunda yardımcı olabilirim.',
      tools: ['web_search', 'file_analysis'],
      fileContent: null,
      fileName: null,
      createdAt: new Date().toISOString(),
      status: 'active'
    }
  ]
}

// Save agents to file
export const saveAgents = (agents: Agent[]): void => {
  try {
    ensureDataDir()
    fs.writeFileSync(DATA_FILE, JSON.stringify(agents, null, 2))
  } catch (error) {
    console.error('Error saving agents to file:', error)
  }
}
