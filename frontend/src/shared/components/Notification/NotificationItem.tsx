import React from "react";
import { INotification } from "./types";
import { Trash2, Mail, MailOpen } from "lucide-react";

interface Props {
  notification: INotification;
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const typeColors = {
  info: "bg-blue-100 text-blue-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
};

const NotificationItem: React.FC<Props> = ({
  notification,
  onMarkRead,
  onDelete,
}) => {
  return (
    <div
      className={`p-3 mb-2 rounded-md transition-opacity duration-300 shadow-sm border flex items-start justify-between ${
        typeColors[notification.type]
      } ${notification.isRead ? "opacity-60" : "opacity-100"}`}
    >
      {/* Left: Notification content */}
      <div
        className="flex-1 cursor-pointer"
        onClick={() => onMarkRead?.(notification.id)}
      >
        <h4 className="font-semibold text-sm">{notification.title}</h4>
        <p className="text-xs">{notification.message}</p>
        <small className="text-[10px] opacity-70">
          {new Date(notification.createdAt).toLocaleString()}
        </small>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center gap-2 ml-3">
        {/* Read/Unread Toggle */}
        <button
          onClick={() => onMarkRead?.(notification.id)}
          className="p-1 hover:bg-gray-200 rounded-full"
          title={notification.isRead ? "Mark as Unread" : "Mark as Read"}
        >
          {notification.isRead ? (
            <MailOpen className="w-4 h-4 text-gray-600" />
          ) : (
            <Mail className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* Delete Notification */}
        <button
          onClick={() => onDelete?.(notification.id)}
          className="p-1 hover:bg-gray-200 rounded-full"
          title="Delete Notification"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
