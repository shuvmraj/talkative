const express = require('express');
const router = express.Router();
const { 
  sendMessage, 
  getMessages, 
  deleteMessage 
} = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

// All message routes are private
router.post('/', protect, sendMessage);
router.get('/:chatId', protect, getMessages);
router.delete('/:messageId', protect, deleteMessage);

module.exports = router; 