import React, { useEffect } from 'react';
import { useChat } from '../context/ChatContext';

const Notifications = () => {
  const { notifications, clearNotifications } = useChat();

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        clearNotifications();
      }, 5000); // Clear notifications after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [notifications, clearNotifications]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      {notifications.map((notification, index) => (
        <div
          key={index}
          className={`
            mb-2 p-4 rounded-lg shadow-lg
            transform transition-all duration-500 ease-in-out
            ${notification.type === 'connection' ? 'bg-blue-500' : 'bg-green-500'}
            text-white
          `}
        >
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;