import React, { useState, useEffect } from "react";
import { useChat } from "../context/ChatContext";

import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import AppSideBar from "../components/AppSideBar";

export default function ChatPageWindow() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { currentChat } = useChat();

  // Check if we're on mobile and set initial sidebar state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setShowSidebar(!currentChat);
      } else {
        setShowSidebar(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [currentChat]);

  // Auto-hide sidebar when chat is selected on mobile
  useEffect(() => {
    if (isMobile && currentChat) {
      setShowSidebar(false);
    }
  }, [currentChat, isMobile]);

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden relative">
      {/* Mobile menu toggle - removed for mobile view */}
      
      {/* Sidebar with responsive behavior */}
      <AnimatePresence mode="wait">
        {showSidebar && (
          <motion.div 
            initial={isMobile ? { x: -380 } : { x: 0 }}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -380 } : { x: 0 }}
            transition={{ duration: 0.3 }}
            className={`${isMobile ? 'absolute inset-y-0 left-0 z-40' : 'relative'}`}
            style={{ width: isMobile ? '85%' : '380px', maxWidth: isMobile ? '85%' : '30%' }}
          >
            <AppSideBar onChatSelect={isMobile ? () => setShowSidebar(false) : undefined} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chat window that takes remaining space */}
      <div className={`flex-grow overflow-hidden transition-all duration-300 ${isMobile && showSidebar ? 'opacity-50' : 'opacity-100'}`}>
        <ChatWindow onBackClick={isMobile ? () => setShowSidebar(true) : undefined} />
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && showSidebar && (
        <div 
          className="absolute inset-0 bg-black/50 z-30"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
}