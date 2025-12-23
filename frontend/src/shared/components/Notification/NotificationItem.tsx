import React from "react";
import { INotification } from "./types";
import { Trash2, Mail, MailOpen } from "lucide-react";

interface Props {
  notification: INotification;
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const NotificationItem: React.FC<Props> = ({
  notification,
  onMarkRead,
  onDelete,
}) => {
  return (
    <div
      className={`p-4 rounded-lg border border-accent flex items-start justify-between transition-all duration-300 hover:shadow-md ${notification.isRead ? "bg-white" : "bg-accent/40 shadow-sm"
        }`}
    >
      {/* Left: Notification content + unread dot */}
      <div
        className="flex items-start gap-4 flex-1 cursor-pointer select-none"
        onClick={() => notification.id && onMarkRead?.(notification.id)}
      >
        {/* Unread indicator dot */}
        {!notification.isRead && (
          <div className="w-3 h-3 bg-primary rounded-full mt-1 flex-shrink-0" />
        )}

        {/* Text content */}
        <div className="space-y-1.5">
          <h4
            className={`text-base text-text ${notification.isRead ? "font-medium" : "font-bold"
              }`}
          >
            {notification.title}
          </h4>
          <p className="text-sm text-text/75 leading-relaxed">
            {notification.message}
          </p>
          <small className="text-xs text-text/50 block">
            {new Date(notification.createdAt).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </small>
        </div>
      </div>

      {/* Right: Action icons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Mark as read/unread */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent content click
            void (notification.id && onMarkRead?.(notification.id));
          }}
          className="p-2 hover:bg-accent rounded-full transition-colors duration-200"
          title={notification.isRead ? "Mark as Unread" : "Mark as Read"}
        >
          {notification.isRead ? (
            <MailOpen className="w-5 h-5 text-text/50" />
          ) : (
            <Mail className="w-5 h-5 text-primary" />
          )}
        </button>

        {/* Delete */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent content click
            void (notification.id && onDelete?.(notification.id));
          }}
          className="p-2 hover:bg-red-50 rounded-full transition-colors duration-200 group"
          title="Delete Notification"
        >
          <Trash2 className="w-5 h-5 text-text/50 group-hover:text-red-600 transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;