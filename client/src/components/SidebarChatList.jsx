import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

export default function SidebarChatList({ chats, searchQuery, searchResults, currentChat, handleChatSelect, handleDeleteChat, getChatName }) {
  const { currentUser } = useAuth();
  

  // Generate consistent colors for usernames
  const getColorForName = (name) => {
    const colors = ['#f5f5f5', '#eeeeee', '#e0e0e0', '#d6d6d6'];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20" style={{ scrollbarWidth: 'thin', height: "calc(100% - 180px)" }}>
      <div className="w-full">
        {(searchQuery ? searchResults : chats).map((item, index) => {
          try {
            const name = item.participants ? getChatName(item) : item.username;
            const color = getColorForName(name);
            const isSelected = currentChat && item.participants && currentChat._id === item._id;
            
            return (
              <div 
                key={item._id || index}
                onClick={() => handleChatSelect(item)}
                className={`hover:bg-gray-100 py-4 transition-all duration-300 border-b border-gray-200 last:border-0 group cursor-pointer ${isSelected ? 'bg-gray-100 border-l-2 border-gray-500' : ''}`}
              >
                <div className={`w-full flex items-center px-5 gap-3 group relative`}>
                  <div 
                    className="w-12 h-12 rounded-xl text-gray-700 flex items-center justify-center font-medium text-base shadow-md transition-all duration-200 border border-gray-200"
                    style={{ 
                      background: color,
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                    }}
                  >
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-800 text-base" style={{ fontFamily: "'Space Grotesk', monospace" }}>
                        {name}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 truncate mt-1" style={{ fontFamily: "'Space Grotesk', monospace" }}>
                      {item.latestMessage?.content || (item.participants ? "Start a new conversation" : "Click to connect")}
                    </div>
                  </div>
                  {item.participants && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleDeleteChat(item._id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 hover:bg-gray-200 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.button>
                  )}
                </div>
              </div>
            );
          } catch (error) {
            console.error("Error rendering item:", error);
            return (
              <div className="w-full px-4 py-2 text-gray-500 text-sm">
                Error loading item
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}