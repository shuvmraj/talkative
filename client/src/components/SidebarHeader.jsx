import React from "react";
import { motion } from "framer-motion";
import { Bell, Globe } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

export default function SidebarHeader({ currentQuote, notifications, setShowNotifications }) {
  const { currentUser } = useAuth();
  const { chats } = useChat();

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-center mb-3">
        <div className="space-y-1 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black text-gray-800 flex items-center gap-2 tracking-tight" 
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            TALK'A-TIVE
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Globe className="text-gray-600" size={20} />
            </motion.div>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-500 italic" 
            style={{ fontFamily: "'Space Grotesk', monospace" }}
          >
            {currentQuote}
            <span className="block w-16 h-0.5 bg-gray-300 mx-auto mt-2"></span>
          </motion.p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 px-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold shadow-md border border-gray-200 text-lg">
            {currentUser.username.charAt(0).toUpperCase()}
          </div>
          <span className="text-gray-800 font-medium text-base" style={{ fontFamily: "'Space Grotesk', monospace" }}>
            {currentUser.username}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowNotifications(prev => !prev)}
            className="text-gray-600 hover:text-gray-800 border border-gray-200 rounded-full p-2 relative bg-white shadow-md"
          >
            <Bell size={16} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-800 rounded-full text-white text-xs flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}