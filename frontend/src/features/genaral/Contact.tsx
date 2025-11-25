import React from 'react'
import { Layers, Zap, Lock, Workflow } from 'lucide-react';
const ContactPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: '#fbfbfb' }}>
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 rounded-full mb-4" style={{ backgroundColor: '#009063' }}>
            <span className="text-white font-semibold">TECHNOLOGY STACK</span>
          </div>
          <h1 className="text-6xl font-bold mb-4" style={{ color: '#3b3b3b' }}>
            Stratify
          </h1>
          <p className="text-xl" style={{ color: '#3b3b3b', opacity: 0.8 }}>
            Enterprise-grade architecture built from the ground up
          </p>
        </div>

        {/* Main Tech Stack - Layered View */}
        <div className="space-y-4 mb-12">
          {/* Layer 1 - Frontend */}
          <div 
            className="p-6 rounded-xl border-l-8 shadow-sm"
            style={{ backgroundColor: '#ffffff', borderColor: '#009063' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold" style={{ color: '#009063' }}>01</div>
                <div>
                  <h3 className="text-xl font-bold mb-1" style={{ color: '#3b3b3b' }}>Frontend Layer</h3>
                  <p className="text-sm" style={{ color: '#3b3b3b', opacity: 0.7 }}>User Interface & Experience</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center px-4 py-2 rounded-lg" style={{ backgroundColor: '#dfdcef' }}>
                  <p className="font-bold text-sm" style={{ color: '#3b3b3b' }}>React</p>
                </div>
                <div className="text-center px-4 py-2 rounded-lg" style={{ backgroundColor: '#dfdcef' }}>
                  <p className="font-bold text-sm" style={{ color: '#3b3b3b' }}>TypeScript</p>
                </div>
                <div className="text-center px-4 py-2 rounded-lg" style={{ backgroundColor: '#dfdcef' }}>
                  <p className="font-bold text-sm" style={{ color: '#3b3b3b' }}>Tailwind CSS</p>
                </div>
              </div>
            </div>
          </div>

          {/* Layer 2 - Business Logic */}
          <div 
            className="p-6 rounded-xl border-l-8 shadow-sm ml-8"
            style={{ backgroundColor: '#ffffff', borderColor: '#009063' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold" style={{ color: '#009063' }}>02</div>
                <div>
                  <h3 className="text-xl font-bold mb-1" style={{ color: '#3b3b3b' }}>Business Logic Layer</h3>
                  <p className="text-sm" style={{ color: '#3b3b3b', opacity: 0.7 }}>Application Core & Services</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center px-4 py-2 rounded-lg" style={{ backgroundColor: '#dfdcef' }}>
                  <p className="font-bold text-sm" style={{ color: '#3b3b3b' }}>Node.js</p>
                </div>
                <div className="text-center px-4 py-2 rounded-lg" style={{ backgroundColor: '#dfdcef' }}>
                  <p className="font-bold text-sm" style={{ color: '#3b3b3b' }}>Express</p>
                </div>
                <div className="text-center px-4 py-2 rounded-lg" style={{ backgroundColor: '#dfdcef' }}>
                  <p className="font-bold text-sm" style={{ color: '#3b3b3b' }}>Clean Architecture</p>
                </div>
              </div>
            </div>
          </div>

          {/* Layer 3 - Data Layer */}
          <div 
            className="p-6 rounded-xl border-l-8 shadow-sm ml-16"
            style={{ backgroundColor: '#ffffff', borderColor: '#009063' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold" style={{ color: '#009063' }}>03</div>
                <div>
                  <h3 className="text-xl font-bold mb-1" style={{ color: '#3b3b3b' }}>Data Layer</h3>
                  <p className="text-sm" style={{ color: '#3b3b3b', opacity: 0.7 }}>Database & Persistence</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center px-4 py-2 rounded-lg" style={{ backgroundColor: '#dfdcef' }}>
                  <p className="font-bold text-sm" style={{ color: '#3b3b3b' }}>MongoDB</p>
                </div>
                <div className="text-center px-4 py-2 rounded-lg" style={{ backgroundColor: '#dfdcef' }}>
                  <p className="font-bold text-sm" style={{ color: '#3b3b3b' }}>Mongoose</p>
                </div>
                <div className="text-center px-4 py-2 rounded-lg" style={{ backgroundColor: '#dfdcef' }}>
                  <p className="font-bold text-sm" style={{ color: '#3b3b3b' }}>Multi-Tenant</p>
                </div>
              </div>
            </div>
          </div>

          {/* Layer 4 - Security */}
          <div 
            className="p-6 rounded-xl border-l-8 shadow-sm ml-24"
            style={{ backgroundColor: '#ffffff', borderColor: '#009063' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold" style={{ color: '#009063' }}>04</div>
                <div>
                  <h3 className="text-xl font-bold mb-1" style={{ color: '#3b3b3b' }}>Security Layer</h3>
                  <p className="text-sm" style={{ color: '#3b3b3b', opacity: 0.7 }}>Authentication & Authorization</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center px-4 py-2 rounded-lg" style={{ backgroundColor: '#dfdcef' }}>
                  <p className="font-bold text-sm" style={{ color: '#3b3b3b' }}>JWT</p>
                </div>
                <div className="text-center px-4 py-2 rounded-lg" style={{ backgroundColor: '#dfdcef' }}>
                  <p className="font-bold text-sm" style={{ color: '#3b3b3b' }}>RBAC</p>
                </div>
                <div className="text-center px-4 py-2 rounded-lg" style={{ backgroundColor: '#dfdcef' }}>
                  <p className="font-bold text-sm" style={{ color: '#3b3b3b' }}>Data Isolation</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Principles Grid */}
        <div className="grid grid-cols-4 gap-6 mt-16">
          <div 
            className="p-6 rounded-xl text-center border-2"
            style={{ backgroundColor: '#fbfbfb', borderColor: '#dfdcef' }}
          >
            <div className="inline-flex p-4 rounded-full mb-4" style={{ backgroundColor: '#009063' }}>
              <Layers className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-2" style={{ color: '#3b3b3b' }}>SOLID</h4>
            <p className="text-sm" style={{ color: '#3b3b3b', opacity: 0.7 }}>Design principles followed</p>
          </div>

          <div 
            className="p-6 rounded-xl text-center border-2"
            style={{ backgroundColor: '#fbfbfb', borderColor: '#dfdcef' }}
          >
            <div className="inline-flex p-4 rounded-full mb-4" style={{ backgroundColor: '#009063' }}>
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-2" style={{ color: '#3b3b3b' }}>Modular</h4>
            <p className="text-sm" style={{ color: '#3b3b3b', opacity: 0.7 }}>Service-based architecture</p>
          </div>

          <div 
            className="p-6 rounded-xl text-center border-2"
            style={{ backgroundColor: '#fbfbfb', borderColor: '#dfdcef' }}
          >
            <div className="inline-flex p-4 rounded-full mb-4" style={{ backgroundColor: '#009063' }}>
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-2" style={{ color: '#3b3b3b' }}>Type-Safe</h4>
            <p className="text-sm" style={{ color: '#3b3b3b', opacity: 0.7 }}>End-to-end TypeScript</p>
          </div>

          <div 
            className="p-6 rounded-xl text-center border-2"
            style={{ backgroundColor: '#fbfbfb', borderColor: '#dfdcef' }}
          >
            <div className="inline-flex p-4 rounded-full mb-4" style={{ backgroundColor: '#009063' }}>
              <Workflow className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-2" style={{ color: '#3b3b3b' }}>Scalable</h4>
            <p className="text-sm" style={{ color: '#3b3b3b', opacity: 0.7 }}>Production patterns</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <div 
            className="inline-block px-8 py-4 rounded-full"
            style={{ backgroundColor: '#009063' }}
          >
            <p className="text-white font-bold text-lg">
              No Templates • No Copy-Paste • Built from First Principles
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage