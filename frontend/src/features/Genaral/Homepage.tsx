import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, CheckCircle, Zap, Globe, Users, TrendingUp, Star } from 'lucide-react';
import { Navbar } from './Navbar';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const floatingElements = [
    { icon: Zap, color: 'text-yellow-500', delay: '0s' },
    { icon: Globe, color: 'text-blue-500', delay: '0.5s' },
    { icon: Users, color: 'text-green-500', delay: '1s' },
    { icon: TrendingUp, color: 'text-purple-500', delay: '1.5s' },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
     
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating geometric shapes */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-bounce ${i % 3 === 0 ? 'bg-blue-200' : i % 3 === 1 ? 'bg-purple-200' : 'bg-cyan-200'} opacity-30`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${8 + Math.random() * 8}px`,
              height: `${8 + Math.random() * 8}px`,
              borderRadius: `${Math.random() > 0.5 ? '50%' : '2px'}`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 lg:px-8">
        <Navbar/>
      </nav>

      {/* Hero Content */}
      <div className="relative z-40 max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-24">
        <div className="text-center space-y-16">
          
          {/* Floating Icons */}
          <div className="relative h-24 mb-12">
            {floatingElements.map((Element, index) => (
              <div
                key={index}
                className="absolute animate-bounce"
                style={{
                  left: `${15 + index * 20}%`,
                  animationDelay: Element.delay,
                  animationDuration: '3s'
                }}
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border-2 border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110">
                  <Element.icon className={`w-8 h-8 ${Element.color}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className={`space-y-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Badge */}
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 px-6 py-3 rounded-full shadow-lg">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>
              <span className="text-gray-800 font-semibold">Rated #1 Business Platform 2024</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            {/* Main Headline */}
            <div className="space-y-8">
              <h1 className="text-6xl lg:text-8xl font-black leading-tight">
                <span className="block text-gray-900 mb-4">Transform Your</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                  Business Future
                </span>
                <span className="block text-gray-900 text-5xl lg:text-6xl">Today</span>
              </h1>
              
              <p className="text-2xl lg:text-3xl text-gray-600 max-w-5xl mx-auto leading-relaxed font-light">
                Experience the next generation of business management with 
                <span className="text-blue-600 font-semibold"> AI-powered insights</span>, 
                <span className="text-purple-600 font-semibold"> seamless collaboration</span>, and 
                <span className="text-cyan-600 font-semibold"> intelligent automation</span>.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                <span className="relative z-10 flex items-center space-x-3">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button className="group flex items-center space-x-3 bg-white border-2 border-gray-200 text-gray-800 px-12 py-6 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:scale-105">
                <Play className="w-6 h-6 text-blue-600" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-gray-600">
              <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium">No setup fees</span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                <span className="font-medium">Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Dashboard Mockup */}
        <div className="mt-24 relative">
          <div className="relative max-w-6xl mx-auto">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-purple-200 to-cyan-200 rounded-3xl blur-3xl opacity-30 transform scale-105"></div>
            
            {/* Main mockup */}
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-100 transform hover:scale-105 transition-all duration-500">
              {/* Mockup Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                      <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
                      <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                    </div>
                    <span className="text-gray-800 font-bold text-lg">stratify.app</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-600 font-medium">Live Dashboard</span>
                  </div>
                </div>
              </div>

              {/* Mockup Content */}
              <div className="p-10 space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <TrendingUp className="w-10 h-10" />
                      <span className="text-3xl font-bold">+32%</span>
                    </div>
                    <p className="text-blue-100 text-lg font-medium">Revenue Growth</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-8 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <Users className="w-10 h-10" />
                      <span className="text-3xl font-bold">18.2K</span>
                    </div>
                    <p className="text-purple-100 text-lg font-medium">Active Users</p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-8 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <Zap className="w-10 h-10" />
                      <span className="text-3xl font-bold">99.2%</span>
                    </div>
                    <p className="text-cyan-100 text-lg font-medium">Efficiency Score</p>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-gray-200 shadow-inner">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-800 font-bold text-2xl">Performance Analytics</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-600 font-medium">Live Data</span>
                    </div>
                  </div>
                  <div className="h-40 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-xl shadow-lg opacity-80"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="relative z-40 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t-2 border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-3">
              <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">15K+</div>
              <div className="text-gray-600 font-semibold text-lg">Companies Trust Us</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">250K+</div>
              <div className="text-gray-600 font-semibold text-lg">Active Users</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">99.99%</div>
              <div className="text-gray-600 font-semibold text-lg">Uptime SLA</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">180+</div>
              <div className="text-gray-600 font-semibold text-lg">Countries</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;