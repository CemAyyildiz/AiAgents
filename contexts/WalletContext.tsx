'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { BrowserProvider, JsonRpcSigner, formatEther } from 'ethers'

interface WalletContextType {
  account: string | null
  balance: string | null
  isConnected: boolean
  isConnecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  provider: BrowserProvider | null
  signer: JsonRpcSigner | null
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask
  }

  // Get account balance
  const getBalance = async (address: string) => {
    if (!provider) return
    try {
      const balance = await provider.getBalance(address)
      return formatEther(balance)
    } catch (error) {
      console.error('Error getting balance:', error)
      return '0'
    }
  }

  // Connect wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      alert('MetaMask yüklü değil! Lütfen MetaMask\'ı yükleyin.')
      return
    }

    setIsConnecting(true)
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length > 0) {
        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const address = accounts[0]
        const balance = await getBalance(address)

        setAccount(address)
        setBalance(balance)
        setProvider(provider)
        setSigner(signer)
        setIsConnected(true)

        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged)
        window.ethereum.on('chainChanged', handleChainChanged)
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      alert('Cüzdan bağlantısı başarısız!')
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null)
    setBalance(null)
    setProvider(null)
    setSigner(null)
    setIsConnected(false)
    
    // Remove event listeners
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }

  // Handle account changes
  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      const address = accounts[0]
      const balance = await getBalance(address)
      setAccount(address)
      setBalance(balance)
    }
  }

  // Handle chain changes
  const handleChainChanged = () => {
    // Reload the page to reset the connection
    window.location.reload()
  }

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled()) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          })
          
          if (accounts.length > 0) {
            const provider = new BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()
            const address = accounts[0]
            const balance = await getBalance(address)

            setAccount(address)
            setBalance(balance)
            setProvider(provider)
            setSigner(signer)
            setIsConnected(true)

            // Listen for account changes
            window.ethereum.on('accountsChanged', handleAccountsChanged)
            window.ethereum.on('chainChanged', handleChainChanged)
          }
        } catch (error) {
          console.error('Error checking connection:', error)
        }
      }
    }

    checkConnection()
  }, [])

  const value = {
    account,
    balance,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    provider,
    signer
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}
