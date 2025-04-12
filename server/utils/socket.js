const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');

module.exports = (io) => {
  // Keep track of online users
  const onlineUsers = new Map();
  
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }
      
      socket.user = user;
      next();
    } catch (error) {
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username}`);
    
    // Add user to online users
    onlineUsers.set(socket.user._id.toString(), socket.id);
    
    // Send user connected notification to all clients
    io.emit('user_connected', {
      _id: socket.user._id,
      username: socket.user.username
    });
    
    // User joins a chat
    socket.on('join_chat', (chatId) => {
      console.log(`User ${socket.user.username} joined chat: ${chatId}`);
      socket.join(chatId);
    });
    
    // User sends a message
    socket.on('send_message', async (messageData) => {
      try {
        const chat = await Chat.findById(messageData.chat._id || messageData.chatId);
        if (!chat) return;
        
        // Emit the message to all users in the chat
        io.to(messageData.chat._id || messageData.chatId).emit('receive_message', messageData);
        
        // Send notification to offline users or users not in the current chat
        chat.participants.forEach((userId) => {
          const userSocketId = onlineUsers.get(userId.toString());
          
          // If user is not the sender and either not online or not in the current chat
          if (userId.toString() !== socket.user._id.toString() && userSocketId) {
            const socketInstance = io.sockets.sockets.get(userSocketId);
            
            // Check if the user is in the room (chat)
            const isInChat = socketInstance?.rooms?.has(messageData.chat._id || messageData.chatId);
            
            if (!isInChat) {
              io.to(userSocketId).emit('new_message_notification', {
                chat: messageData.chat,
                sender: socket.user.username,
                message: messageData.content.substring(0, 30) + (messageData.content.length > 30 ? '...' : '')
              });
            }
          }
        });
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });
    
    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.username}`);
      onlineUsers.delete(socket.user._id.toString());
      io.emit('user_disconnected', {
        _id: socket.user._id,
        username: socket.user.username
      });
    });
  });
}; 