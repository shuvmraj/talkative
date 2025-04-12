const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  chatName: {
    type: String,
    trim: true,
    default: 'Chat' // Default name for chats
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  isGroupChat: {
    type: Boolean,
    default: false
  },
  wallpaper: {
    type: String,
    default: 't3.jpg' // Default wallpaper
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
chatSchema.index({ participants: 1 });

// Pre-middleware to populate participants and latest message when finding chats
chatSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'participants',
    select: '_id username email profilePicture'
  }).populate({
    path: 'latestMessage'
  });
  
  next();
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat; 