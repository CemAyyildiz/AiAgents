// Rise Network Testnet Configuration
module.exports = {
  // Network configuration
  network: {
    name: 'rise-testnet',
    url: 'https://testnet.rise.network',
    chainId: 'rise-testnet-1'
  },

  // Application configuration
  app: {
    name: 'ai-agents-platform',
    version: '1.0.0',
    description: 'AI Agents Platform for Rise Network Testnet'
  },

  // Build configuration
  build: {
    outputDir: '.next',
    staticDir: 'public',
    includeSourceMaps: false
  },

  // Deployment configuration
  deployment: {
    // Rise Network specific settings
    rise: {
      // Smart contract deployment settings (future)
      contracts: {
        enabled: false,
        gasLimit: '1000000',
        gasPrice: '1000000000'
      },
      
      // IPFS settings for file storage
      ipfs: {
        enabled: true,
        gateway: 'https://ipfs.rise.network',
        pinning: true
      }
    },

    // Environment variables for Rise Network
    env: {
      RISE_NETWORK_URL: 'https://testnet.rise.network',
      RISE_API_KEY: process.env.RISE_API_KEY,
      RISE_WALLET_ADDRESS: process.env.RISE_WALLET_ADDRESS,
      RISE_PRIVATE_KEY: process.env.RISE_PRIVATE_KEY
    }
  },

  // Features configuration
  features: {
    // Blockchain integration
    blockchain: {
      enabled: true,
      features: ['transactions', 'smart-contracts', 'nft-support']
    },

    // AI/ML features
    ai: {
      enabled: true,
      providers: ['openai'],
      features: ['agents', 'chat', 'file-analysis']
    },

    // File storage
    storage: {
      enabled: true,
      providers: ['ipfs', 'local'],
      maxFileSize: '10MB',
      allowedTypes: ['.pdf', '.txt', '.doc', '.docx', '.md']
    }
  },

  // Security configuration
  security: {
    cors: {
      origin: ['https://testnet.rise.network', 'http://localhost:3000'],
      credentials: true
    },
    
    rateLimit: {
      enabled: true,
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  }
}
