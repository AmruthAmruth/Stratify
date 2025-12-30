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
  Shield,
  Globe,
  Zap,
  TrendingUp,
  Coffee,
  FolderKanban,
  Calendar,
  Video,
  GitBranch,
  BarChart3,
  Clock,
  Sparkles,
  Layers,
  Workflow,
} from "lucide-react"
import { Navbar } from "./Navbar"
import Footer from "./Footer"

const AboutPage = () => {
  useEffect(() => {
    // Component mounted
  }, [])

  const stats = [
    { number: "10K+", label: "Active Companies", icon: Building2 },
    { number: "500K+", label: "Team Members", icon: Users },
    { number: "2M+", label: "Projects Managed", icon: FolderKanban },
    { number: "99.9%", label: "Uptime SLA", icon: Shield },
  ]

  const coreFeatures = [
    {
      icon: FolderKanban,
      title: "Agile Project Management",
      description:
        "Complete project lifecycle management with sprints, backlogs, user stories, and issues. Track progress with Kanban boards and burndown charts.",
      capabilities: ["Sprint Planning", "Backlog Management", "Issue Tracking", "User Stories"],
    },
    {
      icon: UserCheck,
      title: "HR & Employee Management",
      description:
        "Comprehensive employee management system with department organization, leave tracking, attendance monitoring, and performance reviews.",
      capabilities: ["Employee Profiles", "Leave Management", "Department Structure", "Attendance Tracking"],
    },
    {
      icon: MessageSquare,
      title: "Team Collaboration",
      description:
        "Real-time communication with instant messaging, group chats, video meetings, and file sharing to keep your team connected.",
      capabilities: ["Real-time Chat", "Video Meetings", "Group Discussions", "File Sharing"],
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description:
        "Data-driven decision making with comprehensive analytics, project forecasting, resource allocation insights, and performance metrics.",
      capabilities: ["Project Analytics", "Resource Forecasting", "Performance Metrics", "Custom Reports"],
    },
    {
      icon: Settings,
      title: "Company Customization",
      description:
        "Personalize your workspace with custom themes, company branding, role-based access control, and configurable workflows.",
      capabilities: ["Custom Themes", "Brand Customization", "Role-Based Access", "Workflow Automation"],
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-level security with company data isolation, encrypted communications, secure authentication, and compliance certifications.",
      capabilities: ["Data Encryption", "Company Isolation", "Secure Auth", "Compliance Ready"],
    },
  ]

  const techStack = [
    {
      category: "Frontend",
      technologies: ["React", "TypeScript", "Redux", "Tailwind CSS"],
      icon: Layers,
    },
    {
      category: "Backend",
      technologies: ["Node.js", "Express", "TypeScript", "Clean Architecture"],
      icon: Workflow,
    },
    {
      category: "Database",
      technologies: ["MongoDB", "Redis Cache", "Real-time Sync"],
      icon: PieChart,
    },
    {
      category: "Infrastructure",
      technologies: ["Cloud Hosting", "CDN", "Auto-scaling", "Load Balancing"],
      icon: Globe,
    },
  ]

  const useCases = [
    {
      icon: Briefcase,
      title: "Software Development Teams",
      description:
        "Built specifically for agile teams with sprint planning, issue tracking, backlog management, and velocity metrics. Manage releases, track bugs, and collaborate seamlessly.",
      companies: "500+ Software Companies",
    },
    {
      icon: Building2,
      title: "IT Services & Consulting",
      description:
        "Manage multiple client projects, allocate resources efficiently, track billable hours, and deliver projects on time with comprehensive project management tools.",
      companies: "300+ IT Firms",
    },
    {
      icon: TrendingUp,
      title: "Growing Startups",
      description:
        "Scale your team efficiently with department organization, automated workflows, leave management, and performance tracking as you grow from 10 to 1000+ employees.",
      companies: "1000+ Startups",
    },
  ]

  const timeline = [
    {
      year: "2023",
      title: "Foundation",
      description: "Stratify was founded with a vision to simplify company management for modern businesses.",
    },
    {
      year: "2024",
      title: "Growth",
      description: "Reached 10,000+ companies and launched advanced features like video meetings and analytics.",
    },
    {
      year: "2025",
      title: "Innovation",
      description: "Expanding globally with AI-powered insights, custom theming, and enterprise-grade security.",
    },
  ]

  const values = [
    {
      icon: Target,
      title: "Customer-Centric",
      description: "Every feature we build is designed with our customers' success in mind.",
    },
    {
      icon: Zap,
      title: "Innovation First",
      description: "We constantly innovate to stay ahead of industry trends and customer needs.",
    },
    {
      icon: Heart,
      title: "Quality & Reliability",
      description: "99.9% uptime and enterprise-grade security are our top priorities.",
    },
    {
      icon: Globe,
      title: "Global Mindset",
      description: "Built to serve companies worldwide with multi-language and multi-currency support.",
    },
  ]

  return (
    <div className="min-h-screen bg-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative z-40 max-w-7xl mx-auto px-6 lg:px-12 pt-32 lg:pt-36 pb-20 lg:pb-28">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-3 bg-surface/90 backdrop-blur-md border-2 border-primary/30 px-6 py-3 rounded-full shadow-lg">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-text tracking-wide">
              The Complete Company Management Platform
            </span>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight">
            <span className="block text-heading mb-2">Empowering Companies</span>
            <span className="block text-primary">To Work Smarter</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-muted leading-relaxed max-w-3xl mx-auto">
            Stratify is an all-in-one company management platform that brings together{" "}
            <span className="font-semibold text-primary">project management</span>,{" "}
            <span className="font-semibold text-primary">HR operations</span>,{" "}
            <span className="font-semibold text-primary">team collaboration</span>, and{" "}
            <span className="font-semibold text-primary">analytics</span> in one powerful solution.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-surface border-2 border-borderColor rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-300"
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-black text-primary">{stat.number}</div>
                <div className="text-sm text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is Stratify Section */}
      <section className="relative z-40 bg-accent/10 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-black text-heading mb-6">
                What is <span className="text-primary">Stratify?</span>
              </h2>
            </div>

            <div className="bg-surface rounded-3xl p-8 sm:p-12 shadow-xl border-2 border-borderColor">
              <div className="space-y-6 text-lg text-muted leading-relaxed">
                <p>
                  <span className="font-bold text-heading">Stratify</span> is a comprehensive company management SaaS platform designed to streamline every aspect of your business operations. From managing complex projects with agile methodologies to handling HR operations, team collaboration, and data analytics - Stratify provides everything you need in one unified platform.
                </p>
                <p>
                  Built with modern technology and clean architecture principles, Stratify offers enterprise-grade security with company data isolation, ensuring your sensitive information stays protected. Each company gets its own secure workspace with customizable themes and role-based access control.
                </p>
                <p>
                  Whether you're a startup with 10 employees or an enterprise with thousands, Stratify scales with your needs. Our platform supports agile project management with sprints, backlogs, user stories, and issues, while also providing comprehensive HR features including employee management, leave tracking, department organization, and performance monitoring.
                </p>
                <p className="font-semibold text-primary">
                  With real-time collaboration tools, advanced analytics, and intelligent forecasting, Stratify empowers your team to work smarter, faster, and more efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="relative z-40 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-heading mb-6">
              Comprehensive <span className="text-primary">Feature Set</span>
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Everything you need to manage your company effectively, all in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <div
                key={index}
                className="group bg-surface rounded-3xl p-8 shadow-lg hover:shadow-xl border-2 border-borderColor hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-heading mb-4">{feature.title}</h3>
                <p className="text-muted leading-relaxed mb-6">{feature.description}</p>
                <div className="space-y-2">
                  {feature.capabilities.map((capability, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-text">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="relative z-40 bg-accent/10 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-heading mb-6">
              Built For <span className="text-primary">Your Industry</span>
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Trusted by companies across various industries worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="bg-surface rounded-3xl p-8 shadow-lg hover:shadow-xl border-2 border-borderColor hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-md">
                  <useCase.icon className="w-8 h-8 text-textOnPrimary" />
                </div>
                <h3 className="text-2xl font-bold text-heading mb-4">{useCase.title}</h3>
                <p className="text-muted leading-relaxed mb-6">{useCase.description}</p>
                <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full border-2 border-primary/20">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">{useCase.companies}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="relative z-40 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-heading mb-6">
              Built With <span className="text-primary">Modern Technology</span>
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Leveraging cutting-edge technologies for performance, scalability, and reliability
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="bg-surface rounded-2xl p-6 shadow-lg hover:shadow-xl border-2 border-borderColor hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <tech.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-heading mb-3">{tech.category}</h3>
                <div className="space-y-2">
                  {tech.technologies.map((technology, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span className="text-sm text-muted">{technology}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="relative z-40 bg-accent/10 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-heading mb-6">
              Our <span className="text-primary">Journey</span>
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              From inception to becoming a trusted platform for thousands of companies
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-1 bg-primary/20"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
              {timeline.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-xl">
                      <span className="text-2xl font-bold text-textOnPrimary">{item.year}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-heading mb-3">{item.title}</h3>
                  <p className="text-muted leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="relative z-40 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-heading mb-6">
              Our <span className="text-primary">Core Values</span>
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-surface rounded-2xl p-6 shadow-lg hover:shadow-xl border-2 border-borderColor hover:border-primary/50 transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-heading mb-2">{value.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-40 bg-primary py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl sm:text-5xl font-black text-textOnPrimary leading-tight">
              Ready to Transform Your Company?
            </h2>
            <p className="text-xl text-textOnPrimary/90 max-w-3xl mx-auto leading-relaxed">
              Join thousands of companies using Stratify to streamline operations, boost productivity, and scale efficiently.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-surface text-primary px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <span className="flex items-center justify-center space-x-3">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </button>

              <button className="group flex items-center justify-center space-x-3 border-3 border-surface text-textOnPrimary px-10 py-4 rounded-2xl font-bold text-lg hover:bg-surface hover:text-primary transition-all duration-300 transform hover:scale-105">
                <MessageSquare className="w-5 h-5" />
                <span>Contact Sales</span>
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-textOnPrimary/90">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Setup in minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AboutPage
