import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full fixed top-0 left-0 z-50 p-4">
      {/* Glass panel container with only blur */}
      <div className="max-w-8xl mx-auto px-5 md:px-12 py-3 flex justify-between items-center 
                      backdrop-blur-md shadow-lg rounded-3xl border border-white/20">
        {/* Logo */}
        <a
          href="/"
          className="text-3xl font-extrabold text-gray-900 tracking-tight hover:text-blue-600 transition-colors duration-300"
        >
          Stratify
        </a>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="relative text-gray-800 font-medium hover:text-blue-600 transition-colors duration-300 group"
            >
              {item.title}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-500  group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}

          <a
            href="/login"
            className="ml-6 px-6 py-2 backdrop-blur-md text-gray-800 font-semibold rounded-full shadow-lg hover:bg-white/10 transition-all duration-300"
          >
            Login
          </a>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-gray-800 p-2 rounded-md hover:bg-white/10 transition-colors duration-200 backdrop-blur-md"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden mt-2 backdrop-blur-md border border-white/20 shadow-lg overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-screen" : "max-h-0"
        } rounded-xl mx-6`}
      >
        <div className="flex flex-col px-6 py-4 gap-4">
          {navItems.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="text-gray-800 font-medium hover:text-blue-600 transition-colors duration-300"
            >
              {item.title}
            </a>
          ))}
          <a
            href="/login"
            className="px-6 py-2 backdrop-blur-md text-gray-800 font-semibold rounded-full shadow-lg hover:bg-white/10 transition-all duration-300 text-center"
          >
            Login
          </a>
        </div>
      </div>
    </header>
  );
}
