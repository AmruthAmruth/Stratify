"use client"

import { useState, useEffect } from "react"
import {
  ArrowRight,
  Play,
  CheckCircle,
  Zap,
  Globe,
  Users,
  TrendingUp,
  Star,
  Shield,
  Clock,
  Rocket,
  BarChart3,
  Target,
  Award,
} from "lucide-react"
import { Navbar } from "./Navbar"
import Footer from "./Footer"
import CountUp from "react-countup"
import { useInView } from "react-intersection-observer"
import UserFeedback from "./Common/UserFeedback"

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const floatingElements = [
    { icon: Zap, color: "text-yellow-500", delay: "0s" },
    { icon: Globe, color: "text-blue-500", delay: "0.5s" },
    { icon: Users, color: "text-green-500", delay: "1s" },
    { icon: TrendingUp, color: "text-purple-500", delay: "1.5s" },
  ]

  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      desc: "Bank-level encryption & compliance",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: Clock,
      title: "Real-time Sync",
      desc: "Instant updates across all devices",
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      icon: Rocket,
      title: "Lightning Fast",
      desc: "50% faster than competitors",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      desc: "AI-powered insights and reporting",
      color: "text-cyan-500",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
    },
    {
      icon: Target,
      title: "Goal Tracking",
      desc: "Set and achieve business objectives",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      icon: Award,
      title: "Premium Support",
      desc: "24/7 dedicated customer success",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
  ]


    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  const stats = [
    { value: 5000, suffix: "+", label: "Companies Trust Us", gradient: "from-blue-600 to-purple-600" },
    { value: 50000, suffix: "+", label: "Active Users", gradient: "from-purple-600 to-cyan-600" },
    { value: 99.99, suffix: "%", label: "Uptime SLA", gradient: "from-cyan-600 to-blue-600" },
    { value: 100, suffix: "+", label: "Countries", gradient: "from-blue-600 to-purple-600" },
  ]
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden mt-16">
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div
          className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-r from-cyan-200/30 to-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Interactive cursor effect */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full mix-blend-multiply filter blur-3xl transition-all duration-1000 ease-out pointer-events-none"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <Navbar />
      </nav>

      <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 lg:pb-24">
        {/* Hero Content */}
        <div className="text-center space-y-8 sm:space-y-12 lg:space-y-16">
          <div className="relative h-16 sm:h-20 lg:h-24 mb-84 sm:mb-12">
            {floatingElements.map((Element, index) => (
              <div
                key={index}
                className="absolute animate-bounce"
                style={{
                  left: `${10 + index * 20}%`,
                  animationDelay: Element.delay,
                  animationDuration: "3s",
                }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                  <Element.icon className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${Element.color}`} />
                </div>
              </div>
            ))}
          </div>

          <div
            className={`space-y-8 sm:space-y-10 lg:space-y-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg animate-fade-in">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                ))}
              </div>
              <span className="text-gray-800 font-semibold text-sm sm:text-base">Rated #1 Business Platform 2024</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight">
                <span className="block text-gray-900 mb-2 sm:mb-4 animate-slide-up">Transform Your</span>
                <span
                  className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2 sm:mb-4 animate-slide-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  Business Future
                </span>
                <span
                  className="block text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl animate-slide-up"
                  style={{ animationDelay: "0.4s" }}
                >
                  Today
                </span>
              </h1>

              <p
                className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light animate-fade-in"
                style={{ animationDelay: "0.6s" }}
              >
                Experience the next generation of business management with
                <span className="text-blue-600 font-semibold"> AI-powered insights</span>,
                <span className="text-purple-600 font-semibold"> seamless collaboration</span>, and
                <span className="text-cyan-600 font-semibold"> intelligent automation</span>.
              </p>
            </div>

            <div
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in"
              style={{ animationDelay: "0.8s" }}
            >
              <button className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white px-8 sm:px-12 py-4 sm:py-6 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden w-full sm:w-auto">
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button className="group flex items-center justify-center space-x-3 bg-white border border-gray-200 text-gray-800 px-8 sm:px-12 py-4 sm:py-6 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl shadow-lg hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                <Play className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <span>Watch Demo</span>
              </button>
            </div>

            <div
              className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-8 text-gray-600 animate-fade-in"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center space-x-2 bg-green-50 px-3 sm:px-4 py-2 rounded-full border border-green-200">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span className="font-medium text-sm sm:text-base">14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 px-3 sm:px-4 py-2 rounded-full border border-blue-200">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="font-medium text-sm sm:text-base">No setup fees</span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-50 px-3 sm:px-4 py-2 rounded-full border border-purple-200">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                <span className="font-medium text-sm sm:text-base">Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 sm:mt-20 lg:mt-24">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
              Why Choose Our Platform?
            </h2>
            <p
              className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Discover the features that make us the preferred choice for modern businesses
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group ${feature.bgColor} ${feature.borderColor} border-2 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <feature.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg sm:text-xl mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 sm:mt-20 lg:mt-24 relative">
          <div className="relative max-w-6xl mx-auto">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-purple-200 to-cyan-200 rounded-2xl sm:rounded-3xl blur-3xl opacity-30 transform scale-105 animate-pulse"></div>

            {/* Main mockup */}
            <div className="relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-gray-100 transform hover:scale-105 transition-all duration-500 animate-fade-in">
              {/* Mockup Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex space-x-1 sm:space-x-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full shadow-sm"></div>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded-full shadow-sm"></div>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full shadow-sm"></div>
                    </div>
                    <span className="text-gray-800 font-bold text-sm sm:text-lg">stratify.app</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-600 font-medium text-xs sm:text-sm">Live Dashboard</span>
                  </div>
                </div>
              </div>

              {/* Mockup Content */}
              <div className="p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 sm:p-8 rounded-xl sm:rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10" />
                      <span className="text-2xl sm:text-3xl font-bold">+32%</span>
                    </div>
                    <p className="text-blue-100 text-base sm:text-lg font-medium">Revenue Growth</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 sm:p-8 rounded-xl sm:rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <Users className="w-8 h-8 sm:w-10 sm:h-10" />
                      <span className="text-2xl sm:text-3xl font-bold">18.2K</span>
                    </div>
                    <p className="text-purple-100 text-base sm:text-lg font-medium">Active Users</p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-6 sm:p-8 rounded-xl sm:rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <Zap className="w-8 h-8 sm:w-10 sm:h-10" />
                      <span className="text-2xl sm:text-3xl font-bold">99.2%</span>
                    </div>
                    <p className="text-cyan-100 text-base sm:text-lg font-medium">Efficiency Score</p>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-inner">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                    <h3 className="text-gray-800 font-bold text-xl sm:text-2xl">Performance Analytics</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-600 font-medium text-sm sm:text-base">Live Data</span>
                    </div>
                  </div>
                  <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-lg sm:rounded-xl shadow-lg opacity-80 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



<UserFeedback/>


        <div ref={ref} className="relative z-40 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-2 sm:space-y-3 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {inView ? (
                  <CountUp end={stat.value} duration={2.5} separator="," decimals={stat.value % 1 !== 0 ? 2 : 0} />
                ) : (
                  "0"
                )}
                {stat.suffix}
              </div>
              <div className="text-gray-600 font-semibold text-sm sm:text-base lg:text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

<Footer/>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
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
