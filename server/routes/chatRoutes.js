const express = require('express');
const router = express.Router();
const { 
  accessChat, 
  fetchChats, 
  createGroupChat, 
  updateChatWallpaper, 
  deleteChat 
} = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');

// All chat routes are private
router.post('/', protect, accessChat);
router.get('/', protect, fetchChats);
router.post('/group', protect, createGroupChat);
router.put('/:chatId/wallpaper', protect, updateChatWallpaper);
router.delete('/:chatId', protect, deleteChat);

module.exports = router; 