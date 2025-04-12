import React from "react";
import { motion } from "framer-motion";
import { UserPlus, Users, RefreshCw, LogOut } from "lucide-react";

export default function SidebarBottomMenu({ 
  setShowAddFriendDrawer, 
  handleRefresh, 
  isRefreshing, 
  logout 
}) {
  return (
    <div className="border-t border-gray-200 py-4 px-4 bg-white absolute bottom-0 left-0 right-0">
      <div className="flex items-center justify-around">
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAddFriendDrawer(true)}
          className="p-2 text-gray-600 hover:text-gray-800 flex flex-col items-center gap-1 transition-all duration-200 hover:bg-gray-100 rounded-lg"
          data-add-friend-trigger="true"
        >
          <UserPlus size={18} />
          <span className="text-sm" style={{ fontFamily: "'Space Grotesk', monospace" }}>Add Friend</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-gray-600 hover:text-gray-800 flex flex-col items-center gap-1 transition-all duration-200 hover:bg-gray-100 rounded-lg"
        >
          <Users size={18} />
          <span className="text-sm" style={{ fontFamily: "'Space Grotesk', monospace" }}>Friends</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRefresh}
          className="p-2 text-gray-600 hover:text-gray-800 flex flex-col items-center gap-1 transition-all duration-200 hover:bg-gray-100 rounded-lg"
        >
          <RefreshCw size={18} className={isRefreshing ? "text-gray-800" : ""} />
          <span className="text-sm" style={{ fontFamily: "'Space Grotesk', monospace" }}>Refresh</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={logout}
          className="p-2 text-gray-600 hover:text-gray-800 flex flex-col items-center gap-1 transition-all duration-200 hover:bg-gray-100 rounded-lg"
        >
          <LogOut size={18} />
          <span className="text-sm" style={{ fontFamily: "'Space Grotesk', monospace" }}>Logout</span>
        </motion.button>
      </div>
    </div>
  );
}