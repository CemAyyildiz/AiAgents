import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

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
        <div className="min-h-screen gradient-bg">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-primary-600">
                    AI Agents Platform
                  </h1>
                  <span className="ml-3 px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                    Rise Testnet
                  </span>
                </div>
                <nav className="flex space-x-8">
                  <a href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                    Ana Sayfa
                  </a>
                  <a href="/agents" className="text-gray-700 hover:text-primary-600 transition-colors">
                    Agentlarım
                  </a>
                  <a href="/create" className="text-gray-700 hover:text-primary-600 transition-colors">
                    Yeni Agent
                  </a>
                </nav>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="bg-white border-t border-gray-200 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-gray-500">
                <p>&copy; 2024 AI Agents Platform. Rise Network Testnet üzerinde çalışmaktadır.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
