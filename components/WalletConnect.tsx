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
        className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-500 hover:via-pink-500 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
      >
        <Wallet className="w-5 h-5" />
        <span className="tracking-wide">{isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}</span>
      </button>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Balance */}
      <div className="hidden md:block text-sm text-gray-300 bg-gray-900/50 border border-purple-500/30 rounded-lg px-3 py-2">
        <span className="text-gray-400 font-medium">Balance:</span>
        <span className="ml-1 font-bold text-white tracking-wide">
          {balance ? `${parseFloat(balance).toFixed(4)} ETH` : '0.0000 ETH'}
        </span>
      </div>

      {/* Account */}
      <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-purple-500/30 rounded-xl px-4 py-2 shadow-lg">
        <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg shadow-green-400/30"></div>
        <span className="text-sm text-white font-mono font-bold tracking-wider">
          {formatAddress(account!)}
        </span>
        <button
          onClick={copyAddress}
          className="text-gray-400 hover:text-purple-400 transition-all duration-300 hover:scale-110"
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
        className="text-gray-400 hover:text-red-400 transition-all duration-300 p-2 hover:bg-red-500/10 rounded-lg hover:scale-110"
        title="Cüzdanı Bağlantısını Kes"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  )
}
