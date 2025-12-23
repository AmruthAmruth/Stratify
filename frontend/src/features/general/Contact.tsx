"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from "lucide-react"
import { Navbar } from "./Navbar"
import Footer from "./Footer"
import { useSnackbar } from "notistack"

export default function ContactPage() {
  const { enqueueSnackbar } = useSnackbar()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // UI-only for now - no backend integration
    enqueueSnackbar("Thank you for your message! We'll get back to you soon.", { variant: "success" })
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#dfdcef]/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div
          className="absolute top-40 right-10 w-96 h-96 bg-[#009063]/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/3 w-96 h-96 bg-[#dfdcef]/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#dfdcef_1px,transparent_1px),linear-gradient(to_bottom,#dfdcef_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <Navbar />
      </nav>

      <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-20 pb-16 sm:pb-20 lg:pb-24">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 bg-white border-2 border-[#dfdcef] px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg mb-6">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-[#009063]" />
            <span className="text-[#3b3b3b] font-bold text-sm sm:text-base">We're Here to Help</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4 sm:mb-6">
            <span className="block text-[#3b3b3b]">Get in</span>
            <span className="block text-[#009063]">Touch</span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-[#3b3b3b]/80 max-w-3xl mx-auto leading-relaxed">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Information Cards */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-[#dfdcef] hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-[#009063] to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-md">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#3b3b3b] mb-2">Email Us</h3>
            <p className="text-[#3b3b3b]/70 mb-4">Our team is here to help</p>
            <a href="mailto:support@stratify.com" className="text-[#009063] font-semibold hover:underline">
              support@stratify.com
            </a>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-[#dfdcef] hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-md">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#3b3b3b] mb-2">Call Us</h3>
            <p className="text-[#3b3b3b]/70 mb-4">Mon-Fri from 8am to 5pm</p>
            <a href="tel:+1234567890" className="text-[#009063] font-semibold hover:underline">
              +1 (234) 567-890
            </a>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-[#dfdcef] hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-md">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#3b3b3b] mb-2">Visit Us</h3>
            <p className="text-[#3b3b3b]/70 mb-4">Come say hello</p>
            <p className="text-[#009063] font-semibold">
              123 Business Ave
              <br />
              San Francisco, CA 94107
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-[#dfdcef]">
            <h2 className="text-3xl font-bold text-[#3b3b3b] mb-8 text-center">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#3b3b3b] mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#dfdcef] focus:border-[#009063] focus:outline-none transition-colors duration-200"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#3b3b3b] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#dfdcef] focus:border-[#009063] focus:outline-none transition-colors duration-200"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-[#3b3b3b] mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#dfdcef] focus:border-[#009063] focus:outline-none transition-colors duration-200"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-[#3b3b3b] mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#dfdcef] focus:border-[#009063] focus:outline-none transition-colors duration-200 resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#009063] to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <span>Send Message</span>
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <Clock className="w-8 h-8 text-[#009063] mx-auto" />
            <h3 className="font-bold text-[#3b3b3b]">Response Time</h3>
            <p className="text-[#3b3b3b]/70 text-sm">We typically respond within 24 hours</p>
          </div>
          <div className="space-y-2">
            <Globe className="w-8 h-8 text-[#009063] mx-auto" />
            <h3 className="font-bold text-[#3b3b3b]">Global Support</h3>
            <p className="text-[#3b3b3b]/70 text-sm">Available in 50+ countries worldwide</p>
          </div>
          <div className="space-y-2">
            <MessageSquare className="w-8 h-8 text-[#009063] mx-auto" />
            <h3 className="font-bold text-[#3b3b3b]">Live Chat</h3>
            <p className="text-[#3b3b3b]/70 text-sm">Chat with our team in real-time</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}