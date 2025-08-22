import { Award, Briefcase, Building2, Heart, Users } from 'lucide-react';
import React from 'react'

const Contact = () => {

    const stats = [
    { number: '500K+', label: 'Projects Managed', icon: Briefcase, color: 'from-blue-500 to-blue-600' },
    { number: '50K+', label: 'Companies Trust Us', icon: Building2, color: 'from-purple-500 to-purple-600' },
    { number: '2M+', label: 'Employees Connected', icon: Users, color: 'from-cyan-500 to-cyan-600' },
    { number: '99.9%', label: 'Customer Satisfaction', icon: Heart, color: 'from-pink-500 to-pink-600' }
  ];
  return (
  <div className="min-h-screen bg-white relative overflow-hidden">

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 sm:opacity-60 animate-pulse"></div>
        <div className="absolute top-20 sm:top-40 right-5 sm:right-10 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 sm:opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 sm:opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Dynamic floating shapes - reduced for mobile */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-bounce ${i % 4 === 0 ? 'bg-blue-200' : i % 4 === 1 ? 'bg-purple-200' : i % 4 === 2 ? 'bg-pink-200' : 'bg-cyan-200'} opacity-20`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${6 + Math.random() * 8}px`,
              height: `${6 + Math.random() * 8}px`,
              borderRadius: `${Math.random() > 0.5 ? '50%' : '3px'}`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>




  <section className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 pb-16 sm:pb-24">
        <div className={`text-center space-y-8 sm:space-y-12 transition-all duration-1000`}>
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg">
            <Award className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
            <span className="text-gray-800 font-semibold text-sm sm:text-base">Trusted by 50,000+ Companies Worldwide</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          {/* Main Headline */}
          <div className="space-y-6 sm:space-y-8">
            <h1 className="text-3xl sm:text-5xl lg:text-8xl font-black leading-tight">
              <span className="block text-gray-900 mb-2 sm:mb-4">Empowering</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2 sm:mb-4">
                Business Excellence
              </span>
              <span className="block text-gray-900 text-2xl sm:text-4xl lg:text-6xl">Through Innovation</span>
            </h1>
            
            <p className="text-base sm:text-xl lg:text-3xl text-gray-600 max-w-5xl mx-auto leading-relaxed font-light px-2">
              At Stratify, we're revolutionizing how companies manage their 
              <span className="text-blue-600 font-semibold"> projects</span>, 
              <span className="text-purple-600 font-semibold"> employees</span>, and 
              <span className="text-cyan-600 font-semibold"> operations</span> with cutting-edge technology.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mt-12 sm:mt-16">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${stat.color} p-4 sm:p-8 rounded-2xl sm:rounded-3xl text-white shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-3xl`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center space-y-2 sm:space-y-4">
                  <stat.icon className="w-6 sm:w-12 h-6 sm:h-12 opacity-90" />
                  <div className="text-center">
                    <div className="text-xl sm:text-4xl lg:text-5xl font-black mb-1 sm:mb-2">{stat.number}</div>
                    <div className="text-xs sm:text-sm font-medium opacity-90">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>






  </div>
  )
}

export default Contact