const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  findUserByUsername, 
  addFriend,
  forgotPassword
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);

// Private routes
router.get('/profile', protect, getUserProfile);
router.put('/update-profile', protect, updateUserProfile);
router.get('/find/:username', protect, findUserByUsername);
router.post('/add-friend', protect, addFriend);

module.exports = router; 