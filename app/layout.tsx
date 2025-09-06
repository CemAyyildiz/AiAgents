import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletProvider } from '@/contexts/WalletContext'
import WalletConnect from '@/components/WalletConnect'
import MobileMenu from '@/components/MobileMenu'

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
            {/* Orvium Lüks Responsive Navbar */}
            <header className="bg-black border-b border-purple-500/20 shadow-2xl sticky top-0 z-50">
              <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">
                  
                  {/* Sol Taraf - Logo ve Orvium Yazısı */}
                  <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg sm:text-xl">O</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-wider bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent animate-pulse drop-shadow-lg">
                      Orvium
                    </h1>
                    <span className="hidden sm:block ml-2 sm:ml-3 px-2 sm:px-3 py-1 text-xs font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full shadow-lg">
                      BETA
                    </span>
                  </div>

                  {/* Orta Kısım - Arama (Sadece Desktop) */}
                  <div className="hidden xl:flex items-center flex-1 max-w-2xl mx-8">
                    <div className="relative w-full">
                      <input 
                        type="text" 
                        placeholder="Search for AI agents..."
                        className="w-full bg-gray-900/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Navigasyon */}
                  <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                    <a href="/" className="text-gray-300 hover:text-purple-400 transition-all duration-300 font-medium tracking-wide hover:scale-105 hover:drop-shadow-lg text-sm xl:text-base">
                      MARKETPLACE
                    </a>
                    <a href="/agents" className="text-gray-300 hover:text-purple-400 transition-all duration-300 font-medium tracking-wide hover:scale-105 hover:drop-shadow-lg text-sm xl:text-base">
                      CATEGORIES
                    </a>
                    <a href="/create" className="text-gray-300 hover:text-purple-400 transition-all duration-300 font-medium tracking-wide hover:scale-105 hover:drop-shadow-lg text-sm xl:text-base">
                      TRENDING
                    </a>
                  </nav>

                  {/* Sağ Taraf - Create Agent ve Wallet */}
                  <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                    {/* Create Agent Button */}
                    <a href="/create" className="hidden sm:block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-2 px-3 sm:py-3 sm:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 text-xs sm:text-sm">
                      Create Agent
                    </a>
                    
                    {/* Mobile Search Icon */}
                    <button className="xl:hidden p-2 text-gray-300 hover:text-purple-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                    
                    {/* Wallet Component */}
                    <div>
                      <WalletConnect />
                    </div>

                    {/* Mobile Menu Component */}
                    <MobileMenu />
                  </div>
                </div>
              </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
              {children}
            </main>
            <footer className="glass-effect border-t border-dark-700/50 mt-8 sm:mt-12 lg:mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="text-center text-gray-400">
                  <p className="text-sm sm:text-base">&copy; 2024 AI Agents Platform. Rise Network Testnet üzerinde çalışmaktadır.</p>
                </div>
              </div>
            </footer>
          </div>
        </WalletProvider>
      </body>
    </html>
  )
}
