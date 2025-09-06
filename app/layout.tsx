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
            <header className="glass-effect border-b border-dark-700/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold glow-text">
                      AI Agents Platform
                    </h1>
                    <span className="ml-3 px-3 py-1 text-xs font-medium bg-gold-gradient text-white rounded-full shadow-lg">
                      Rise Testnet
                    </span>
                  </div>
                  <div className="flex items-center space-x-8">
                    <nav className="flex space-x-8">
                      <a href="/" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 hover:glow">
                        Ana Sayfa
                      </a>
                      <a href="/agents" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 hover:glow">
                        Agentlarım
                      </a>
                      <a href="/create" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 hover:glow">
                        Yeni Agent
                      </a>
                    </nav>
                    <div className="ml-8">
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
