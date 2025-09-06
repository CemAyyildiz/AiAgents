import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletProvider } from '@/contexts/WalletContext'
import WalletConnect from '@/components/WalletConnect'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Agents Platform - Rise Network',
  description: 'Create and train your own AI agents with ease',
  keywords: ['AI', 'Agents', 'OpenAI', 'Rise Network', 'Machine Learning'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <WalletProvider>
          <div className="min-h-screen gradient-bg">
            {/* Orvium Lüks Navbar */}
            <header className="bg-black border-b border-purple-500/20 shadow-2xl">
              <div className="w-full px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                  {/* Logo ve Orvium Yazısı */}
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">O</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-wider bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent animate-pulse drop-shadow-lg">
                      Orvium
                    </h1>
                    <span className="ml-3 px-3 py-1 text-xs font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full shadow-lg">
                      BETA
                    </span>
                  </div>

                  {/* Orta Kısım - Arama ve Navigasyon */}
                  <div className="hidden lg:flex items-center space-x-8">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search for AI agents..."
                        className="w-96 bg-gray-900/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                      />
                    </div>
                    <nav className="flex space-x-8">
                      <a href="/" className="text-gray-300 hover:text-purple-400 transition-all duration-300 font-medium tracking-wide hover:scale-105 hover:drop-shadow-lg">
                        MARKETPLACE
                      </a>
                      <a href="/agents" className="text-gray-300 hover:text-purple-400 transition-all duration-300 font-medium tracking-wide hover:scale-105 hover:drop-shadow-lg">
                        CATEGORIES
                      </a>
                      <a href="/create" className="text-gray-300 hover:text-purple-400 transition-all duration-300 font-medium tracking-wide hover:scale-105 hover:drop-shadow-lg">
                        TRENDING
                      </a>
                    </nav>
                  </div>

                  {/* Sağ Taraf - Create Agent ve Wallet */}
                  <div className="flex items-center space-x-4">
                    <a href="/create" className="hidden md:block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                      Create Agent
                    </a>
                    <div className="ml-4">
                      <WalletConnect />
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <footer className="glass-effect border-t border-dark-700/50 mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center text-gray-400">
                  <p>&copy; 2024 AI Agents Platform. Rise Network Testnet üzerinde çalışmaktadır.</p>
                </div>
              </div>
            </footer>
          </div>
        </WalletProvider>
      </body>
    </html>
  )
}
