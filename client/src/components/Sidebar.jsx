import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { motion, AnimatePresence } from "framer-motion";

// Import modular components
import SidebarHeader from "./SidebarHeader";
import SidebarSearch from "./SidebarSearch";
import SidebarChatList from "./SidebarChatList";
import SidebarNotifications from "./SidebarNotifications";
import SidebarBottomMenu from "./SidebarBottomMenu";
import AddFriendDrawer from "./AddFriendDrawer";

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  const { chats, setCurrentChat, currentChat, searchUser, addFriend, refreshChats, setChats } = useChat();
  
  // State management
  const [showAddFriendDrawer, setShowAddFriendDrawer] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentQuote, setCurrentQuote] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Refs
  const sidebarRef = useRef(null);
  const sidebarWidth = 380;

  // Quotes for random display
  const quotes = [
    "Every connection is a new beginning.",
    "Together we grow stronger.",
    "Bridge the gap, one chat at a time.",
    "Words connect hearts across distances.",
    "In every conversation lies a new possibility."
  ];

  // Set random quote on load
  useEffect(() => {
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  // Function to get chat name
  const getChatName = (chat) => {
    if (!chat || !chat.participants) return "Unknown User";
    const otherParticipant = chat.participants.find(
      participant => participant._id !== currentUser._id
    );
    return otherParticipant ? otherParticipant.username : "Unknown User";
  };

  // Check for unread messages
  useEffect(() => {
    const unreadExists = chats.some(chat => chat.messages?.some(msg => !msg.read));
    setHasUnread(unreadExists);
  }, [chats]);

  // Handle notifications for new messages and friend connections
  useEffect(() => {
    const hasNewMessage = chats.some(chat => 
      chat.latestMessage && 
      !chat.latestMessage.read && 
      chat.latestMessage.sender._id !== currentUser._id
    );

    if (hasNewMessage) {
      const newNotifications = chats
        .filter(chat => 
          chat.latestMessage && 
          !chat.latestMessage.read && 
          chat.latestMessage.sender._id !== currentUser._id
        )
        .map(chat => ({
          id: chat.latestMessage._id,
          type: 'message',
          content: `New message from ${getChatName(chat)}`,
          timestamp: new Date(chat.latestMessage.timestamp)
        }));
      setNotifications(prev => [...newNotifications, ...prev]);
    }
  }, [chats, currentUser._id]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshChats();
    } catch (error) {
      console.error("Error refreshing chats:", error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 800); // Give at least 800ms of animation
    }
  };

  // Handle search functionality
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
  
    setIsSearching(true);
  
    // Filter local chats first
    const filteredChats = chats.filter(chat => 
      getChatName(chat).toLowerCase().includes(query.toLowerCase())
    );
  
    // Search for users if query is long enough
    if (query.length >= 3) {
      try {
        const users = await searchUser(query);
        const newUsers = users.filter(user => 
          user._id !== currentUser._id && 
          !chats.some(chat => 
            chat.participants.some(p => p._id === user._id)
          )
        );
        setSearchResults([...filteredChats, ...newUsers]);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults(filteredChats);
      }
    } else {
      setSearchResults(filteredChats);
    }
    setIsSearching(false);
  };

  // Handle chat deletion
  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat?')) {
      const updatedChats = chats.filter(chat => chat._id !== chatId);
      if (currentChat?._id === chatId) {
        setCurrentChat(null);
      }
      // Update the chats state
      setChats(updatedChats);
    }
  };

  // Handle chat selection
  const handleChatSelect = async (item) => {
    if (!item) return;
    
    if (item._id && !item.participants) {
      // Handle adding new friend
      try {
        await addFriend(item._id);
        setSearchQuery("");
        setSearchResults([]);
        await refreshChats();
      } catch (error) {
        console.error("Error adding friend:", error);
        setError("Failed to add friend");
      }
    } else if (item.participants) {
      // Handle selecting existing chat
      setCurrentChat(item);
    }
  };

  return (
    <>
      {/* Main sidebar container */}
      <div 
        ref={sidebarRef}
        className="border-r border-gray-200 h-full flex flex-col relative shadow-lg transition-all duration-300 ease-in-out"
        style={{ 
          width: sidebarWidth,
          background: "white",
          fontFamily: "'Outfit', 'Space Grotesk', 'Inter', sans-serif",
          backgroundImage: "url('data:image/svg+xml;charset=utf-8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.05%22/%3E%3C/svg%3E')",
          fontSize: "1.1rem"
        }}
      >
        {/* Header Component */}
        <SidebarHeader 
          currentQuote={currentQuote} 
          notifications={notifications} 
          setShowNotifications={setShowNotifications} 
        />

        {/* Search Component */}
        <SidebarSearch 
          searchQuery={searchQuery} 
          isSearching={isSearching} 
          handleSearch={handleSearch} 
        />

        {/* Chat List Component */}
        <SidebarChatList 
          chats={chats} 
          searchQuery={searchQuery} 
          searchResults={searchResults} 
          currentChat={currentChat} 
          handleChatSelect={handleChatSelect} 
          handleDeleteChat={handleDeleteChat} 
          getChatName={getChatName} 
        />
        
        {/* Notifications Component */}
        <SidebarNotifications 
          showNotifications={showNotifications} 
          notifications={notifications} 
          setNotifications={setNotifications}
          setShowNotifications={setShowNotifications} 
        />

        {/* Bottom Menu Component */}
        <SidebarBottomMenu 
          setShowAddFriendDrawer={setShowAddFriendDrawer} 
          handleRefresh={handleRefresh} 
          isRefreshing={isRefreshing} 
          logout={logout} 
        />
      </div>

      {/* Add Friend Drawer Component */}
      <AddFriendDrawer 
        showAddFriendDrawer={showAddFriendDrawer} 
        setShowAddFriendDrawer={setShowAddFriendDrawer} 
      />
    </>
  );
}