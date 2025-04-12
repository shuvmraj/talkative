const Chat = require('../models/chatModel');
const User = require('../models/userModel');

// @desc    Access or create a chat with a user
// @route   POST /api/chats
// @access  Private
const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'UserId param not sent with request' });
    }
    
    // Check if chat exists between the two users
    let chat = await Chat.find({
      isGroupChat: false,
      $and: [
        { participants: { $elemMatch: { $eq: req.user._id } } },
        { participants: { $elemMatch: { $eq: userId } } }
      ]
    }).populate('participants', '-password').populate('latestMessage');
    
    chat = await User.populate(chat, {
      path: 'latestMessage.sender',
      select: 'username profilePicture email'
    });
    
    if (chat.length > 0) {
      res.json(chat[0]);
    } else {
      // Create a new chat
      const otherUser = await User.findById(userId);
      
      if (!otherUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const chatData = {
        chatName: 'sender',
        isGroupChat: false,
        participants: [req.user._id, userId]
      };
      
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findById(createdChat._id).populate(
        'participants',
        '-password'
      );
      
      res.status(201).json(fullChat);
    }
  } catch (error) {
    console.error('Access chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all chats for a user
// @route   GET /api/chats
// @access  Private
const fetchChats = async (req, res) => {
  try {
    // Find all chats where the user is a participant
    let chats = await Chat.find({
      participants: { $elemMatch: { $eq: req.user._id } }
    })
      .populate('participants', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 }); // Sort by most recent update
    
    chats = await User.populate(chats, {
      path: 'latestMessage.sender',
      select: 'username profilePicture email'
    });
    
    res.json(chats);
  } catch (error) {
    console.error('Fetch chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a group chat
// @route   POST /api/chats/group
// @access  Private
const createGroupChat = async (req, res) => {
  try {
    const { name, participants } = req.body;
    
    if (!name || !participants || !participants.length) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Add current user to participants
    const participantIds = [...participants];
    
    // Check if current user is already included
    if (!participantIds.includes(req.user._id.toString())) {
      participantIds.push(req.user._id);
    }
    
    // Check if there are at least 3 participants (including the creator)
    if (participantIds.length < 3) {
      return res.status(400).json({ message: 'A group chat requires at least 3 participants' });
    }
    
    // Create the group chat
    const groupChat = await Chat.create({
      chatName: name,
      isGroupChat: true,
      participants: participantIds,
    });
    
    // Return the full chat data
    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate('participants', '-password');
    
    res.status(201).json(fullGroupChat);
  } catch (error) {
    console.error('Create group chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update chat wallpaper
// @route   PUT /api/chats/:chatId/wallpaper
// @access  Private
const updateChatWallpaper = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { wallpaper } = req.body;
    
    if (!wallpaper) {
      return res.status(400).json({ message: 'Wallpaper is required' });
    }
    
    // Check if chat exists and user is a participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: { $elemMatch: { $eq: req.user._id } }
    });
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found or you are not a participant' });
    }
    
    // Update wallpaper
    chat.wallpaper = wallpaper;
    await chat.save();
    
    res.json({ message: 'Wallpaper updated successfully', wallpaper });
  } catch (error) {
    console.error('Update wallpaper error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a chat
// @route   DELETE /api/chats/:chatId
// @access  Private
const deleteChat = async (req, res) => {
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
    
    // For group chats, only remove the user unless they're the last one
    if (chat.isGroupChat && chat.participants.length > 1) {
      // Remove user from participants
      await Chat.findByIdAndUpdate(chatId, {
        $pull: { participants: req.user._id }
      });
      
      return res.json({ message: 'You left the group chat' });
    }
    
    // Delete the chat if it's not a group chat or if it's the last participant
    await Chat.findByIdAndDelete(chatId);
    
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  updateChatWallpaper,
  deleteChat
}; 