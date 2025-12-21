import React from 'react';
import { Shield, Eye, Lock, CheckCircle, AlertTriangle, Layers, Bell, CreditCard, FileText } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="w-full h-screen max-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
      <div className="w-full max-w-6xl h-full flex flex-col justify-between py-4">

        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="inline-block relative mb-3">
            <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-40 animate-pulse"></div>
            <Shield className="w-16 h-16 text-cyan-400 relative z-10 mx-auto" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
            THE SILENT GUARDIAN
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-3"></div>
          <p className="text-xl text-gray-400 font-light">Super Admin Control Center</p>
        </div>

        {/* Main Control Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          {/* Card 1 - Company Approvals */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 border-2 border-emerald-500/50 hover:border-emerald-400 transition-all hover:shadow-xl hover:shadow-emerald-500/20 group">
            <div className="bg-emerald-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-7 h-7 text-emerald-400" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Company Approvals</h3>
            <p className="text-gray-400 text-xs">Manage and control company onboarding</p>
          </div>

          {/* Card 2 - Tenant Monitoring */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 border-2 border-purple-500/50 hover:border-purple-400 transition-all hover:shadow-xl hover:shadow-purple-500/20 group">
            <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Eye className="w-7 h-7 text-purple-400" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Tenant Monitoring</h3>
            <p className="text-gray-400 text-xs">Watch over tenants without touching privacy</p>
          </div>

          {/* Card 3 - Billing */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 border-2 border-amber-500/50 hover:border-amber-400 transition-all hover:shadow-xl hover:shadow-amber-500/20 group">
            <div className="bg-amber-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <CreditCard className="w-7 h-7 text-amber-400" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Billing & Subscriptions</h3>
            <p className="text-gray-400 text-xs">Complete control over revenue streams</p>
          </div>

          {/* Card 4 - Announcements */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 border-2 border-blue-500/50 hover:border-blue-400 transition-all hover:shadow-xl hover:shadow-blue-500/20 group">
            <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Bell className="w-7 h-7 text-blue-400" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Platform Announcements</h3>
            <p className="text-gray-400 text-xs">Broadcast critical updates instantly</p>
          </div>

          {/* Card 5 - Audit Logs - Spanning 2 columns */}
          <div className="col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 border-2 border-red-500/50 hover:border-red-400 transition-all hover:shadow-xl hover:shadow-red-500/20 group">
            <div className="flex items-start gap-4">
              <div className="bg-red-500/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-red-400" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Full Audit Logs</h3>
                <p className="text-gray-400 text-xs">Complete visibility into every action across the platform</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Statement Section */}
        <div className="relative">
          {/* Isolation Visual */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-slate-900/50 border-2 border-cyan-500/30 rounded-lg p-4 text-center">
              <Layers className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
              <p className="text-gray-300 text-xs font-medium">Perfect Isolation</p>
            </div>
            <div className="bg-slate-900/50 border-2 border-green-500/30 rounded-lg p-4 text-center">
              <Lock className="w-10 h-10 text-green-400 mx-auto mb-2" />
              <p className="text-gray-300 text-xs font-medium">Invisible Security</p>
            </div>
            <div className="bg-slate-900/50 border-2 border-red-500/30 rounded-lg p-4 text-center">
              <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-2" />
              <p className="text-gray-300 text-xs font-medium">Zero Escape</p>
            </div>
          </div>

          {/* Key Quote */}
          <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-2 border-cyan-500/30 rounded-xl p-6 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-white mb-4 leading-relaxed">
              "One tenant should never impact another"
            </p>
            <div className="flex justify-center gap-12 text-gray-300">
              <div>
                <p className="text-base font-semibold text-green-400">Good Users</p>
                <p className="text-xs">Never feel the security</p>
              </div>
              <div className="w-px bg-gray-700"></div>
              <div>
                <p className="text-base font-semibold text-red-400">Bad Users</p>
                <p className="text-xs">Never escape it</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="text-center mt-4">
          <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            STRATIFY
          </p>
          <p className="text-gray-500 text-xs mt-1">Multi-Tenant SaaS Platform</p>
        </div>

      </div>
    </div>
  );
}