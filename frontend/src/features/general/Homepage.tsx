"use client"

import { useState, useEffect } from "react"
import {
  ArrowRight,
  Play,
  CheckCircle,
  Users,
  Star,
  Shield,
  BarChart3,
  FolderKanban,
  MessageSquare,
  Video,
  Calendar,
  UserCheck,
  Settings,
  Briefcase,
  Code,
  Headphones,
  Building2,
  Sparkles,
  CheckSquare,
  GitBranch,
  UserPlus,
  PieChart,
  Layers,
} from "lucide-react"
import { Navbar } from "./Navbar"
import Footer from "./Footer"

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [stats, setStats] = useState([
    { value: 0, target: 5000, suffix: "+", label: "Companies Trust Us" },
    { value: 0, target: 50000, suffix: "+", label: "Active Users" },
    { value: 0, target: 99.99, suffix: "%", label: "Uptime SLA" },
    { value: 0, target: 100, suffix: "+", label: "Countries" },
  ])
  const [statsInView, setStatsInView] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsInView) {
          setStatsInView(true)
          animateStats()
        }
      },
      { threshold: 0.2 }
    )

    const statsElement = document.getElementById("stats-section")
    if (statsElement) {
      observer.observe(statsElement)
    }

    return () => {
      if (statsElement) {
        observer.unobserve(statsElement)
      }
    }
  }, [statsInView])

  const animateStats = () => {
    const duration = 2500
    const steps = 60
    const interval = duration / steps

    stats.forEach((stat, index) => {
      let currentStep = 0
      const increment = stat.target / steps

      const timer = setInterval(() => {
        currentStep++
        const newValue = Math.min(currentStep * increment, stat.target)

        setStats(prevStats => {
          const newStats = [...prevStats]
          newStats[index] = { ...newStats[index], value: newValue }
          return newStats
        })

        if (currentStep >= steps) {
          clearInterval(timer)
        }
      }, interval)
    })
  }

  const coreModules = [
    {
      icon: FolderKanban,
      title: "Project Management",
      desc: "Complete agile workflow with sprints, issues, backlogs, and user stories",
      size: "large",
      variant: "primary"
    },
    {
      icon: MessageSquare,
      title: "Team Collaboration",
      desc: "Real-time chat, video meetings, and group discussions",
      size: "small",
      variant: "surface"
    },
    {
      icon: UserCheck,
      title: "HR Management",
      desc: "Employee onboarding, leave tracking, and department organization",
      size: "small",
      variant: "surface"
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      desc: "Project performance, team metrics, and resource allocation",
      size: "medium",
      variant: "accent"
    },
    {
      icon: Settings,
      title: "Customization",
      desc: "Company theming, role-based access, and notifications",
      size: "medium",
      variant: "surface"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      desc: "Company isolation, secure authentication, and data protection",
      size: "small",
      variant: "primary"
    },
  ]

  const useCases = [
    {
      icon: Code,
      title: "Software Development Teams",
      desc: "Built for agile teams with sprint planning, issue tracking, backlog management, and Kanban boards. Track velocity, manage releases, and collaborate seamlessly.",
      features: ["Sprint Planning", "Issue Tracking", "Backlog Management", "Velocity Metrics"],
    },
    {
      icon: Briefcase,
      title: "IT Services Companies",
      desc: "Manage multiple client projects, allocate resources efficiently, track billable hours, and deliver projects on time with comprehensive project management tools.",
      features: ["Multi-Project Management", "Resource Allocation", "Time Tracking", "Client Portals"],
    },
    {
      icon: Headphones,
      title: "Consulting Firms",
      desc: "Organize client engagements, manage consultant assignments, track project profitability, and maintain detailed project documentation.",
      features: ["Client Management", "Consultant Allocation", "Profitability Tracking", "Documentation"],
    },
    {
      icon: Building2,
      title: "Growing Startups",
      desc: "Scale your team efficiently with department organization, automated workflows, leave management, and performance tracking as you grow.",
      features: ["Department Setup", "Workflow Automation", "Leave Management", "Performance Reviews"],
    },
  ]

  const features = [
    {
      icon: GitBranch,
      title: "Agile Project Management",
      desc: "Sprint planning, issue tracking, backlog management with Kanban boards",
    },
    {
      icon: Calendar,
      title: "Smart Leave Management",
      desc: "Automated approvals, calendar integration, and balance tracking",
    },
    {
      icon: Video,
      title: "Real-time Collaboration",
      desc: "Instant messaging, video meetings, file sharing, and group chats",
    },
    {
      icon: Users,
      title: "Department Management",
      desc: "Hierarchical organization, manager assignments, and team structuring",
    },
    {
      icon: Shield,
      title: "Advanced Security",
      desc: "Role-based access control, company isolation, and secure authentication",
    },
    {
      icon: Sparkles,
      title: "Custom Theming",
      desc: "Brand customization per company with multiple theme presets",
    },
  ]

  const howItWorks = [
    {
      step: "1",
      icon: Building2,
      title: "Company Registration",
      desc: "Sign up and configure your company profile",
    },
    {
      step: "2",
      icon: UserPlus,
      title: "Team Creation",
      desc: "Add departments, managers, and employees",
    },
    {
      step: "3",
      icon: FolderKanban,
      title: "Project Setup",
      desc: "Initialize projects with sprints and issues",
    },
    {
      step: "4",
      icon: MessageSquare,
      title: "Collaborate",
      desc: "Use real-time chat and meetings",
    },
    {
      step: "5",
      icon: PieChart,
      title: "Insights",
      desc: "Analyze performance and optimize",
    },
  ]

  return (
    <div className="min-h-screen bg-bg relative overflow-hidden">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-accent/30 to-bg"></div>
          <div className="absolute top-20 left-10 w-96 h-96 bg-accent/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div
            className="absolute top-40 right-10 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/3 w-96 h-96 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
          <div
            className="absolute w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl transition-all duration-1000 ease-out pointer-events-none"
            style={{
              left: mousePosition.x - 192,
              top: mousePosition.y - 192,
            }}
          ></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.03]"></div>
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto text-center space-y-8 sm:space-y-10 lg:space-y-12">
            <div
              className={`space-y-6 sm:space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-surface/90 backdrop-blur-md border-2 border-primary/30 px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-primary fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
                <span className="text-text font-bold text-sm sm:text-base">Complete Company Management Platform</span>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50"></div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight">
                  <span className="block text-heading mb-2 animate-slide-up">Streamline Your</span>
                  <span className="block text-primary mb-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                    Entire Organization
                  </span>
                  <span
                    className="block text-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl animate-slide-up"
                    style={{ animationDelay: "0.4s" }}
                  >
                    In One Platform
                  </span>
                </h1>

                <p
                  className="text-xl sm:text-2xl lg:text-3xl text-muted max-w-4xl mx-auto leading-relaxed animate-fade-in"
                  style={{ animationDelay: "0.6s" }}
                >
                  From <span className="text-primary font-semibold">agile project management</span> to{" "}
                  <span className="text-primary font-semibold">HR operations</span>, from{" "}
                  <span className="text-primary font-semibold">real-time collaboration</span> to{" "}
                  <span className="text-primary font-semibold">advanced analytics</span>
                </p>
              </div>

              <div
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in"
                style={{ animationDelay: "0.8s" }}
              >
                <button className="group relative bg-primary hover:bg-primaryHover text-textOnPrimary px-10 sm:px-14 py-5 sm:py-6 rounded-2xl font-bold text-xl sm:text-2xl shadow-2xl hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300 overflow-hidden w-full sm:w-auto">
                  <span className="relative z-10 flex items-center justify-center space-x-3">
                    <span>Start Free Trial</span>
                    <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 group-hover:translate-x-2 transition-transform" />
                  </span>
                </button>

                <button className="group flex items-center justify-center space-x-3 bg-surface/90 backdrop-blur-md border-2 border-primary/30 text-text px-10 sm:px-14 py-5 sm:py-6 rounded-2xl font-bold text-xl sm:text-2xl shadow-xl hover:shadow-2xl hover:border-primary hover:bg-surface transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                  <Play className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:scale-110 transition-transform" />
                  <span>Watch Demo</span>
                </button>
              </div>

              <div
                className="flex flex-wrap justify-center gap-4 lg:gap-6 text-text animate-fade-in"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center space-x-2 bg-surface/90 backdrop-blur-md border-2 border-primary/20 px-4 sm:px-5 py-2 sm:py-3 rounded-full shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  <span className="font-medium text-base sm:text-lg text-text">14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2 bg-surface/90 backdrop-blur-md border-2 border-primary/20 px-4 sm:px-5 py-2 sm:py-3 rounded-full shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  <span className="font-medium text-base sm:text-lg text-text">No setup fees</span>
                </div>
                <div className="flex items-center space-x-2 bg-surface/90 backdrop-blur-md border-2 border-primary/20 px-4 sm:px-5 py-2 sm:py-3 rounded-full shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  <span className="font-medium text-base sm:text-lg text-text">Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Modules - Bento Grid */}
      <div className="w-full bg-gradient-to-br from-bg via-accent/20 to-bg py-20 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-heading mb-4 sm:mb-6">
              Complete Suite of Management Tools
            </h2>
            <p className="text-xl sm:text-2xl text-muted max-w-3xl mx-auto">
              Everything you need to run your company efficiently, all integrated
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {coreModules.map((module, index) => (
              <div
                key={index}
                className={`group ${module.size === "large" ? "md:col-span-2 lg:row-span-2" : ""} ${module.size === "medium" ? "lg:col-span-2" : ""
                  } ${module.variant === "primary"
                    ? "bg-primary"
                    : module.variant === "accent"
                      ? "bg-accent"
                      : "bg-surface"
                  } rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-300 border-2 ${module.variant === "primary" || module.variant === "accent"
                    ? "border-transparent"
                    : "border-borderColor"
                  } hover:border-primary/50`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`flex flex-col ${module.size === "large" ? "justify-between h-full" : ""} space-y-4 sm:space-y-6`}>
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 ${module.variant === "primary"
                      ? "bg-surface/20 backdrop-blur-sm"
                      : "bg-primary/10"
                    } rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all shadow-lg`}>
                    <module.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${module.variant === "primary" ? "text-textOnPrimary" : "text-primary"
                      }`} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-xl sm:text-2xl ${module.size === "large" ? "lg:text-3xl" : ""} mb-3 ${module.variant === "primary" ? "text-textOnPrimary" : "text-heading"
                      }`}>
                      {module.title}
                    </h3>
                    <p className={`text-base sm:text-lg ${module.size === "large" ? "lg:text-xl" : ""} leading-relaxed ${module.variant === "primary" ? "text-textOnPrimary/90" : "text-muted"
                      }`}>
                      {module.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases */}
      {useCases.map((useCase, index) => (
        <div
          key={index}
          className={`w-full relative overflow-hidden ${index % 2 === 0 ? "bg-accent/10" : "bg-bg"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
              <div className={`space-y-6 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-2xl shadow-xl">
                  <useCase.icon className="w-8 h-8 sm:w-10 sm:h-10 text-textOnPrimary" />
                </div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-heading">{useCase.title}</h3>
                <p className="text-lg sm:text-xl text-muted leading-relaxed">{useCase.desc}</p>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4">
                  {useCase.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-text font-medium text-sm sm:text-base">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`relative ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="relative bg-primary rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl border-2 border-transparent">
                  <div className="aspect-video bg-surface/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Layers className="w-16 h-16 sm:w-20 sm:h-20 text-textOnPrimary/80 mx-auto" />
                      <p className="text-textOnPrimary/90 font-semibold text-lg sm:text-xl">Dashboard Preview</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Features Grid */}
      <div className="w-full bg-gradient-to-br from-accent/10 via-bg to-accent/10 py-20 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-heading mb-4 sm:mb-6">
              Powerful Features That Drive Results
            </h2>
            <p className="text-xl sm:text-2xl text-muted max-w-3xl mx-auto">
              Comprehensive capabilities designed to transform how your organization works
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-2 border-borderColor rounded-3xl overflow-hidden shadow-2xl">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group bg-surface p-8 sm:p-10 hover:bg-accent/20 transition-all duration-300 border-r-2 border-b-2 border-borderColor hover:border-primary/40 ${index % 3 !== 2 ? "lg:border-r-2" : ""
                  } ${index < 3 ? "lg:border-b-2" : ""} ${index % 2 !== 1 ? "sm:border-r-2" : ""} ${index < 4 ? "sm:border-b-2" : ""
                  }`}
              >
                <div className="flex flex-col space-y-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all shadow-lg">
                    <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-heading text-xl sm:text-2xl mb-2">{feature.title}</h3>
                    <p className="text-muted text-base sm:text-lg leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="w-full bg-bg py-20 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-heading mb-4 sm:mb-6">Get Started in Minutes</h2>
            <p className="text-xl sm:text-2xl text-muted max-w-3xl mx-auto">
              Simple onboarding process to get your entire team up and running
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-accent"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4 relative z-10">
              {howItWorks.map((step, index) => (
                <div key={index} className="group text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-24 h-24 bg-surface border-4 border-primary/30 rounded-full flex items-center justify-center shadow-2xl group-hover:shadow-3xl group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                      <step.icon className="w-12 h-12 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-primary text-textOnPrimary rounded-full flex items-center justify-center font-bold text-lg shadow-xl">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="font-bold text-heading text-xl sm:text-2xl mb-3">{step.title}</h3>
                  <p className="text-muted text-base sm:text-lg leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="w-full bg-gradient-to-br from-accent/10 via-bg to-accent/10 py-20 sm:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-heading mb-4 sm:mb-6">Your Command Center</h2>
            <p className="text-xl sm:text-2xl text-muted max-w-3xl mx-auto">
              Real-time insights and control over your entire organization
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-3xl opacity-50 transform scale-105"></div>

            <div className="relative bg-surface rounded-3xl overflow-hidden shadow-2xl border-4 border-borderColor">
              <div className="bg-accent/30 p-6 border-b-4 border-borderColor">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      <div className="w-4 h-4 bg-primary rounded-full"></div>
                      <div className="w-4 h-4 bg-accent rounded-full"></div>
                      <div className="w-4 h-4 bg-text rounded-full"></div>
                    </div>
                    <span className="text-text font-bold text-lg">stratify.app/dashboard</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-muted font-medium">Live</span>
                  </div>
                </div>
              </div>

              <div className="p-8 lg:p-12 space-y-8 bg-bg">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-primary p-8 rounded-2xl shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                      <FolderKanban className="w-10 h-10 text-textOnPrimary" />
                      <span className="text-4xl font-bold text-textOnPrimary">12</span>
                    </div>
                    <p className="text-textOnPrimary/90 text-lg font-medium">Active Projects</p>
                  </div>
                  <div className="bg-surface border-4 border-borderColor p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <Users className="w-10 h-10 text-primary" />
                      <span className="text-4xl font-bold text-heading">48</span>
                    </div>
                    <p className="text-muted text-lg font-medium">Team Members</p>
                  </div>
                  <div className="bg-accent border-4 border-borderColor p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <Calendar className="w-10 h-10 text-primary" />
                      <span className="text-4xl font-bold text-heading">7</span>
                    </div>
                    <p className="text-muted text-lg font-medium">Pending Leaves</p>
                  </div>
                  <div className="bg-surface border-4 border-borderColor p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <CheckSquare className="w-10 h-10 text-primary" />
                      <span className="text-4xl font-bold text-heading">85%</span>
                    </div>
                    <p className="text-muted text-lg font-medium">Sprint Progress</p>
                  </div>
                </div>

                <div className="bg-surface rounded-2xl p-8 border-4 border-borderColor shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-heading font-bold text-2xl">Project Performance</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-muted font-medium">Real-time</span>
                    </div>
                  </div>
                  <div className="h-48 bg-gradient-to-r from-primary/20 via-accent/60 to-primary/20 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div id="stats-section" className="w-full bg-accent/20 border-y-4 border-borderColor py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-3">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary">
                  {stat.value % 1 !== 0 ? stat.value.toFixed(2) : Math.floor(stat.value)}
                  {stat.suffix}
                </div>
                <div className="text-muted font-semibold text-base sm:text-lg lg:text-xl">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="w-full bg-primary py-20 sm:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-surface/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-surface/10 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-textOnPrimary">Ready to Transform Your Company?</h2>
          <p className="text-2xl sm:text-3xl text-textOnPrimary/90 max-w-3xl mx-auto">
            Join thousands of companies using Stratify to streamline operations
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4">
            <button className="group bg-surface text-primary hover:bg-surface/90 px-12 sm:px-16 py-6 sm:py-7 rounded-2xl font-bold text-xl sm:text-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto">
              <span className="flex items-center justify-center space-x-3">
                <span>Get Started Free</span>
                <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
            <button className="group bg-transparent border-4 border-surface text-textOnPrimary hover:bg-surface hover:text-primary px-12 sm:px-16 py-6 sm:py-7 rounded-2xl font-bold text-xl sm:text-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
              Schedule a Demo
            </button>
          </div>
          <p className="text-textOnPrimary/80 text-lg sm:text-xl pt-4">
            No credit card required • 14-day free trial • Setup in minutes
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default HomePage