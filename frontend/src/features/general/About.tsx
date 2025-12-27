"use client"

import { useEffect } from "react"
import {
  ArrowRight,
  Users,
  Target,
  Award,
  Heart,
  Eye,
  CheckCircle,
  Star,
  Building2,
  UserCheck,
  Briefcase,
  Settings,
  PieChart,
  MessageSquare,
  Quote,
  Shield,
  Globe,
  Zap,
  TrendingUp,
  Coffee,
} from "lucide-react"
import { Navbar } from "./Navbar"

const AboutPage = () => {
  useEffect(() => {
    // Component mounted
  }, [])

  const stats = [
    { number: "500K+", label: "Projects Managed", icon: Briefcase, color: "from-blue-500 to-blue-600" },
    { number: "50K+", label: "Companies Trust Us", icon: Building2, color: "from-purple-500 to-purple-600" },
    { number: "2M+", label: "Employees Connected", icon: Users, color: "from-cyan-500 to-cyan-600" },
    { number: "99.9%", label: "Customer Satisfaction", icon: Heart, color: "from-pink-500 to-pink-600" },
  ]

  const coreValues = [
    {
      icon: Eye,
      title: "Vision",
      description:
        "To revolutionize how companies manage their operations through intelligent automation and seamless collaboration.",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      icon: Target,
      title: "Mission",
      description:
        "Empowering businesses of all sizes to achieve operational excellence through innovative management solutions.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Heart,
      title: "Values",
      description:
        "Innovation, integrity, and customer success drive everything we do. We believe in building lasting partnerships.",
      gradient: "from-pink-500 to-cyan-500",
    },
  ]

  const testimonials = [
    {
      quote: "Stratify transformed our project management completely. We've seen 300% improvement in delivery times.",
      author: "Sarah Johnson",
      role: "CEO, TechCorp",
      company: "TechCorp",
      rating: 5,
    },
    {
      quote: "The employee management features are incredible. Our HR processes are now 10x more efficient.",
      author: "Michael Chen",
      role: "HR Director, InnovateLab",
      company: "InnovateLab",
      rating: 5,
    },
    {
      quote: "Best investment we've made. The analytics insights have revolutionized our decision-making process.",
      author: "Emily Rodriguez",
      role: "Operations Manager, GrowthCo",
      company: "GrowthCo",
      rating: 5,
    },
  ]

  const awards = [
    {
      icon: Award,
      title: "Best SaaS Platform 2024",
      organization: "Tech Innovation Awards",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      icon: Shield,
      title: "ISO 27001 Certified",
      organization: "Security & Compliance",
      gradient: "from-primary to-primary",
    },
    {
      icon: Star,
      title: "Top Rated on G2",
      organization: "4.9/5 Customer Rating",
      gradient: "from-blue-400 to-indigo-500",
    },
    {
      icon: Globe,
      title: "Global Excellence",
      organization: "Serving 50+ Countries",
      gradient: "from-purple-400 to-pink-500",
    },
  ]

  const culture = [
    {
      icon: Coffee,
      title: "Work-Life Balance",
      description: "Flexible schedules and remote-first culture",
    },
    {
      icon: TrendingUp,
      title: "Growth Mindset",
      description: "Continuous learning and development opportunities",
    },
    {
      icon: Users,
      title: "Collaborative Spirit",
      description: "Cross-functional teams working towards common goals",
    },
    {
      icon: Zap,
      title: "Innovation First",
      description: "Encouraging creative solutions and bold ideas",
    },
  ]

  const features = [
    {
      icon: Briefcase,
      title: "Project Management",
      description:
        "Streamline your projects from inception to completion with intelligent task allocation and real-time tracking.",
      stats: "500K+ Projects Managed",
    },
    {
      icon: UserCheck,
      title: "Employee Management",
      description:
        "Comprehensive HR solutions including performance tracking, attendance management, and skill development.",
      stats: "2M+ Employees Connected",
    },
    {
      icon: Settings,
      title: "Operations Control",
      description:
        "Centralized dashboard for all internal operations, from inventory to compliance and everything in between.",
      stats: "99.9% Operational Efficiency",
    },
    {
      icon: PieChart,
      title: "Analytics & Insights",
      description: "Data-driven decisions with advanced analytics, custom reports, and predictive intelligence.",
      stats: "10x Better Decision Making",
    },
  ]

  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-founder",
      image: "/professional-woman-ceo.png",
      bio: "Former McKinsey consultant with 15+ years in enterprise software.",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      name: "David Rodriguez",
      role: "CTO & Co-founder",
      image: "/professional-cto-headshot.png",
      bio: "Ex-Google engineer, specialized in scalable systems and AI.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      name: "Emily Johnson",
      role: "VP of Product",
      image: "/professional-woman-vp-headshot.png",
      bio: "Product visionary with a track record of launching successful SaaS platforms.",
      gradient: "from-pink-500 to-cyan-500",
    },
    {
      name: "Michael Park",
      role: "VP of Engineering",
      image: "/placeholder-19h7q.png",
      bio: "Full-stack architect passionate about building robust, scalable solutions.",
      gradient: "from-cyan-500 to-blue-500",
    },
  ]

  return (
    <div className="min-h-screen bg-bg relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <nav className="relative z-50 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 lg:px-8">
        <Navbar />
      </nav>

      {/* Hero Section */}
      <section className="relative z-40 max-w-7xl mx-auto px-6 lg:px-12 pt-20 lg:pt-28 pb-20 lg:pb-28">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-accent/20 to-bg -z-10"></div>

        <div className="text-center max-w-4xl mx-auto space-y-10">
          {/* Tagline */}
          <div className="inline-flex items-center space-x-3 bg-surface/90 backdrop-blur-md border border-accent px-5 py-2.5 rounded-full shadow-md">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-text tracking-wide">
              The Future of Company Management
            </span>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Empowering Companies with{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Smart Management
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted font-light leading-relaxed">
            Stratify helps businesses streamline{" "}
            <span className="font-semibold text-primary">employees</span>,{" "}
            <span className="font-semibold text-primary">projects</span>, and{" "}
            <span className="font-semibold text-primary">growth</span> — all in one
            powerful platform.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            <div className="p-6 bg-surface rounded-2xl shadow-lg hover:shadow-2xl transition border-2 border-accent">
              <Users className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg text-text">Employee Hub</h3>
              <p className="text-sm text-muted mt-2">
                Centralize employee profiles, roles & performance tracking.
              </p>
            </div>
            <div className="p-6 bg-surface rounded-2xl shadow-lg hover:shadow-2xl transition border-2 border-accent">
              <Building2 className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg text-text">Project Control</h3>
              <p className="text-sm text-muted mt-2">
                Assign, monitor, and deliver projects with clarity & speed.
              </p>
            </div>
            <div className="p-6 bg-surface rounded-2xl shadow-lg hover:shadow-2xl transition border-2 border-accent">
              <Globe className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg text-text">Global Scalability</h3>
              <p className="text-sm text-muted mt-2">
                Built to support businesses across countries and cultures.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all"
              >
                <div className="text-3xl font-extrabold">{stat.number}</div>
                <div className="text-sm mt-2 opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Company Story Section */}
      <section className="relative z-40 bg-bg py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-heading mb-8">
              Our{" "}
              <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">Story</span>
            </h2>
            <div className="prose prose-lg sm:prose-xl max-w-none text-muted leading-relaxed space-y-6">
              <p className="text-xl sm:text-2xl">
                Founded in 2019 by a team of former McKinsey consultants and Google engineers, Stratify was born from a
                simple observation: businesses were drowning in complexity while simple, powerful solutions remained out
                of reach.
              </p>
              <p className="text-lg sm:text-xl">
                We started with a vision to democratize enterprise-grade management tools, making them accessible to
                businesses of all sizes. Today, we're proud to serve over 50,000 companies across 50+ countries, from
                startups to Fortune 500 enterprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative z-40 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-heading mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
                Foundation
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted max-w-3xl mx-auto">
              These core principles guide every decision we make and shape the culture that drives our success.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-surface rounded-3xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 border-2 border-accent"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                ></div>
                <div className="relative z-10">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-heading mb-4">{value.title}</h3>
                  <p className="text-muted leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-40 bg-bg py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-heading mb-6">
              What Our{" "}
              <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
                Clients Say
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted max-w-3xl mx-auto">
              Don't just take our word for it. Here's what industry leaders say about Stratify.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-surface rounded-3xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-accent"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-primary mb-4" />
                <p className="text-text leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
                <div className="border-t-2 border-accent pt-4">
                  <p className="font-bold text-heading">{testimonial.author}</p>
                  <p className="text-primary text-sm">{testimonial.role}</p>
                  <p className="text-muted text-sm">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-40 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-heading mb-6">
              Awards &{" "}
              <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
                Recognition
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted max-w-3xl mx-auto">
              Our commitment to excellence has been recognized by industry leaders worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, index) => (
              <div
                key={index}
                className="bg-surface rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-accent text-center"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${award.gradient} rounded-2xl flex items-center justify-center mb-4 mx-auto`}
                >
                  <award.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-heading mb-2">{award.title}</h3>
                <p className="text-muted text-sm">{award.organization}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-40 bg-bg py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-heading mb-6">
              What We{" "}
              <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">Offer</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted max-w-3xl mx-auto">
              Comprehensive solutions designed to streamline every aspect of your business operations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-surface rounded-3xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 border-2 border-accent relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/30 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-heading mb-4">{feature.title}</h3>
                      <p className="text-muted leading-relaxed mb-6">{feature.description}</p>
                      <div className="inline-flex items-center space-x-2 bg-accent/30 px-4 py-2 rounded-full border-2 border-accent">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-text">{feature.stats}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-40 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-heading mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">Culture</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted max-w-3xl mx-auto">
              We believe that great products come from great people working in an environment that fosters creativity
              and growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {culture.map((item, index) => (
              <div
                key={index}
                className="bg-surface rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-accent text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-heading mb-2">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative z-40 bg-bg py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-heading mb-6">
              Meet Our{" "}
              <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">Leaders</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted max-w-3xl mx-auto">
              Visionaries, innovators, and industry experts driving the future of business management.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group bg-surface rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 border-2 border-accent"
              >
                <div className={`h-2 bg-gradient-to-r ${member.gradient}`}></div>
                <div className="p-8 text-center">
                  <div className="relative mb-6">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto shadow-md group-hover:scale-110 transition-transform duration-300"
                    />
                    <div
                      className={`absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r ${member.gradient} rounded-full flex items-center justify-center`}
                    >
                      <Star className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-heading mb-2">{member.name}</h3>
                  <p className="text-primary font-semibold mb-4">{member.role}</p>
                  <p className="text-muted text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-40 bg-gradient-to-r from-primary to-primary py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Join thousands of companies that have revolutionized their operations with Stratify.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-white text-primary px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <span className="flex items-center justify-center space-x-3">
                  <span>Start Your Free Trial</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </button>

              <button className="group flex items-center justify-center space-x-3 border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105">
                <MessageSquare className="w-5 h-5" />
                <span>Schedule a Demo</span>
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-white/80">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Setup in minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default AboutPage
