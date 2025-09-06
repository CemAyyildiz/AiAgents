'use client'

import { useState } from 'react'
import { useWallet } from '@/contexts/WalletContext'
import { Wallet, LogOut, Copy, Check } from 'lucide-react'

export default function WalletConnect() {
  const { account, balance, isConnected, isConnecting, connectWallet, disconnectWallet } = useWallet()
  const [copied, setCopied] = useState(false)

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isConnected) {
    return (
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="btn-primary flex items-center space-x-2 disabled:opacity-50"
      >
        <Wallet className="w-4 h-4" />
        <span>{isConnecting ? 'Bağlanıyor...' : 'Cüzdan Bağla'}</span>
      </button>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Balance */}
      <div className="text-sm text-gray-300">
        <span className="text-gray-400">Balance:</span>
        <span className="ml-1 font-medium text-white">
          {balance ? `${parseFloat(balance).toFixed(4)} ETH` : '0.0000 ETH'}
        </span>
      </div>

      {/* Account */}
      <div className="flex items-center space-x-2 bg-dark-800/50 border border-dark-600 rounded-lg px-3 py-2">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span className="text-sm text-gray-300 font-mono">
          {formatAddress(account!)}
        </span>
        <button
          onClick={copyAddress}
          className="text-gray-400 hover:text-white transition-colors"
          title="Adresi Kopyala"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Disconnect */}
      <button
        onClick={disconnectWallet}
        className="text-gray-400 hover:text-red-400 transition-colors p-1"
        title="Cüzdanı Bağlantısını Kes"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  )
}
