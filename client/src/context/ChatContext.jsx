import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { 
  fetchChats, 
  accessChat, 
  getMessages, 
  sendMessage as apiSendMessage,
  findUserByUsername,
  addFriend as apiAddFriend
} from "../services/api";
import { 
  initiateSocket, 
  disconnectSocket, 
  joinChat, 
  sendSocketMessage, 
  subscribeToMessages,
  subscribeToUserConnections 
} from "../services/socket";

const ChatContext = createContext();

export function useChat() {
  return useContext(ChatContext);
}

export function ChatProvider({ children }) {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const socket = initiateSocket();
      
      subscribeToUserConnections((userData) => {
        if (userData._id !== currentUser._id) {
          setNotifications(prev => [
            ...prev,
            { type: 'connection', message: `${userData.username} has connected`, timestamp: new Date() }
          ]);
        }
      });

      return () => {
        disconnectSocket();
      };
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadChats();
    } else {
      setChats([]);
      setCurrentChat(null);
      setMessages([]);
      setError(null);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentChat) {
      joinChat(currentChat._id);
      loadMessages(currentChat._id);
      
      const handleNewMessage = (newMessage) => {
        if (newMessage.chat._id === currentChat._id) {
          setMessages(prevMessages => [...prevMessages, newMessage]);
          
          // Update chat's latest message
          setChats(prevChats => 
            prevChats.map(chat => 
              chat._id === currentChat._id 
                ? { ...chat, latestMessage: newMessage }
                : chat
            )
          );
        }
      };

      subscribeToMessages(handleNewMessage);
    }
  }, [currentChat]);

  const loadChats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchChats();
      setChats(response.data);
    } catch (error) {
      setError("Failed to load chats. Please try again.");
      console.error("Load chats error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMessages(chatId);
      setMessages(response.data);
    } catch (error) {
      setError("Failed to load messages. Please try again.");
      console.error("Load messages error:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content) => {
    if (!currentChat || !content.trim()) return;

    try {
      setError(null);
      const response = await apiSendMessage(content, currentChat._id);
      
      sendSocketMessage({
        ...response.data,
        chatId: currentChat._id
      });
      
      setMessages(prevMessages => [...prevMessages, response.data]);
      
      // Update chat's latest message
      setChats(prevChats => 
        prevChats.map(chat => 
          chat._id === currentChat._id 
            ? { ...chat, latestMessage: response.data }
            : chat
        )
      );
      
      return response.data;
    } catch (error) {
      setError("Failed to send message. Please try again.");
      console.error("Send message error:", error);
    }
  };

  const searchUser = async (username) => {
    try {
      setError(null);
      const response = await findUserByUsername(username);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "User not found";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const addFriend = async (usernameOrId) => {
    try {
      setError(null);
      let userId = usernameOrId;

      // If the input looks like a username (not an ObjectId), search for the user first
      if (!/^[0-9a-fA-F]{24}$/.test(usernameOrId)) {
        const userResponse = await findUserByUsername(usernameOrId);
        userId = userResponse.data._id;
      }

      await apiAddFriend(userId);
      const chatResponse = await accessChat(userId);
      
      setChats(prevChats => {
        const chatExists = prevChats.some(chat => chat._id === chatResponse.data._id);
        if (!chatExists) {
          return [chatResponse.data, ...prevChats];
        }
        return prevChats;
      });
      
      return chatResponse.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to add friend";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value = {
    chats,
    currentChat,
    setCurrentChat,
    messages,
    loading,
    error,
    sendMessage,
    searchUser,
    addFriend,
    refreshChats: loadChats,
    notifications,
    clearNotifications: () => setNotifications([])
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}