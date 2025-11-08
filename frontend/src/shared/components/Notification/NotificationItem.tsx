import React from "react";
import { INotification } from "./types";

interface Props {
  notification: INotification;
  onMarkRead?: (id: string) => void;
}

const typeColors = {
  info: "bg-blue-100 text-blue-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
};

const NotificationItem: React.FC<Props> = ({ notification, onMarkRead }) => {
  return (
    <div
      className={`p-3 mb-2 rounded-md cursor-pointer ${
        typeColors[notification.type]
      } ${notification.isRead ? "opacity-50" : "opacity-100"}`}
      onClick={() => onMarkRead?.(notification.id)}
    >
      <h4 className="font-semibold">{notification.title}</h4>
      <p className="text-sm">{notification.message}</p>
      <small>{new Date(notification.createdAt).toLocaleString()}</small>
    </div>
  );
};

export default NotificationItem; 