'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Bell, User, Menu, X, ShoppingBag } from 'lucide-react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="w-full navbar-luxury sticky top-0 z-50">
      {/* Main Navbar */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3 group">
              {/* Actual Logo */}
              <img 
                src="/logo/logo.png" 
                alt="Orvium Logo" 
                className="w-8 h-8 brand-logo-glow"
              />
              <span className="brand-text-luxury">Orvium</span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-purple-400" />
              </div>
              <input
                type="text"
                className="w-full search-luxury rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-all duration-300"
                placeholder="Search for AI agents..."
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="nav-link-luxury"
            >
              Marketplace
            </Link>
            <Link 
              href="/agents" 
              className="nav-link-luxury"
            >
              Categories
            </Link>
            <Link 
              href="/trending" 
              className="nav-link-luxury"
            >
              Trending
            </Link>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-4 ml-6">
              <Link 
                href="/create" 
                className="btn-primary text-sm px-6 py-2.5 font-semibold tracking-wide"
              >
                Create Agent
              </Link>
              
              {/* Notifications */}
              <button className="relative p-2.5 text-gray-400 hover:text-purple-400 transition-all duration-300 hover:bg-purple-500/10 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></span>
              </button>
              
              {/* Profile */}
              <button className="p-2.5 text-gray-400 hover:text-purple-400 transition-all duration-300 hover:bg-purple-500/10 rounded-lg">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-purple-400" />
            </div>
            <input
              type="text"
              className="w-full search-luxury rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-all duration-300"
              placeholder="Search for AI agents..."
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden navbar-luxury border-t border-purple-500/20">
          <div className="px-4 py-4 space-y-4">
            <Link 
              href="/"
              className="block nav-link-luxury py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link 
              href="/agents"
              className="block nav-link-luxury py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link 
              href="/trending"
              className="block nav-link-luxury py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Trending
            </Link>
            
            <div className="pt-4 border-t border-dark-700/50 space-y-3">
              <Link 
                href="/create"
                className="block w-full btn-primary text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Agent
              </Link>
              
              <div className="flex items-center justify-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-purple-400 transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-purple-400 transition-colors">
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
