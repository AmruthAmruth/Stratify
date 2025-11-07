import { useNotifications } from '@/shared/utils/useNotifications';
import { RootState } from '@/store';
import React from 'react'
import { useSelector } from 'react-redux';

const Notification = () => {
    const userId = useSelector((state: RootState) => state.auth.userId);
   const { notifications } = useNotifications(userId!);
   console.log("Notification",notifications);
   
  return (
   <div className="w-80 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      <h3 className="font-bold mb-3">Notifications</h3>
      {notifications.length === 0 ? (
        <p className="text-gray-400 text-sm">No notifications</p>
      ) : (
        <ul>
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`p-2 rounded-md mb-1 ${
                n.isRead ? "bg-gray-100" : "bg-blue-50"
              }`}
            >
              <strong>{n.title}</strong>
              <p className="text-sm text-gray-600">{n.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Notification