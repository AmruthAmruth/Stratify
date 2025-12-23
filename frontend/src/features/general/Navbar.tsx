"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom"

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-bg/95 backdrop-blur-md border-b border-accent shadow-lg p-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold text-text">
              Stratify
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <Link
              to="/"
              className="px-4 py-2 text-text hover:text-primary font-medium transition-all duration-200 rounded-lg hover:bg-accent/30"
            >
              Home
            </Link>
            <Link
              to="/pricing"
              className="px-4 py-2 text-text hover:text-primary font-medium transition-all duration-200 rounded-lg hover:bg-accent/30"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 text-text hover:text-primary font-medium transition-all duration-200 rounded-lg hover:bg-accent/30"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="px-4 py-2 text-text hover:text-primary font-medium transition-all duration-200 rounded-lg hover:bg-accent/30"
            >
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="px-4 py-2 text-text hover:text-primary font-medium transition-all duration-200 rounded-lg hover:bg-accent/30"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="relative px-6 py-2.5 bg-primary text-white rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 overflow-hidden group"
            >
              <span className="relative z-10">Get Started</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-text">Stratify</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 rounded-lg hover:bg-accent/30 transition-all duration-200 border border-accent"
          >
            {isOpen ? <X className="w-5 h-5 text-text" /> : <Menu className="w-5 h-5 text-text" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-bg/95 backdrop-blur-md border-t border-accent shadow-xl animate-in slide-in-from-top duration-300">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-1">
            <Link
              to="/"
              className="block px-4 py-3 text-text hover:text-primary hover:bg-accent/50 font-medium rounded-lg transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/pricing"
              className="block px-4 py-3 text-text hover:text-primary hover:bg-accent/50 font-medium rounded-lg transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="block px-4 py-3 text-text hover:text-primary hover:bg-accent/50 font-medium rounded-lg transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-3 text-text hover:text-primary hover:bg-accent/50 font-medium rounded-lg transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            <div className="pt-4 mt-4 border-t border-accent space-y-3">
              <Link
                to="/login"
                className="block px-4 py-3 text-text hover:text-primary hover:bg-accent/50 font-medium rounded-lg transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block w-full bg-primary text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 text-center"
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
