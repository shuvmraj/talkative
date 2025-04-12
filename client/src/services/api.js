import axios from 'axios';

// Get the current hostname to support both localhost and network access
const getApiUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'https://' : 'http://';
  const hostname = window.location.hostname;
  return `${protocol}${hostname}:5000/api`;
};

const API_URL = getApiUrl();

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const registerUser = (userData) => api.post('/users/register', userData);
export const loginUser = (userData) => api.post('/users/login', userData);
export const forgotPassword = (email) => api.post('/users/forgot-password', { email });
export const getUserProfile = () => api.get('/users/profile');
export const findUserByUsername = (username) => api.get(`/users/find/${username}`);
export const addFriend = (friendId) => api.post('/users/add-friend', { friendId });

// Chat API
export const accessChat = (userId) => api.post('/chats', { userId });
export const fetchChats = () => api.get('/chats');

// Message API
export const sendMessage = (content, chatId) => api.post('/messages', { content, chatId });
export const getMessages = (chatId) => api.get(`/messages/${chatId}`);
// Update the updateUserProfile function to match the server route
export const updateUserProfile = async (userData) => {
  return axios.put('/api/users/update-profile', userData, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};