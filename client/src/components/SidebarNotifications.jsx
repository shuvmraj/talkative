import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useChat } from "../context/ChatContext";

export default function SidebarNotifications({ showNotifications = false, notifications = [], setNotifications, setShowNotifications }) {
  const { chats, setCurrentChat: handleChatSelect } = useChat();

  // Ensure setShowNotifications is a function
  const handleClose = () => {
    if (typeof setShowNotifications === 'function') {
      setShowNotifications(false);
    } else {
      console.warn('setShowNotifications is not a function');
    }
  };
  // State to manage displayed notifications (limited to 5)
  const [displayedNotifications, setDisplayedNotifications] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Update displayed notifications when notifications change
  useEffect(() => {
    setDisplayedNotifications(notifications.slice(0, 5));
  }, [notifications]);
  
  // Handle refresh to load 2 more recent notifications
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate loading delay
    setTimeout(() => {
      // Get the next 2 notifications that aren't currently displayed
      const additionalNotifications = notifications.slice(5, 7);
      
      if (additionalNotifications.length > 0) {
        // Add the new notifications at the beginning and keep only 5 total
        setDisplayedNotifications([
          ...additionalNotifications,
          ...displayedNotifications.slice(0, 5 - additionalNotifications.length)
        ]);
      }
      
      setIsRefreshing(false);
    }, 800);
  };
  
  // Format notification content to ensure it shows "New message from [username]"
  const formatNotificationContent = (content) => {
    if (content.startsWith('New message from')) {
      return content;
    } else {
      // Extract username or use the whole content if format is unknown
      const parts = content.split(' ');
      const username = parts.length > 0 ? parts[parts.length - 1] : 'user';
      return `New message from ${username}`;
    }
  };
  
  return (
    <AnimatePresence>
      {showNotifications && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-16 right-3 w-64 bg-white rounded-lg shadow-lg z-50 border border-gray-200"
        >
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-800">Notifications</h3>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          {notifications.length === 0 ? (
            <div className="px-3 py-2 text-base text-gray-600" style={{ fontFamily: "'Space Grotesk', monospace" }}>No new notifications</div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {displayedNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-0"
                  onClick={() => {
                    if (notification.senderId) {
                      // Find the chat with this sender and open it
                      const chat = chats.find(c => 
                        c.participants && c.participants.some(p => p._id === notification.senderId)
                      );
                      if (chat) {
                        handleChatSelect(chat);
                      }
                      // Always close the notification panel
                      handleClose();
                    }
                  }}
                >
                  <div className="text-base text-gray-700" style={{ fontFamily: "'Space Grotesk', monospace" }}>
                    {formatNotificationContent(notification.content)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'Space Grotesk', monospace" }}>
                    {new Date(notification.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
              
              {notifications.length > 5 && (
                <div className="px-3 py-2 text-sm text-gray-500 italic" style={{ fontFamily: "'Space Grotesk', monospace" }}>
                  + {notifications.length - 5} more notification{notifications.length - 5 !== 1 ? 's' : ''}
                </div>
              )}
              
              {/* Refresh button to load more notifications */}
              {notifications.length > 5 && (
                <div className="px-3 py-2 border-t border-gray-200">
                  <button
                    onClick={handleRefresh}
                    className="w-full flex items-center justify-center text-sm text-gray-600 hover:text-gray-800 py-1"
                    style={{ fontFamily: "'Space Grotesk', monospace" }}
                    disabled={isRefreshing}
                  >
                    {isRefreshing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <RefreshCw size={14} />
                      </motion.div>
                    ) : (
                      <RefreshCw size={14} className="mr-2" />
                    )}
                    Refresh
                  </button>
                </div>
              )}
              
              {/* Clear all button */}
              <button
                onClick={() => setNotifications([])}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-800 py-2 border-t border-gray-200"
                style={{ fontFamily: "'Space Grotesk', monospace" }}
              >
                Clear all
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}