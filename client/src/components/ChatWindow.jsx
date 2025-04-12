import React from "react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { Send, Image, Phone, Video, Clock, Calendar, X, Check, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWindow({ onBackClick }) {
  const { currentUser } = useAuth();
  const { currentChat, messages, sendMessage, loading } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [showWallpaperOptions, setShowWallpaperOptions] = useState(false);
  const [wallpaper, setWallpaper] = useState("t3.jpg");
  
  // Message scheduling states
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [scheduledMessages, setScheduledMessages] = useState([]);


  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Check for scheduled messages every minute
  useEffect(() => {
    const interval = setInterval(() => {
      checkScheduledMessages();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [scheduledMessages]);
  
  function checkScheduledMessages() {
    const now = new Date();
    
    const messagesToSend = scheduledMessages.filter(msg => {
      const scheduledDateTime = new Date(msg.scheduledDateTime);
      return scheduledDateTime <= now;
    });
    
    if (messagesToSend.length > 0) {
      messagesToSend.forEach(msg => {
        // Fix: Pass the content to sendMessage
        // Instead of just sending the content, we ensure it's sent as the current user
        sendMessage(msg.content);
      });
      
      // Remove sent messages from scheduled list
      setScheduledMessages(prev => 
        prev.filter(msg => {
          const scheduledDateTime = new Date(msg.scheduledDateTime);
          return scheduledDateTime > now;
        })
      );
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleSendMessage(e) {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    sendMessage(newMessage);
    setNewMessage("");
  }
  
  function handleScheduleMessage() {
    if (!newMessage.trim() || !scheduledDate || !scheduledTime) return;
    
    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    
    if (scheduledDateTime <= new Date()) {
      alert("Please select a future date and time");
      return;
    }
    
    const newScheduledMessage = {
      id: Date.now(),
      content: newMessage,
      scheduledDateTime: scheduledDateTime,
      // Fix: Add sender information to ensure it appears as sent by current user when delivered
      sender: currentUser._id
    };
    
    setScheduledMessages(prev => [...prev, newScheduledMessage]);
    setNewMessage("");
    setScheduledDate("");
    setScheduledTime("");
    setShowScheduler(false);
    
    // Silently schedule the message without alert
  }
  
  function cancelScheduledMessage(id) {
    setScheduledMessages(prev => prev.filter(msg => msg.id !== id));
  }
  


  function getChatName() {
    if (!currentChat) return "";
    
    const otherParticipant = currentChat.participants.find(
      participant => participant._id !== currentUser._id
    );
    
    return otherParticipant ? otherParticipant.username : "Unknown User";
  }

  function changeWallpaper(newWallpaper) {
    setWallpaper(newWallpaper);
    setShowWallpaperOptions(false);
  }

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center text-gray-600" style={{ fontFamily: "'Space Grotesk', monospace" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <Calendar size={48} className="mx-auto text-black mb-4" />
            <p className="text-xl font-semibold" style={{ fontFamily: "'Space Grotesk', monospace" }}>Select a chat to start messaging</p>
            <p className="text-sm" style={{ fontFamily: "'Space Grotesk', monospace" }}>Schedule messages or choose from templates</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
      {/* Add this to hide any parent menu icons */}
      <style jsx global>{`
        .sidebar-toggle-button {
          display: none !important;
        }
      `}</style>
      
      {/* Background with solid color and dark overlay */}
      <div className="absolute inset-0 bg-black/60" /> {/* Dark overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("/${wallpaper}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: '0.9',
          mixBlendMode: 'overlay',
          filter: 'blur(3px)' // Added blur effect
        }}
      />
      
      {/* Header with improved mobile layout */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-800 text-white flex items-center justify-center font-bold shadow-lg rounded-full">
              {getChatName().charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-medium text-gray-800 text-lg" style={{ fontFamily: "'Space Grotesk', monospace" }}>{getChatName()}</h2>
              <span className="text-sm text-gray-600" style={{ fontFamily: "'Space Grotesk', monospace" }}>Online</span>
            </div>
          </div>
          
          {/* Rest of the header */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-black hover:text-black p-2"
            >
              <Phone size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-black hover:text-black p-2"
            >
              <Video size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowWallpaperOptions(!showWallpaperOptions)}
              className="text-black hover:text-black p-2"
            >
              <Image size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onBackClick && onBackClick()}
              className="text-black hover:text-black p-2 md:hidden"
            >
              <Menu size={20} />
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Wallpaper options */}
      <AnimatePresence>
        {showWallpaperOptions && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 right-4 bg-white/10 backdrop-blur-xl p-4 rounded-lg shadow-xl z-20 border border-white/20"
          >
            <div className="text-sm font-light mb-3 text-white/90">Choose wallpaper</div>
            <div className="grid grid-cols-3 gap-3">
              {['t1.jpg', 't2.jpeg', 't3.jpg','t4.jpg','t5.jpg','t6.jpg','t7.jpg','t8.jpg','t9.jpg','t10.jpg'].map((wp) => (
                <motion.div 
                  key={wp}
                  whileHover={{ scale: 1.05 }}
                  className={`h-16 w-16 rounded-lg cursor-pointer border-2 ${
                    wallpaper === wp ? 'border-gray-800' : 'border-transparent'
                  }`}
                  style={{ 
                    backgroundImage: `url("/${wp}")`, 
                    backgroundSize: 'cover',
                    filter: 'brightness(0.9) contrast(1.1)'
                  }}
                  onClick={() => changeWallpaper(wp)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Messages container with custom scrollbar */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map(message => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={message._id}
              className={`flex ${message.sender._id === currentUser._id ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${message.sender._id === currentUser._id ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900 shadow-sm'}`}
              >
                <div className="text-sm" style={{ fontFamily: "'Space Grotesk', monospace" }}>{message.content}</div>
                <div className="text-xs mt-1 opacity-90" style={{ fontFamily: "'Space Grotesk', monospace" }}>
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Scheduled messages badge */}
      {scheduledMessages.length > 0 && (
        <div className="px-4 py-2 bg-white/5 backdrop-blur-lg border-t border-white/10 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Clock size={14} />
              <span>{scheduledMessages.length} scheduled message{scheduledMessages.length > 1 ? 's' : ''}</span>
            </div>
            <button 
              onClick={() => setScheduledMessages([])}
              className="text-xs text-white/60 hover:text-white/90"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
      
      {/* Message scheduler */}
      <AnimatePresence>
        {showScheduler && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 left-0 right-0 mx-4 bg-black/50 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-2xl z-20"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Schedule Message</h3>
              <button 
                onClick={() => setShowScheduler(false)}
                className="text-white/60 hover:text-white/90 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm text-white/80 mb-2">Date</label>
                <input 
                  type="date" 
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-800/50"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-white/80 mb-2">Time</label>
                <input 
                  type="time" 
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-800/50"
                />
              </div>
            </div>
            
            <button
              onClick={handleScheduleMessage}
              disabled={!newMessage.trim() || !scheduledDate || !scheduledTime}
              className="w-full px-4 py-3 bg-gray-800/80 text-white rounded-lg hover:bg-gray-900/80 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium backdrop-blur-sm transition-colors"
            >
              Schedule Message
            </button>
          </motion.div>
        )}
      </AnimatePresence>


      
      {/* Message input */}
      <div className="p-4 bg-white border-t border-gray-200 relative z-10">
        <form onSubmit={handleSendMessage} className="flex gap-3 flex-col">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-gray-50 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800/50 focus:border-transparent placeholder-gray-400"
              style={{ fontFamily: "'Space Grotesk', monospace" }}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <div className="flex gap-2">

              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowScheduler(!showScheduler)}
                className="px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800/50 transition-colors"
              >
                <Clock size={18} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit" 
                className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={!newMessage.trim()}
              >
                <Send size={18} />
              </motion.button>
            </div>
          </div>
          
          {/* Scheduled messages list */}
          {scheduledMessages.length > 0 && (
            <div className="mt-2 p-2 bg-white/5 backdrop-blur-lg rounded-lg max-h-32 overflow-y-auto">
              <div className="text-xs font-light text-white/80 mb-1" style={{ fontFamily: "'Space Grotesk', monospace" }}>Scheduled Messages:</div>
              {scheduledMessages.map(msg => (
                <div key={msg.id} className="flex justify-between items-center py-1 border-b border-white/10 last:border-0">
                  <div className="flex-1">
                    <div className="text-xs font-light text-white/90 truncate" style={{ fontFamily: "'Space Grotesk', monospace" }}>{msg.content}</div>
                    <div className="text-xs text-white/60" style={{ fontFamily: "'Space Grotesk', monospace" }}>
                      {new Date(msg.scheduledDateTime).toLocaleString()}
                    </div>
                  </div>
                  <button 
                    onClick={() => cancelScheduledMessage(msg.id)}
                    className="text-red-500 hover:text-red-800 ml-2"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}