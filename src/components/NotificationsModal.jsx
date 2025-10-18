import React from "react";
import { IoMdClose } from "react-icons/io";
import { MdNotifications, MdDeleteOutline } from "react-icons/md";
import { FaHeart, FaUserCircle } from "react-icons/fa";
import useNotifications from "../hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";

const NotificationsModal = ({ onClose }) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <MdNotifications className="text-emerald-600 text-2xl" />
            <h2 className="text-xl font-semibold text-gray-800">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            className="text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
            onClick={onClose}
            aria-label="Close"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Action Buttons */}
        {notifications.length > 0 && (
          <div className="flex gap-2 p-3 border-b border-gray-100">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={clearAllNotifications}
              className="text-xs text-red-600 hover:text-red-700 font-medium ml-auto"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <MdNotifications className="text-6xl mb-3" />
              <p className="text-lg">No notifications yet</p>
              <p className="text-sm">You'll see likes and activities here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative ${
                    !notification.read ? "bg-emerald-50/50" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-emerald-600 rounded-full" />
                  )}

                  <div className="flex gap-3 ml-3">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      {notification.triggeredByPhoto ? (
                        <img
                          src={notification.triggeredByPhoto}
                          alt="User"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="text-gray-400 text-4xl" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">
                            <span className="font-semibold">
                              {notification.triggeredByName}
                            </span>{" "}
                            <span className="text-gray-600">
                              liked your picture
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.createdAt
                              ? formatDistanceToNow(notification.createdAt, {
                                  addSuffix: true,
                                })
                              : "Just now"}
                          </p>
                        </div>

                        {/* Like icon */}
                        <FaHeart className="text-pink-500 text-lg flex-shrink-0" />
                      </div>

                      {/* Image thumbnail */}
                      {notification.imageUrl && (
                        <div className="mt-2">
                          <img
                            src={notification.imageUrl}
                            alt="Liked"
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      aria-label="Delete notification"
                    >
                      <MdDeleteOutline size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
