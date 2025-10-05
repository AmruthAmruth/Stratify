import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin, Phone } from "lucide-react"
import { Link } from "react-router-dom";

export default function Footer() {
  const footerLinks = {
    Product: ["Features", "Pricing", "Security", "Roadmap"],
    Company: ["About", "Blog", "Careers", "Press"],
    Resources: ["Documentation", "Help Center", "Community", "Contact"],
    Legal: ["Privacy", "Terms", "Cookie Policy", "Licenses"],
  }

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ]

  return (
    <footer className="relative z-40 bg-white border-t-2 border-[#dfdcef] mt-16 sm:mt-20 lg:mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-[#009063] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-[#3b3b3b] font-bold text-xl">Stratify</span>
            </div>
            <p className="text-[#3b3b3b]/70 text-sm mb-6 max-w-sm">
              Transform your business with AI-powered insights and seamless collaboration. Join thousands of companies
              worldwide.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-[#dfdcef]/50 rounded-lg flex items-center justify-center text-[#3b3b3b] hover:bg-[#009063] hover:text-white transition-all duration-200 border-2 border-[#dfdcef] hover:border-[#009063]"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-[#3b3b3b] font-bold text-sm mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-[#3b3b3b]/70 hover:text-[#009063] text-sm transition-colors duration-200"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t-2 border-[#dfdcef] pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#dfdcef]/50 rounded-lg flex items-center justify-center border-2 border-[#dfdcef]">
                <Mail className="w-5 h-5 text-[#009063]" />
              </div>
              <div>
                <p className="text-[#3b3b3b]/70 text-xs">Email</p>
                <p className="text-[#3b3b3b] font-semibold text-sm">hello@stratify.app</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#dfdcef]/50 rounded-lg flex items-center justify-center border-2 border-[#dfdcef]">
                <Phone className="w-5 h-5 text-[#009063]" />
              </div>
              <div>
                <p className="text-[#3b3b3b]/70 text-xs">Phone</p>
                <p className="text-[#3b3b3b] font-semibold text-sm">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#dfdcef]/50 rounded-lg flex items-center justify-center border-2 border-[#dfdcef]">
                <MapPin className="w-5 h-5 text-[#009063]" />
              </div>
              <div>
                <p className="text-[#3b3b3b]/70 text-xs">Location</p>
                <p className="text-[#3b3b3b] font-semibold text-sm">San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-[#dfdcef] pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-[#3b3b3b]/70 text-sm">© 2025 Stratify. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="#" className="text-[#3b3b3b]/70 hover:text-[#009063] text-sm transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="#" className="text-[#3b3b3b]/70 hover:text-[#009063] text-sm transition-colors duration-200">
              Terms of Service
            </Link>
            <Link href="#" className="text-[#3b3b3b]/70 hover:text-[#009063] text-sm transition-colors duration-200">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
