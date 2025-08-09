import React from 'react'

const SuperAdminDashboard = () => {
  return (
     <div className="w-full">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6 border">
          <h2 className="text-lg font-semibold text-gray-700">Total Companies</h2>
          <p className="text-3xl font-bold mt-2 text-blue-600">12</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 border">
          <h2 className="text-lg font-semibold text-gray-700">Active Plans</h2>
          <p className="text-3xl font-bold mt-2 text-green-600">8</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 border">
          <h2 className="text-lg font-semibold text-gray-700">New Messages</h2>
          <p className="text-3xl font-bold mt-2 text-purple-600">5</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Recent Activity</h2>
        <ul className="space-y-2">
          <li className="p-4 bg-gray-100 rounded-md">📝 Company "X" updated their plan.</li>
          <li className="p-4 bg-gray-100 rounded-md">💬 New message from "ABC Ltd."</li>
          <li className="p-4 bg-gray-100 rounded-md">🔔 Payment received from "Z Corp".</li>
        </ul>
      </div>
    </div>
  )
}

export default SuperAdminDashboard
