"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { Navbar } from "./Navbar"
import Footer from "./Footer"
import { useSnackbar } from "notistack"
import axios from "axios"
import api from "@/services/axiosInstance"

export default function ContactPage() {
  const { enqueueSnackbar } = useSnackbar()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      enqueueSnackbar("Please fix the errors in the form", { variant: "error" })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await api.post("/contact", formData)

      if (response.data.success) {
        enqueueSnackbar(response.data.message || "Thank you for your message! We'll get back to you soon.", {
          variant: "success",
        })
        setFormData({ name: "", email: "", subject: "", message: "" })
        setErrors({})
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        enqueueSnackbar(error.response.data.message, { variant: "error" })
      } else {
        enqueueSnackbar("Failed to send message. Please try again later.", { variant: "error" })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Our team is here to help",
      value: "amruthshyju@gmail.com",
      link: "mailto:amruthshyju@gmail.com",
      gradient: "from-primary to-primaryHover",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Fri from 9am to 6pm",
      value: "+91 8590797504",
      link: "tel:+91 8590797504",
      gradient: "from-primary to-primaryHover",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come say hello",
      value: "123 Business Ave, San Francisco, CA 94107",
      link: "https://maps.google.com",
      gradient: "from-primary to-primaryHover",
    },
  ]

  const supportChannels = [
    {
      icon: Clock,
      title: "Response Time",
      description: "We typically respond within 24 hours during business days",
    },
    {
      icon: Globe,
      title: "Global Support",
      description: "Available in 50+ countries with multi-language support",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our team in real-time for immediate assistance",
    },
  ]

  const faqs = [
    {
      question: "What is your typical response time?",
      answer: "We aim to respond to all inquiries within 24 hours during business days (Monday-Friday, 9am-6pm PST).",
    },
    {
      question: "Do you offer phone support?",
      answer: "Yes! Phone support is available for all paid plans. Free trial users can reach us via email or live chat.",
    },
    {
      question: "Can I schedule a demo?",
      answer: "Absolutely! You can schedule a personalized demo by selecting 'Schedule a Demo' as your subject, and we'll get back to you with available time slots.",
    },
    {
      question: "Do you provide technical support?",
      answer: "Yes, we provide comprehensive technical support including onboarding assistance, troubleshooting, and integration help.",
    },
  ]

  return (
    <div className="min-h-screen bg-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div
          className="absolute top-40 right-10 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/3 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Navigation */}
      <Navbar />

      <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 bg-surface border-2 border-borderColor px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg mb-6">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="text-text font-bold text-sm sm:text-base">We're Here to Help</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4 sm:mb-6">
            <span className="block text-heading">Get in</span>
            <span className="block text-primary">Touch</span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-muted max-w-3xl mx-auto leading-relaxed">
            Have questions about Stratify? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {contactInfo.map((info, index) => (
            <a
              key={index}
              href={info.link}
              target={info.icon === MapPin ? "_blank" : undefined}
              rel={info.icon === MapPin ? "noopener noreferrer" : undefined}
              className="bg-surface rounded-3xl p-8 shadow-lg border-2 border-borderColor hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${info.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform`}>
                <info.icon className="w-8 h-8 text-textOnPrimary" />
              </div>
              <h3 className="text-xl font-bold text-heading mb-2">{info.title}</h3>
              <p className="text-muted mb-4">{info.description}</p>
              <p className="text-primary font-semibold hover:underline break-words">{info.value}</p>
            </a>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-surface rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-borderColor">
            <h2 className="text-3xl font-bold text-heading mb-8 text-center">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-text mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-surface text-text ${errors.name ? "border-red-500" : "border-borderColor"
                      } focus:border-primary focus:outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-text mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-surface text-text ${errors.email ? "border-red-500" : "border-borderColor"
                      } focus:border-primary focus:outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-text mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-surface text-text ${errors.subject ? "border-red-500" : "border-borderColor"
                    } focus:border-primary focus:outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="How can we help?"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.subject}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-text mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows={6}
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-surface text-text ${errors.message ? "border-red-500" : "border-borderColor"
                    } focus:border-primary focus:outline-none transition-colors duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="Tell us more about your inquiry..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primaryHover text-textOnPrimary px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Support Channels */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-heading text-center mb-12">
            Multiple Ways to <span className="text-primary">Reach Us</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => (
              <div
                key={index}
                className="bg-surface rounded-2xl p-6 shadow-lg border-2 border-borderColor hover:border-primary/50 hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <channel.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-heading text-lg mb-2">{channel.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{channel.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-heading text-center mb-12">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-surface rounded-2xl p-6 shadow-lg border-2 border-borderColor hover:border-primary/50 transition-all duration-300">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-heading mb-2">{faq.question}</h3>
                    <p className="text-muted leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}