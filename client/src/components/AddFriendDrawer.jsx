import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "../context/ChatContext";

export default function AddFriendDrawer({ showAddFriendDrawer, setShowAddFriendDrawer }) {
  const { addFriend, loading } = useChat();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const addFriendDrawerRef = useRef(null);

  // Handle adding a friend
  const handleAddFriend = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setSearchLoading(true);
    setError("");
    
    try {
      await addFriend(username);
      setUsername("");
      setShowAddFriendDrawer(false);
    } catch (err) {
      setError(err.message || "Failed to add friend");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showAddFriendDrawer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
        >
          <motion.div
            ref={addFriendDrawerRef}
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-lg border-r border-gray-200 p-5 flex flex-col"
            style={{ 
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              backgroundImage: "url('data:image/svg+xml;charset=utf-8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.05%22/%3E%3C/svg%3E')"
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Space Grotesk', monospace" }}>Add Friend</h2>
              <button 
                onClick={() => setShowAddFriendDrawer(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddFriend} className="flex-1 flex flex-col">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" style={{ fontFamily: "'Space Grotesk', monospace" }}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  style={{ fontFamily: "'Space Grotesk', monospace" }}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
              
              <button
                type="submit"
                disabled={searchLoading || !username.trim()}
                className={`mt-2 w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors ${searchLoading || !username.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ fontFamily: "'Space Grotesk', monospace" }}
              >
                {searchLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </div>
                ) : 'Add Friend'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}