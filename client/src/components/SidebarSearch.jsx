import React from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw } from "lucide-react";

export default function SidebarSearch({ searchQuery, isSearching, handleSearch }) {
  return (
    <div className="px-4 py-3 border-b border-gray-200">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search chats or users..."
          className="w-full bg-gray-100 text-gray-700 pl-10 pr-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 text-base"
          style={{ fontFamily: "'Space Grotesk', monospace" }}
          value={searchQuery}
          onChange={handleSearch}
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw size={16} className="text-gray-400" />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}