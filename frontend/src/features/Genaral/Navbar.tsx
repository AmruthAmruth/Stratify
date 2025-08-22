"use client"

import { useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { Link } from "react-router-dom"

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <div className="fixed top-0 p-4 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Stratify
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <Link
              to="/"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 rounded-lg hover:bg-white/50 hover:backdrop-blur-sm"
            >
              Home
            </Link>

            <div className="relative">
              <button
                className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 rounded-lg hover:bg-white/50 hover:backdrop-blur-sm"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <span>Solutions</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-56 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 py-2 z-50 animate-in slide-in-from-top-2 duration-200"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <Link
                    to="/analytics"
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 transition-all duration-200 mx-2 rounded-lg"
                  >
                    <div className="font-medium">Analytics</div>
                    <div className="text-sm text-gray-500">Data insights & reports</div>
                  </Link>
                  <Link
                    to="/automation"
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 transition-all duration-200 mx-2 rounded-lg"
                  >
                    <div className="font-medium">Automation</div>
                    <div className="text-sm text-gray-500">Streamline workflows</div>
                  </Link>
                  <Link
                    to="/integration"
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 transition-all duration-200 mx-2 rounded-lg"
                  >
                    <div className="font-medium">Integration</div>
                    <div className="text-sm text-gray-500">Connect your tools</div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/pricing"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 rounded-lg hover:bg-white/50 hover:backdrop-blur-sm"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 rounded-lg hover:bg-white/50 hover:backdrop-blur-sm"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 rounded-lg hover:bg-white/50 hover:backdrop-blur-sm"
            >
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-3">
            <Link
              to="/signin"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 rounded-lg hover:bg-white/50 hover:backdrop-blur-sm"
            >
              Sign In
            </Link>
            <Link
              to="/get-started"
              className="relative px-6 py-2.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Get Started</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Stratify
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 rounded-lg hover:bg-white/50 hover:backdrop-blur-sm transition-all duration-200 border border-gray-200/50"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-white/20 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-1">
            <Link
              to="/"
              className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 font-medium rounded-lg transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/solutions"
              className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 font-medium rounded-lg transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Solutions
            </Link>
            <Link
              to="/pricing"
              className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 font-medium rounded-lg transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 font-medium rounded-lg transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 font-medium rounded-lg transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            <div className="pt-4 mt-4 border-t border-gray-200/50 space-y-3">
              <Link
                to="/signin"
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 font-medium rounded-lg transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/get-started"
                className="block w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
