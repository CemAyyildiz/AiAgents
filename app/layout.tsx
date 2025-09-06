import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Orvium - AI Agent Marketplace',
  description: 'Discover, buy and sell AI agents as NFTs on the ultimate marketplace',
  keywords: ['AI', 'Agents', 'NFT', 'Marketplace', 'Orvium', 'Blockchain'],
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
          {/* New full-width Navbar */}
          <Navbar />
          
          {/* Main content - full width for marketplace */}
          <main className="w-full">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="glass-effect border-t border-dark-700/50 mt-16">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-gray-400">
                <p>&copy; 2025 Orvium. AI Agent Marketplace powered by OverBlock.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
