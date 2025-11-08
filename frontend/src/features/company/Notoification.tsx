import NotificationBoard from '@/shared/components/Notification/NotificationBoard'
import React from 'react'

const Notification = () => {
  return (
     <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Company Dashboard</h1>
      <NotificationBoard />
    </div>
  )
}

export default Notification