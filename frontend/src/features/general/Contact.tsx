import React from 'react';
import { CheckCircle, Clock, Calendar, TrendingUp, Users, FileText, MessageSquare, Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-15">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Make Your Work <span className="text-indigo-600">Visible</span>
          </h1>
          <p className="text-xl text-gray-600">
            "My manager doesn't see the work I do" → <span className="line-through text-gray-400">"Hidden in emails & chats"</span>
          </p>
          <p className="text-2xl font-semibold text-green-600 mt-2">
            ✓ Now Every Contribution is Recognizable
          </p>
        </div>

        {/* Main Split Section */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          {/* Left Side - Hidden Work */}
          <div className="bg-gray-800 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <Mail className="absolute top-4 left-8 w-12 h-12 text-white" />
              <MessageSquare className="absolute top-20 right-12 w-10 h-10 text-white" />
              <FileText className="absolute bottom-16 left-16 w-14 h-14 text-white" />
              <Mail className="absolute bottom-8 right-8 w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-300 mb-4">Before Stratify</h3>
            <p className="text-gray-400 text-lg mb-6">Work scattered across platforms</p>
            
            <div className="space-y-4">
              <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                <p className="text-gray-300">📧 Email threads</p>
              </div>
              <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                <p className="text-gray-300">💬 Lost in chats</p>
              </div>
              <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                <p className="text-gray-300">📊 Google Sheets chaos</p>
              </div>
              <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                <p className="text-gray-300">❓ Invisible effort</p>
              </div>
            </div>
          </div>

          {/* Right Side - Visible Work with Stratify */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-indigo-600 mb-4">With Stratify</h3>
            <p className="text-gray-600 text-lg mb-6">Everything visible, every contribution counts</p>
            
            <div className="space-y-4">
              {/* Task Tracking */}
              <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Tasks Completed Today</p>
                      <p className="text-sm text-gray-600">8 of 10 tasks</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">80%</div>
                </div>
              </div>

              {/* Check-in/out */}
              <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Check-in Status</p>
                      <p className="text-sm text-gray-600">Active since 9:00 AM</p>
                    </div>
                  </div>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Checked In
                  </span>
                </div>
              </div>

              {/* Leave Approval */}
              <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Leave Request</p>
                      <p className="text-sm text-gray-600">Approved instantly</p>
                    </div>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>

              {/* Productivity Analytics */}
              <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Productivity Score</p>
                      <p className="text-sm text-gray-600">↑ 15% this week</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">92</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Row */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-center text-2xl font-bold text-gray-800 mb-6">
            One Platform. Complete Visibility.
          </h3>
          <div className="grid grid-cols-5 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="font-semibold text-gray-700">Task Tracking</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <p className="font-semibold text-gray-700">Check-in/out</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <p className="font-semibold text-gray-700">Leave Approvals</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <p className="font-semibold text-gray-700">Analytics</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <p className="font-semibold text-gray-700">Central Hub</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xl font-semibold text-gray-700">
            When work becomes visible, contribution becomes recognizable.
          </p>
          <p className="text-lg text-indigo-600 mt-2 font-medium">
            Powered by Stratify
          </p>
        </div>
      </div>
    </div>
  );
}