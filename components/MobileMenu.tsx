'use client'

import { useState } from 'react'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        className="lg:hidden p-2 text-gray-300 hover:text-purple-400 transition-colors" 
        onClick={toggleMenu}
        aria-label="Toggle mobile menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-purple-500/20 py-4 z-40">
          {/* Mobile Search */}
          <div className="px-4 pb-4 xl:hidden">
            <div className="relative">
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

          {/* Mobile Navigation Links */}
          <nav className="px-4 space-y-3">
            <a 
              href="/" 
              className="block text-gray-300 hover:text-purple-400 transition-all duration-300 font-medium tracking-wide py-3 px-4 rounded-lg hover:bg-purple-500/10"
              onClick={() => setIsOpen(false)}
            >
              MARKETPLACE
            </a>
            <a 
              href="/agents" 
              className="block text-gray-300 hover:text-purple-400 transition-all duration-300 font-medium tracking-wide py-3 px-4 rounded-lg hover:bg-purple-500/10"
              onClick={() => setIsOpen(false)}
            >
              CATEGORIES
            </a>
            <a 
              href="/create" 
              className="block text-gray-300 hover:text-purple-400 transition-all duration-300 font-medium tracking-wide py-3 px-4 rounded-lg hover:bg-purple-500/10"
              onClick={() => setIsOpen(false)}
            >
              TRENDING
            </a>
            
            {/* Mobile Create Agent Button */}
            <a 
              href="/create" 
              className="sm:hidden block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 text-center mt-6"
              onClick={() => setIsOpen(false)}
            >
              Create Agent
            </a>
          </nav>
        </div>
      )}
    </>
  )
}
