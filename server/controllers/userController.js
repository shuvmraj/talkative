const User = require('../models/userModel');
const { generateToken } = require('../utils/jwtUtils');
const { sendPasswordRecoveryEmail, sendWelcomeEmail } = require('../utils/emailService');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (userExists) {
      if (userExists.email === email) {
        return res.status(400).json({ message: 'Email already in use' });
      } else {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }
    
    // Store password as plain text
    const user = await User.create({
      username,
      email,
      password // Plain text password as per requirements
    });
    
    if (user) {
      // Send welcome email
      sendWelcomeEmail(email, username);
      
      // Return user data with token
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check if password matches (plain text comparison)
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Update last active
    user.lastActive = Date.now();
    await user.save();
    
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // User is already available from auth middleware
    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/update-profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user fields
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    
    // If password is provided, update it
    if (req.body.password) {
      user.password = req.body.password; // Plain text password
    }
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      token: generateToken(updatedUser._id)
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Find user by username
// @route   GET /api/users/find/:username
// @access  Private
const findUserByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    
    // Find user by username excluding password
    const user = await User.findOne({ username }).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't return user's own profile
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot add yourself as a friend' });
    }
    
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error('Find user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add friend by ID
// @route   POST /api/users/add-friend
// @access  Private
const addFriend = async (req, res) => {
  try {
    const friendId = req.body.friendId;
    
    // Check if friendId is valid
    if (!friendId) {
      return res.status(400).json({ message: 'Friend ID is required' });
    }
    
    // Check if friend exists
    const friend = await User.findById(friendId);
    
    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if friend is not the user
    if (friendId === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot add yourself as a friend' });
    }
    
    const user = await User.findById(req.user._id);
    
    // Check if already friends
    if (user.isFriendWith(friendId)) {
      return res.status(400).json({ message: 'User is already in your friends list' });
    }
    
    // Add to friends list (for both users)
    user.friends.push(friendId);
    await user.save();
    
    friend.friends.push(req.user._id);
    await friend.save();
    
    res.status(200).json({ message: 'Friend added successfully', userId: friendId });
  } catch (error) {
    console.error('Add friend error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Recover password by email
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }
    
    // Get the plaintext password directly
    const plainPassword = user.password;
    
    // Send password recovery email
    const emailSent = await sendPasswordRecoveryEmail(user.email, user.username, plainPassword);
    
    if (emailSent) {
      res.status(200).json({ message: 'Password recovery email sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send password recovery email' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  findUserByUsername,
  addFriend,
  forgotPassword
}; 