const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;
    
    if (!content || !chatId) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Check if chat exists and user is a participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: { $elemMatch: { $eq: req.user._id } }
    });
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found or you are not a participant' });
    }
    
    // Create the message
    const newMessage = await Message.create({
      sender: req.user._id,
      content: content,
      chat: chatId
    });
    
    // Populate sender and chat fields
    const message = await Message.findById(newMessage._id)
      .populate('sender', 'username profilePicture')
      .populate({
        path: 'chat',
        populate: {
          path: 'participants',
          select: 'username profilePicture'
        }
      });
    
    // Update the latestMessage field of the chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id });
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all messages for a chat
// @route   GET /api/messages/:chatId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    // Check if chat exists and user is a participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: { $elemMatch: { $eq: req.user._id } }
    });
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found or you are not a participant' });
    }
    
    // Find all messages for the chat
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'username profilePicture')
      .sort({ createdAt: 1 }); // Sort by oldest first
    
    // Mark messages as read by the current user
    await Message.updateMany(
      { chat: chatId, readBy: { $ne: req.user._id } },
      { $addToSet: { readBy: req.user._id } }
    );
    
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:messageId
// @access  Private
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    // Find the message
    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Check if the user is the sender of the message
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own messages' });
    }
    
    // Delete the message
    await Message.findByIdAndDelete(messageId);
    
    // Update latestMessage if this was the latest message
    const chat = await Chat.findById(message.chat);
    
    if (chat && chat.latestMessage && chat.latestMessage.toString() === messageId) {
      // Find the new latest message
      const newLatestMessage = await Message.findOne(
        { chat: message.chat },
        {},
        { sort: { createdAt: -1 } }
      );
      
      if (newLatestMessage) {
        chat.latestMessage = newLatestMessage._id;
      } else {
        chat.latestMessage = undefined;
      }
      
      await chat.save();
    }
    
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  deleteMessage
}; 